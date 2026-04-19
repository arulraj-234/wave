from flask import Blueprint, request, jsonify
from db import execute_query, fetch_all, fetch_one
import requests
import uuid
import html
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

from engine.ranker import get_dynamic_taste_profile

from config import Config

jiosaavn_bp = Blueprint('jiosaavn', __name__)

SAAVN_API_BASE = Config.SAAVN_API_URL.rstrip('/') # Handle trailing slashes gracefully
print(f"[JioSaavn Config] Active API Base: {SAAVN_API_BASE}")


def log_error(msg, url=None, resp_text=None):
    """Deep logger for debugging API errors."""
    error_msg = f"[JioSaavn Route Error] {msg}"
    if url:
        error_msg += f" | URL: {url}"
    if resp_text:
        error_msg += f" | Response (first 500): {str(resp_text)[:500]}"
    print(error_msg)


def get_preferred_quality(user_id=None):
    if not user_id:
        return 'high'
    try:
        user = fetch_one("SELECT streaming_quality FROM users WHERE user_id = %s", (user_id,))
        return user.get('streaming_quality', 'high') if user else 'high'
    except:
        return 'high'


@jiosaavn_bp.route('/search', methods=['GET'])
def search_global():
    """Proxy search to the JioSaavn microservice and return results by type."""
    query = request.args.get('query', '').strip()
    search_type = request.args.get('type', 'song').lower().rstrip('s') # Normalize to singular: song, artist, album, playlist
    limit = request.args.get('limit', '20')
    
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400
    
    user_id = request.args.get('user_id')
    preferred_quality = get_preferred_quality(user_id)
    
    # Map our internal type to JioSaavn API plural endpoint
    endpoint_map = {
        'song': 'songs',
        'artist': 'artists',
        'album': 'albums',
        'playlist': 'playlists',
        'all': '' # Base /search endpoint
    }
    endpoint = endpoint_map.get(search_type, 'songs')
    
    try:
        url = f"{SAAVN_API_BASE}/search"
        if endpoint:
            url += f"/{endpoint}"
            
        resp = requests.get(
            url,
            params={'query': query, 'limit': limit},
            timeout=60
        )
        try:
            data = resp.json()
        except:
            log_error(f"Upstream returned non-JSON response (Status: {resp.status_code})", url, resp.text)
            return jsonify({'error': f'Upstream error: expected JSON object but got non-JSON (Status: {resp.status_code})'}), 502
            
        if not isinstance(data, dict):
            log_error(f"Upstream returned unexpected type {type(data)}", url, str(data))
            return jsonify({'error': f'Upstream error: expected JSON object but got {type(data)}'}), 502
            
        if not data.get('success'):
            log_error(f"Search failed upstream: {data.get('message', 'No details')}", url, str(data))
            return jsonify({'error': 'Search failed upstream', 'details': data.get('message', 'No details')}), 502
        
        if search_type == 'all':
            # Global search returns a mixed object { data: { songs: {}, artists: {}, ... } }
            raw_data = data.get('data', {})
            if not isinstance(raw_data, dict):
                log_error(f"Expected dict for raw_data, got {type(raw_data)}")
                raw_data = {}

            def get_safe_results(key):
                val = raw_data.get(key, {})
                if isinstance(val, list): return val
                if isinstance(val, dict):
                    return val.get('results') or val.get('data') or []
                return []

            results = {
                'songs': [_normalize_song(s, preferred_quality) for s in get_safe_results('songs') if isinstance(s, dict)],
                'artists': [_normalize_artist(a) for a in get_safe_results('artists') if isinstance(a, dict)],
                'albums': [_normalize_album(al) for al in get_safe_results('albums') if isinstance(al, dict)],
                'playlists': [_normalize_playlist(p) for p in get_safe_results('playlists') if isinstance(p, dict)]
            }
            return jsonify({
                'success': True,
                'results': results,
                'type': 'all'
            })

        raw_data_obj = data.get('data', {})
        if not isinstance(raw_data_obj, dict):
            raw_results = []
        else:
            raw_results = raw_data_obj.get('results') or raw_data_obj.get('data') or []
            
        if not isinstance(raw_results, list):
            raw_results = []
        
        results = []
        for item in raw_results:
            if not isinstance(item, dict): continue
            if search_type == 'song':
                results.append(_normalize_song(item, preferred_quality))
            elif search_type == 'artist':
                results.append(_normalize_artist(item))
            elif search_type == 'album':
                results.append(_normalize_album(item))
            elif search_type == 'playlist':
                results.append(_normalize_playlist(item))
        
        return jsonify({
            'success': True,
            'total': raw_data_obj.get('total', 0) if isinstance(raw_data_obj, dict) else 0,
            'results': results,
            'type': search_type
        })
        
    except requests.exceptions.ConnectionError:
        return jsonify({'error': 'JioSaavn microservice is not responding'}), 503
    except Exception as e:
        log_error(str(e))
        return jsonify({'error': f'Search proxy error: {str(e)}'}), 500

def _get_high_res_image(image_data):
    """
    Safely extracts and forces a high-resolution (500x500) image URL from JioSaavn responses.
    """
    if not image_data: return ''
    
    best_url = ''
    if isinstance(image_data, str):
        best_url = image_data
    elif isinstance(image_data, list) and len(image_data) > 0:
        for img in image_data:
            if isinstance(img, dict) and img.get('quality') == '500x500':
                best_url = img.get('url', '')
                break
        if not best_url and isinstance(image_data[-1], dict):
            best_url = image_data[-1].get('url', '')
            
    if best_url:
        # Force 500x500 resolution via JioSaavn CDN naming convention (1000x1000 causes 404s on older tracks/playlists)
        return best_url.replace('150x150', '500x500').replace('50x50', '500x500').replace('1000x1000', '500x500')
    return ''

def _normalize_song(song, preferred_quality='high'):
    if not isinstance(song, dict):
        return {}
        
    # Quality weight map for selection
    quality_map = {
        '320kbps': 4,
        '160kbps': 3,
        '96kbps': 2,
        '48kbps': 1,
        '12kbps': 0
    }
    
    # Preferred target weights
    target_weights = {
        'extreme': 4,
        'high': 4,
        'medium': 3,
        'low': 2,
        'auto': 4
    }
    
    target_weight = target_weights.get(preferred_quality, 4)
    
    download_urls = song.get('downloadUrl', [])
    if not isinstance(download_urls, list): download_urls = []
    
    audio_url = ''
    best_match = None
    closest_weight_diff = 99
    
    # Select audio URL based on preference
    for dl in download_urls:
        if not isinstance(dl, dict): continue
        q_label = dl.get('quality', '')
        q_weight = quality_map.get(q_label, -1)
        if q_weight == -1: continue
        
        diff = abs(target_weight - q_weight)
        if diff < closest_weight_diff:
            closest_weight_diff = diff
            best_match = dl.get('url', '')
        # Prefer higher if weights are equally close
        elif diff == closest_weight_diff:
            if q_weight > quality_map.get(song.get('quality', ''), -1):
                best_match = dl.get('url', '')

    final_audio_url = best_match or (download_urls[-1].get('url', '') if download_urls and isinstance(download_urls[-1], dict) else '')

    audio_url = final_audio_url
    if not audio_url:
        from flask import current_app
        try: current_app.logger.warning(f"Normalization lenient: Missing audio_url for saavn_id={song.get('id', '')}. Lazy-import handles this.")
        except: pass
    
    # Get 500x500 cover image
    cover_url = _get_high_res_image(song.get('image')) or 'https://ui-avatars.com/api/?name=Music&background=1c1c1c&color=fff&size=500'
    
    # Title: search-all uses 'title', individual uses 'name'
    title = song.get('name') or song.get('title') or 'Unknown Title'
    
    # Album: search-all uses string 'album', individual uses dict 'album'
    album_data = song.get('album', {})
    if isinstance(album_data, dict):
        album_name = album_data.get('name') or album_data.get('title', 'Unknown Album')
    else:
        album_name = str(album_data)
        
    # Build individual artist list
    artists_info = song.get('artists', {})
    primary_artists = []
    if isinstance(artists_info, dict):
        primary_artists = artists_info.get('primary', [])
    
    artists_list = []
    if isinstance(primary_artists, list):
        for a in primary_artists:
            if not isinstance(a, dict): continue
            a_imgs = a.get('image')
            a_image = _get_high_res_image(a_imgs)
            artists_list.append({
                'name': html.unescape(a.get('name') or a.get('title') or ''),
                'image': a_image
            })
    
    # Fallback for display artist if artists_list is empty (common in search-all)
    display_artist = song.get('primaryArtists') or song.get('singers')
    if not display_artist and artists_list:
        display_artist = ', '.join([a['name'] for a in artists_list[:2]])
    if not display_artist:
        display_artist = 'Unknown Artist'
        
    primary_image = artists_list[0]['image'] if artists_list else ''
    
    return {
        'saavn_id': song.get('id', ''),
        'title': html.unescape(str(title)),
        'artist_name': html.unescape(str(display_artist)),
        'artists': artists_list,
        'artist_image': primary_image,
        'album_name': html.unescape(str(album_name)),
        'duration': song.get('duration', 0),
        'cover_image_url': cover_url,
        'audio_url': audio_url,
        'language': song.get('language', ''),
        'saavn_play_count': song.get('playCount', 0),
        'play_count': song.get('playCount', 0),
        'year': song.get('year', ''),
        'release_date': song.get('releaseDate', ''),
        'label': html.unescape(str(song.get('label', ''))),
        'explicit_content': song.get('explicitContent', False),
        'has_lyrics': song.get('hasLyrics', False),
        'lyrics_id': song.get('lyricsId', ''),
        'type': 'song',
        'source': 'jiosaavn'
    }

def _normalize_artist(artist):
    if not isinstance(artist, dict): return {}
    
    cover_url = _get_high_res_image(artist.get('image'))
    name = artist.get('name') or artist.get('title') or 'Unknown Artist'
    
    return {
        'id': artist.get('id', ''),
        'name': html.unescape(str(name)),
        'image': cover_url,
        'role': artist.get('role', ''),
        'is_verified': artist.get('isVerified', False),
        'type': 'artist',
        'source': 'jiosaavn'
    }

def _normalize_album(album):
    if not isinstance(album, dict): return {}
    
    cover_url = _get_high_res_image(album.get('image'))
    name = album.get('name') or album.get('title') or 'Unknown Album'
    artist_name = album.get('artist') or 'Unknown Artist'
    if isinstance(artist_name, dict): artist_name = artist_name.get('name', 'Unknown Artist')
            
    return {
        'id': album.get('id', ''),
        'name': html.unescape(str(name)),
        'artist_name': html.unescape(str(artist_name)),
        'cover_image_url': cover_url,
        'year': album.get('year', ''),
        'language': album.get('language', ''),
        'type': 'album',
        'source': 'jiosaavn'
    }

def _normalize_playlist(playlist):
    if not isinstance(playlist, dict): return {}
    
    cover_url = _get_high_res_image(playlist.get('image'))
    name = playlist.get('name') or playlist.get('title') or 'Unknown Playlist'
            
    return {
        'id': playlist.get('id', ''),
        'name': html.unescape(str(name)),
        'song_count': playlist.get('songCount', 0),
        'cover_image_url': cover_url,
        'language': playlist.get('language', ''),
        'type': 'playlist',
        'source': 'jiosaavn'
    }


@jiosaavn_bp.route('/import', methods=['POST'])
def import_song():
    """
    The Lazy-Save Engine.
    Takes a simplified JioSaavn song object from the frontend,
    resolves/creates the artist in our DB, inserts the song,
    and returns the local song_id.
    """
    data = request.get_json()
    if not data:
        return jsonify({'error': 'JSON body required'}), 400
    
    saavn_id = data.get('saavn_id', '')
    title = data.get('title', 'Unknown Title')[:200]
    artists_list = data.get('artists', [])  # list of {name, image}
    artist_name = data.get('artist_name', 'Unknown Artist')  # fallback display name
    artist_image = data.get('artist_image', '')
    album_name = data.get('album_name', '')[:150]
    duration = data.get('duration', 0)
    cover_image_url = data.get('cover_image_url', '')
    audio_url = data.get('audio_url', '')
    language = data.get('language', '')[:100]
    year = data.get('year', '')
    
    if not audio_url and saavn_id:
        log_error(f"Importing song {saavn_id} without audio_url. Attempting backfill...")
        # Fetch full details if metadata is incomplete (e.g. from 'All' tab)
        try:
            detail_resp = requests.get(f"{SAAVN_API_BASE}/songs/{saavn_id}", timeout=60)
            try:
                detail_data = detail_resp.json()
            except:
                log_error(f"Non-JSON response for song backfill ({saavn_id})", f"{SAAVN_API_BASE}/songs/{saavn_id}", detail_resp.text)
                detail_data = {}

            if detail_data.get('success') and detail_data.get('data') and len(detail_data['data']) > 0:
                full_song = detail_data['data'][0]
                user_id = data.get('user_id') or request.args.get('user_id')
                norm = _normalize_song(full_song, get_preferred_quality(user_id))
                audio_url = norm.get('audio_url')
                duration = norm.get('duration', duration)
                cover_image_url = norm.get('cover_image_url', cover_image_url)
                artists_list = norm.get('artists', artists_list)
                artist_name = norm.get('artist_name', artist_name)
                title = norm.get('title', title)
                log_error(f"Backfill successful for {saavn_id}. Resolved audio_url: {audio_url}")
            else:
                log_error(f"Backfill failed for {saavn_id}: success={detail_data.get('success')}", f"{SAAVN_API_BASE}/songs/{saavn_id}", str(detail_data))
        except Exception as e:
            log_error(f"Failed to fetch song details for import-backfill ({saavn_id}): {str(e)}", f"{SAAVN_API_BASE}/songs/{saavn_id}")

    if not audio_url:
        return jsonify({
            'error': 'audio_url is missing and could not be resolved from saavn_id',
            'saavn_id': saavn_id,
            'details': 'Simplified search results from "All" tab require a backfill which failed.'
        }), 400
    
    try:
        # Check if we already imported this song by its unique JioSaavn ID
        existing = fetch_one(
            "SELECT song_id, title, audio_url, cover_image_url, duration, artist_id, genre, language FROM songs WHERE saavn_id = %s LIMIT 1",
            (saavn_id,)
        )
        if existing:
            # Self-healing: Update DB if the CDN audio_url or cover_image_url rotated
            if existing['audio_url'] != audio_url:
                execute_query(
                    "UPDATE songs SET audio_url = %s, cover_image_url = %s WHERE song_id = %s", 
                    (audio_url, cover_image_url, existing['song_id'])
                )
                existing['audio_url'] = audio_url
                existing['cover_image_url'] = cover_image_url
                
            # Already imported, return existing song_id with full data
            artist_prof = fetch_one(
                "SELECT ap.artist_id, u.username, u.avatar_url FROM artist_profiles ap JOIN users u ON ap.user_id = u.user_id WHERE ap.artist_id = %s",
                (existing['artist_id'],)
            )
            return jsonify({
                'success': True,
                'song': {
                    'song_id': existing['song_id'],
                    'title': existing['title'],
                    'audio_url': existing['audio_url'],
                    'cover_image_url': existing['cover_image_url'],
                    'duration': existing['duration'],
                    'genre': existing['genre'],
                    'language': existing['language'],
                    'artist_id': existing['artist_id'], 
                    'artists': fetch_all("SELECT ap.artist_id as id, u.username as name FROM song_artists sa JOIN artist_profiles ap ON sa.artist_id = ap.artist_id JOIN users u ON ap.user_id = u.user_id WHERE sa.song_id = %s", (existing['song_id'],)),
                    'artist_name': artist_prof['username'] if artist_prof else artist_name,
                    'artist_image': artist_prof['avatar_url'] if artist_prof else '',
                    'already_imported': True
                }
            })
        
        # Step 1: Resolve or create artists (split multi-artist into separate accounts)
        artist_ids = []
        if artists_list and len(artists_list) > 0:
            # Create each artist separately
            for i, a in enumerate(artists_list):
                a_name = a.get('name', '').strip()[:50]
                a_image = a.get('image', '')
                if not a_name:
                    continue
                aid = _resolve_or_create_artist(a_name, a_image)
                artist_ids.append(aid)
        else:
            # Fallback: split the comma-separated display name
            names = [n.strip() for n in artist_name.split(',') if n.strip()]
            for name in names:
                aid = _resolve_or_create_artist(name[:50], artist_image)
                artist_ids.append(aid)
        
        if not artist_ids:
            artist_ids = [_resolve_or_create_artist('Unknown Artist', '')]
            
        artist_id = artist_ids[0]  # Primary artist for 'songs' table reference
        
        # Step 1b: Try to fetch real musical genre from iTunes API
        real_genre = None
        try:
            import urllib.parse
            query_str = urllib.parse.quote(f"{title} {artist_name}")
            itunes_resp = requests.get(f"https://itunes.apple.com/search?term={query_str}&entity=song&limit=1", timeout=10)
            itunes_data = itunes_resp.json()
            if itunes_data.get('resultCount', 0) > 0:
                found_genre = itunes_data['results'][0].get('primaryGenreName')
                banned_genres = {'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Punjabi', 'Malayalam', 'Kannada', 'Marathi', 'Gujarati', 'Bhojpuri', 'Odia', 'Assamese', 'Urdu'}
                if found_genre and found_genre not in banned_genres:
                    real_genre = found_genre
                elif found_genre:
                    real_genre = 'Regional Pop'
        except Exception as e:
            log_error(f"Failed to fetch genre from iTunes for {title}: {str(e)}")
            
        # Step 2: Insert the song into our local DB
        lang_val = language.capitalize() if language else 'Unknown'
        
        song_id = execute_query(
            """INSERT INTO songs (saavn_id, artist_id, title, audio_url, cover_image_url, duration, genre, language, play_count, uploaded_by)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 0, NULL)""",
            (saavn_id, artist_id, title, audio_url, cover_image_url, duration, real_genre, lang_val)
        )

        # Step 3: Populate the song_artists junction table
        for idx, aid in enumerate(artist_ids):
            is_primary = 1 if idx == 0 else 0
            execute_query(
                "INSERT IGNORE INTO song_artists (song_id, artist_id, is_primary) VALUES (%s, %s, %s)",
                (song_id, aid, is_primary)
            )
        
        return jsonify({
            'success': True,
            'song': {
                'song_id': song_id,
                'title': title,
                'audio_url': audio_url,
                'cover_image_url': cover_image_url,
                'duration': duration,
                'artist_id': artist_id,
                'artists': fetch_all("SELECT ap.artist_id as id, u.username as name FROM song_artists sa JOIN artist_profiles ap ON sa.artist_id = ap.artist_id JOIN users u ON ap.user_id = u.user_id WHERE sa.song_id = %s", (song_id,)),
                'artist_name': artist_name,
                'artist_image': artist_image,
                'already_imported': False
            }
        })
        
    except Exception as e:
        log_error(f"Import failed: {str(e)}")
        return jsonify({'error': f'Import failed: {str(e)}'}), 500


@jiosaavn_bp.route('/artist/<artist_id>', methods=['GET'])
def get_artist_detail(artist_id):
    """Fetch full artist profile from JioSaavn API: bio, image, songs, albums."""
    try:
        user_id = request.args.get('user_id')
        pq = get_preferred_quality(user_id)
        resp = requests.get(
            f"{SAAVN_API_BASE}/artists/{artist_id}",
            params={'songCount': 20, 'albumCount': 10, 'sortBy': 'popularity'},
            timeout=60
        )
        try:
            data = resp.json()
        except:
            log_error(f"Non-JSON response for artist {artist_id}", f"{SAAVN_API_BASE}/artists/{artist_id}", resp.text)
            return jsonify({'error': 'Upstream error: expected JSON object but got non-JSON'}), 502

        if not data.get('success'):
            log_error(f"Artist {artist_id} not found upstream", f"{SAAVN_API_BASE}/artists/{artist_id}", str(data))
            return jsonify({'error': 'Artist not found upstream'}), 404

        raw = data.get('data', {})
        if not isinstance(raw, dict):
            return jsonify({'error': 'Unexpected response format'}), 502

        # Artist images
        images = raw.get('image', [])
        artist_image = ''
        if isinstance(images, list):
            for img in images:
                if isinstance(img, dict) and img.get('quality') == '500x500':
                    artist_image = img.get('url', '')
                    break
            if not artist_image and images:
                artist_image = images[-1].get('url', '') if isinstance(images[-1], dict) else ''

        # Normalize top songs
        top_songs_raw = raw.get('topSongs', [])
        if not isinstance(top_songs_raw, list):
            top_songs_raw = []
        top_songs = [_normalize_song(s, pq) for s in top_songs_raw if isinstance(s, dict)]

        # Normalize top albums
        top_albums_raw = raw.get('topAlbums', [])
        if not isinstance(top_albums_raw, list):
            top_albums_raw = []
        top_albums = [_normalize_album(a) for a in top_albums_raw if isinstance(a, dict)]

        name = raw.get('name') or raw.get('title') or 'Unknown Artist'

        return jsonify({
            'success': True,
            'artist': {
                'id': artist_id,
                'name': html.unescape(str(name)),
                'image': artist_image,
                'bio': html.unescape(str(raw.get('bio', '') or '')),
                'fan_count': raw.get('fanCount', 0),
                'is_verified': raw.get('isVerified', False),
                'dominant_type': raw.get('dominantType', ''),
                'top_songs': top_songs,
                'top_albums': top_albums,
                'source': 'jiosaavn'
            }
        })
    except requests.exceptions.ConnectionError:
        return jsonify({'error': 'JioSaavn microservice is not running'}), 503
    except Exception as e:
        log_error(f"Artist detail error: {str(e)}")
        return jsonify({'error': f'Artist detail error: {str(e)}'}), 500


@jiosaavn_bp.route('/album/<album_id>', methods=['GET'])
def get_album_detail(album_id):
    """Fetch album details with all songs from JioSaavn API."""
    try:
        resp = requests.get(
            f"{SAAVN_API_BASE}/albums",
            params={'id': album_id},
            timeout=60
        )
        try:
            data = resp.json()
        except:
            log_error(f"Non-JSON response for album {album_id}", f"{SAAVN_API_BASE}/albums", resp.text)
            return jsonify({'error': 'Upstream error: expected JSON object but got non-JSON'}), 502

        if not data.get('success'):
            log_error(f"Album {album_id} not found upstream", f"{SAAVN_API_BASE}/albums", str(data))
            return jsonify({'error': 'Album not found upstream'}), 404

        raw = data.get('data', {})
        if not isinstance(raw, dict):
            return jsonify({'error': 'Unexpected response format'}), 502

        images = raw.get('image', [])
        cover_url = ''
        if isinstance(images, list):
            for img in images:
                if isinstance(img, dict) and img.get('quality') == '500x500':
                    cover_url = img.get('url', '')
                    break
            if not cover_url and images:
                cover_url = images[-1].get('url', '') if isinstance(images[-1], dict) else ''

        songs_raw = raw.get('songs', [])
        if not isinstance(songs_raw, list):
            songs_raw = []
        songs = [_normalize_song(s) for s in songs_raw if isinstance(s, dict)]

        name = raw.get('name') or raw.get('title') or 'Unknown Album'
        artist_info = raw.get('artists', {})
        artist_name = 'Unknown Artist'
        if isinstance(artist_info, dict):
            primary = artist_info.get('primary', [])
            if isinstance(primary, list) and primary:
                artist_name = ', '.join([html.unescape(a.get('name', '')) for a in primary if isinstance(a, dict)])
        elif isinstance(artist_info, str):
            artist_name = artist_info

        return jsonify({
            'success': True,
            'album': {
                'id': album_id,
                'name': html.unescape(str(name)),
                'artist_name': artist_name,
                'cover_image_url': cover_url,
                'year': raw.get('year', ''),
                'language': raw.get('language', ''),
                'song_count': raw.get('songCount', len(songs)),
                'songs': songs,
                'source': 'jiosaavn'
            }
        })
    except requests.exceptions.ConnectionError:
        return jsonify({'error': 'JioSaavn microservice is not running'}), 503
    except Exception as e:
        log_error(f"Album detail error: {str(e)}")
        return jsonify({'error': f'Album detail error: {str(e)}'}), 500


@jiosaavn_bp.route('/playlist/<playlist_id>', methods=['GET'])
def get_playlist_detail(playlist_id):
    """Fetch playlist details with songs from JioSaavn API."""
    try:
        resp = requests.get(
            f"{SAAVN_API_BASE}/playlists",
            params={'id': playlist_id, 'limit': 50},
            timeout=60
        )
        try:
            data = resp.json()
        except:
            log_error(f"Non-JSON response for playlist {playlist_id}", f"{SAAVN_API_BASE}/playlists", resp.text)
            return jsonify({'error': 'Upstream error: expected JSON object but got non-JSON'}), 502

        if not data.get('success'):
            log_error(f"Playlist {playlist_id} not found upstream", f"{SAAVN_API_BASE}/playlists", str(data))
            return jsonify({'error': 'Playlist not found upstream'}), 404

        raw = data.get('data', {})
        if not isinstance(raw, dict):
            return jsonify({'error': 'Unexpected response format'}), 502

        images = raw.get('image', [])
        cover_url = ''
        if isinstance(images, list):
            for img in images:
                if isinstance(img, dict) and img.get('quality') == '500x500':
                    cover_url = img.get('url', '')
                    break
            if not cover_url and images:
                cover_url = images[-1].get('url', '') if isinstance(images[-1], dict) else ''

        songs_raw = raw.get('songs', [])
        if not isinstance(songs_raw, list):
            songs_raw = []
        songs = [_normalize_song(s) for s in songs_raw if isinstance(s, dict)]

        name = raw.get('name') or raw.get('title') or 'Unknown Playlist'
        description = raw.get('description') or raw.get('subtitle') or ''

        return jsonify({
            'success': True,
            'playlist': {
                'id': playlist_id,
                'name': html.unescape(str(name)),
                'description': html.unescape(str(description)),
                'cover_image_url': cover_url,
                'song_count': raw.get('songCount', len(songs)),
                'fan_count': raw.get('fanCount', 0),
                'songs': songs,
                'source': 'jiosaavn'
            }
        })
    except requests.exceptions.ConnectionError:
        return jsonify({'error': 'JioSaavn microservice is not running'}), 503
    except Exception as e:
        log_error(f"Playlist detail error: {str(e)}")
        return jsonify({'error': f'Playlist detail error: {str(e)}'}), 500


import time

# Memory cache to fix extreme latency on Home scraping
_home_cache = {}

import re

def _dedup_songs(songs):
    seen = set()
    unique_songs = []
    
    for s in songs:
        if not isinstance(s, dict): continue
        
        # Strip out anything inside parentheses/brackets: e.g. "Chaleya (From "Jawan")" -> "Chaleya"
        raw_title = str(s.get('title', ''))
        clean_title = re.sub(r'\(.*?\)|\[.*?\]', '', raw_title)
        
        # Flatten string: remove non-alphanumeric and spaces
        clean_title = re.sub(r'[^a-zA-Z0-9]', '', clean_title).lower()
        
        # Get just the single primary artist to avoid "Arijit Singh, Shilpa Rao" vs "Arijit Singh" mismatches
        artists = s.get('artists', [])
        primary_artist = ''
        if artists and isinstance(artists, list) and len(artists) > 0 and isinstance(artists[0], dict):
            primary_artist = str(artists[0].get('name', ''))
        else:
            primary_artist = str(s.get('artist_name', ''))
            
        clean_artist = re.sub(r'[^a-zA-Z0-9]', '', primary_artist.split(',')[0]).lower()
        
        key = f"{clean_title}||{clean_artist}"
        if key not in seen:
            seen.add(key)
            unique_songs.append(s)
            
    return unique_songs

@jiosaavn_bp.route('/home', methods=['GET'])
def get_home_content():
    """
    Personalized home page content — v2 (Smart Engine).
    
    Fixes over v1:
    - Empty playlists filtered out (song_count > 0)
    - Global dedup: no song/playlist appears in multiple sections
    - Language-aware queries (K-Pop -> Korean, not keyword noise)
    - Trending comes from JioSaavn, not sparse local DB
    - New Releases filtered by actual year
    - Genre mixes validate language to prevent cross-contamination
    """
    user_id = request.args.get('user_id', type=int)

    content = {
        'featured_playlists': [],
        'trending_songs': [],
        'new_releases': [],
        'personalized_mixes': [],
    }

    import time
    start_time = time.time()
    from flask import current_app
    
    # ── Global dedup trackers ──
    _seen_playlist_ids = set()

    def _add_playlist_if_new(raw_pl, target_list):
        norm = _normalize_playlist(raw_pl)
        pid = norm.get('id', '')
        if not pid or pid in _seen_playlist_ids:
            return False
        _seen_playlist_ids.add(pid)
        target_list.append(norm)
        return True
        
    def process_section(raw_songs, section_name, target_count, max_artists=3, target_lang=None):
        try: current_app.logger.info(f"{section_name}: API returned {len(raw_songs)} songs")
        except: pass
        
        normalized = []
        dropped_null_id = 0
        dropped_null_url = 0
        
        # Normalization
        for rs in raw_songs:
            norm = _normalize_song(rs, pq)
            sid = norm.get('saavn_id')
            if not sid:
                dropped_null_id += 1
                continue
                
            if target_lang and norm.get('language'):
                 song_lang = norm['language'].lower().strip()
                 if target_lang.lower() not in song_lang and song_lang not in target_lang.lower():
                     continue
                     
            if not norm.get('audio_url'):
                dropped_null_url += 1
            normalized.append(norm)
            
        try: current_app.logger.info(f"{section_name}: {len(normalized)} songs after normalization ({dropped_null_id} dropped_null_id, {dropped_null_url} lacking audio_url but kept)")
        except: pass
        
        # Intra-Section Deduplication
        deduped = []
        seen_sids = set()
        for s in normalized:
            sid = s['saavn_id']
            if sid not in seen_sids:
                seen_sids.add(sid)
                deduped.append(s)
                
        dropped_dedup = len(normalized) - len(deduped)
        try: current_app.logger.info(f"{section_name}: {len(deduped)} songs after dedup ({dropped_dedup} removed as duplicates)")
        except: pass
        
        # Artist Cap
        capped = []
        artist_counts = {}
        for s in deduped:
            primary_artist = ''
            if s.get('artists') and len(s['artists']) > 0:
                primary_artist = s['artists'][0].get('name', '')
            else:
                primary_artist = s.get('artist_name', '')
                
            clean_artist = primary_artist.lower().strip()
            
            if artist_counts.get(clean_artist, 0) < max_artists:
                capped.append(s)
                artist_counts[clean_artist] = artist_counts.get(clean_artist, 0) + 1
                
        try: current_app.logger.info(f"{section_name}: {len(capped)} songs after artist cap")
        except: pass
        
        sliced = capped[:target_count]
        try: current_app.logger.info(f"{section_name}: returning {len(sliced)} songs to frontend")
        except: pass
        
        if len(sliced) < 5:
            try: current_app.logger.warning(f"THRESHOLD WARN: {section_name} only produced {len(sliced)} valid songs!")
            except: pass
            
        return sliced

    # ── Genre-to-language mapping ──
    GENRE_LANGUAGE_MAP = {
        'k-pop': 'korean', 'kpop': 'korean',
        'j-pop': 'japanese', 'jpop': 'japanese',
        'bollywood': 'hindi', 'tollywood': 'telugu', 'kollywood': 'tamil',
        'punjabi': 'punjabi', 'bhojpuri': 'bhojpuri',
        'latin': 'spanish', 'reggaeton': 'spanish',
        'pop': 'english', 'rock': 'english', 'hip-hop': 'english',
        'hip hop': 'english', 'r&b': 'english', 'edm': 'english',
        'indie': 'english', 'lo-fi': 'english', 'lofi': 'english',
        'classical': 'hindi',
    }

    # ── Smart artist queries per genre (produces relevant results) ──
    GENRE_QUERIES = {
        'k-pop': ['BTS', 'BLACKPINK', 'Stray Kids', 'NewJeans', 'aespa', 'TWICE'],
        'kpop': ['BTS', 'BLACKPINK', 'Stray Kids', 'NewJeans', 'aespa', 'TWICE'],
        'j-pop': ['YOASOBI', 'Official HIGE DANdism', 'Ado', 'LiSA'],
        'jpop': ['YOASOBI', 'Official HIGE DANdism', 'Ado', 'LiSA'],
        'bollywood': ['Arijit Singh', 'Shreya Ghoshal', 'Pritam latest'],
        'hip-hop': ['Drake', 'Kendrick Lamar', 'Travis Scott'],
        'hip hop': ['Drake', 'Kendrick Lamar', 'Travis Scott'],
        'edm': ['Martin Garrix', 'Marshmello', 'Alan Walker'],
        'lo-fi': ['lofi beats', 'chill lofi', 'lofi study'],
        'lofi': ['lofi beats', 'chill lofi', 'lofi study'],
        'pop': ['Taylor Swift', 'The Weeknd', 'Dua Lipa', 'Bruno Mars'],
        'rock': ['Imagine Dragons', 'Coldplay', 'Linkin Park'],
        'r&b': ['SZA', 'Daniel Caesar', 'The Weeknd R&B'],
        'indie': ['Arctic Monkeys', 'Tame Impala', 'Hozier'],
        'classical': ['classical instrumental', 'Indian classical raag'],
        'punjabi': ['AP Dhillon', 'Diljit Dosanjh', 'Sidhu Moose Wala'],
    }

    # ── Fetch user taste profile (DYNAMIC ML BRIDGE) ──
    user_genres = []
    user_languages = []
    user_artists = []
    
    if user_id:
        try:
            profile = get_dynamic_taste_profile(user_id)
            user_genres = profile.get('genres', [])
            user_artists = profile.get('artists', [])
            user_languages = profile.get('languages', [])
        except Exception as e:
            log_error(f"Error fetching dynamic ML user taste: {str(e)}")

    # Derive expected languages from genres natively mapped
    for g in user_genres:
        lang = GENRE_LANGUAGE_MAP.get(g.lower())
        if lang and lang not in user_languages:
            user_languages.append(lang)

    genre_names = [g for g in user_genres if g]
    artist_names = [a for a in user_artists if a and not a.endswith('@wave.local')]

    # ── Build playlist queries ──
    if artist_names:
        playlist_queries = []
        for a in artist_names[:3]:
            playlist_queries.append(f"{a} mix")
            playlist_queries.append(f"best of {a}")
        for g in genre_names[:2]:
            playlist_queries.append(f"{g} hits playlist")
        playlist_queries.extend(['Top Hits 2026', 'Chill Vibes'])
    else:
        playlist_queries = [
            'Top Hits 2026', 'Trending Now', 'Chill Vibes', 'Workout Beats',
            'Romantic Hits', 'Party Anthems', 'Mood Booster', 'Lofi'
        ]

    import datetime
    current_year = datetime.datetime.now().year
    pq = get_preferred_quality(user_id)

    # ── Parallel Task Execution Engine ──
    def _resolve_artist_id(artist_name):
        """Quickly resolve a name like 'Bad Bunny' to a JioSaavn ID."""
        try:
            resp = requests.get(f"{SAAVN_API_BASE}/search/artists", params={'query': artist_name, 'limit': 1}, timeout=5)
            data = resp.json()
            if data.get('success'):
                results = data.get('data', {}).get('results', [])
                if results: return results[0].get('id')
        except: pass
        return None

    def fetch_api_task(category, type, query, limit=10):
        # Segmented TTLs (in seconds)
        ttl = 14400 # 4 hrs for charts/mixes
        if 'trending' in category: ttl = 1800 # 30 mins
        elif 'releases' in category or 'albums' in type: ttl = 3600 # 1 hour
        
        cache_key = f"saavn_task_{category}_{type}_{query}_{limit}"
        
        from app import cache
        cached_payload = cache.get(cache_key)
        
        # SWR Helper
        def bg_revalidate():
            try:
                if type == 'artists_top':
                    url = f"{SAAVN_API_BASE}/artists/{query}/songs"
                    params = {'limit': limit, 'page': 1, 'sortBy': 'popularity'}
                elif type == 'artists_albums':
                    url = f"{SAAVN_API_BASE}/artists/{query}/albums"
                    params = {'limit': limit, 'page': 1, 'sortBy': 'latest'}
                else:
                    url = f"{SAAVN_API_BASE}/search/{type}"
                    params = {'query': query, 'limit': limit}
                    
                resp = requests.get(url, params=params, timeout=15)
                if resp.status_code == 200:
                    data = resp.json()
                    if data.get('success'):
                        raw_res = data.get('data', [])
                        if isinstance(raw_res, dict): results = raw_res.get('results') or raw_res.get('data') or []
                        else: results = raw_res
                        
                        payload = {'data': results, 'timestamp': time.time()}
                        cache.set(cache_key, payload, timeout=ttl * 10) # hard expire much later to allow SWR grace period
                        return results
            except Exception as e:
                print(f"[SWR bg_fetch] failed for {category}: {e}")
            return None

        # SWR Check
        if cached_payload and isinstance(cached_payload, dict):
            age = time.time() - cached_payload.get('timestamp', 0)
            if age < ttl:
                # Fresh hit
                return {'category': category, 'results': cached_payload['data'], 'query': query}
            else:
                # Stale hit (SWR) - return immediately, spawn rebuild in unbound thread
                import threading
                threading.Thread(target=bg_revalidate).start()
                return {'category': category, 'results': cached_payload['data'], 'query': query}
                
        # Cold start (Blocks, full cost paid ONCE per cache key, not per user dashboard load)
        fresh_results = bg_revalidate()
        return {'category': category, 'results': fresh_results or [], 'query': query}
        return {'category': category, 'results': [], 'query': query}

    tasks = []
    
    # Task 1: Featured Playlists
    for query in playlist_queries[:6]:
        tasks.append(('featured_playlists', 'playlists', query, 3))

    # Task 2: Trending Songs
    trending_queries = []
    if genre_names:
        for g in genre_names[:2]:
            smart = GENRE_QUERIES.get(g.lower(), [])
            trending_queries.append(smart[0] if smart else f"{g} trending {current_year}")
    if artist_names:
        trending_queries.append(f"{artist_names[0]} hits")
    if not trending_queries:
        trending_queries = [f'trending songs {current_year}', 'viral hits']
    
    for tq in trending_queries[:3]:
        tasks.append(('trending_songs', 'songs', tq, 50))

    # Task 3: New Releases
    nr_queries = []
    if artist_names:
        nr_queries.append(f"{artist_names[0]} new album")
    for g in genre_names[:2]:
        nr_queries.append(f"{g} new album {current_year}")
    if not nr_queries:
        nr_queries = [f'new releases {current_year}', f'latest albums {current_year}']

    for nrq in nr_queries[:3]:
        tasks.append(('new_releases', 'albums', nrq, 8))

    # Task 4: Mixed Genre/Artist specific tasks
    mix_configs = []
    if genre_names or artist_names:
        # ── PRIORITY A: Artist Mixes (Highly specific) ──
        # Resolve Artists in parallel (increase to 5 to respect user preferences)
        resolved_artists = []
        with ThreadPoolExecutor(max_workers=5) as resolver_exec:
            artist_futures = {resolver_exec.submit(_resolve_artist_id, name): name for name in artist_names[:5]}
            for fut in as_completed(artist_futures):
                aid = fut.result()
                if aid: resolved_artists.append((artist_futures[fut], aid))

        for name, aid in resolved_artists:
            # Task A: Official Top Hits (Fetch more for better dedup quality)
            tasks.append((f'mix_artist_{name}', 'artists_top', aid, 50))
            # Task B: Recent Albums
            tasks.append(('new_releases', 'artists_albums', aid, 15))
            
            mix_configs.append({'id': f'mix_artist_{name}', 'title': f"Best of {name}", 'type': 'artist'})

        # Fallback for unresolved artists — use smart keyword hits
        found_names = {ra[0] for ra in resolved_artists}
        for artist in artist_names[:5]:
            if artist not in found_names and not artist.endswith('.local'):
                tasks.append((f'mix_artist_{artist}', 'songs', f"{artist} best hits", 30))
                mix_configs.append({'id': f'mix_artist_{artist}', 'title': f"More of {artist}", 'type': 'artist'})

        # ── PRIORITY B: Genre Mixes ──
        for genre in genre_names[:3]:
            genre_lower = genre.lower()
            expected_lang = GENRE_LANGUAGE_MAP.get(genre_lower)
            smart_queries = GENRE_QUERIES.get(genre_lower, [f"{genre} popular"])
            for sq in smart_queries[:2]:
                tasks.append((f'mix_genre_{genre}', 'songs', sq, 50))
            mix_configs.append({'id': f'mix_genre_{genre}', 'title': f"Because you like {genre}", 'lang': expected_lang, 'type': 'genre'})

    # Execute all tasks in parallel (max 15 workers to stay safe on free tier clusters)
    results_map = {}
    with ThreadPoolExecutor(max_workers=15) as executor:
        future_to_task = {executor.submit(fetch_api_task, *t): t for t in tasks}
        for future in as_completed(future_to_task):
            res = future.result()
            cat = res['category']
            if cat not in results_map:
                results_map[cat] = []
            results_map[cat].extend(res['results'])

    # ── Collate results back into content ──
    for p in results_map.get('featured_playlists', []):
        _add_playlist_if_new(p, content['featured_playlists'])
    content['featured_playlists'] = content['featured_playlists'][:12]

    content['trending_songs'] = process_section(results_map.get('trending_songs', []), 'trending', target_count=20, max_artists=3)

    seen_album_ids = set()
    for a in results_map.get('new_releases', []):
        norm = _normalize_album(a)
        aid = norm.get('id', '')
        if aid in seen_album_ids: continue
        try:
            yr = int(norm.get('year', 0) or 0)
            if yr > 0 and yr < current_year - 3: continue
            album_lang = (norm.get('language') or '').lower().strip()
            if user_languages and album_lang:
                if not any(ul.lower() in album_lang or album_lang in ul.lower() for ul in user_languages):
                    continue
            seen_album_ids.add(aid)
            content['new_releases'].append(norm)
        except Exception: pass
    content['new_releases'] = content['new_releases'][:10]

    for cfg in mix_configs:
        mix_data = results_map.get(cfg['id'], [])
        norm_mix = process_section(mix_data, cfg['id'], target_count=8, max_artists=2, target_lang=cfg.get('lang'))
        
        if norm_mix:
            content['personalized_mixes'].append({
                'title': cfg['title'],
                'type': cfg['type'],
                'key': cfg['id'],
                'songs': norm_mix[:8]
            })

    content['personalized_mixes'] = content['personalized_mixes'][:10]
    
    # ── Final Global Cross-Section Deduplication ──
    global_song_counts = {}
    
    final_trending = []
    for s in content['trending_songs']:
        sid = s['saavn_id']
        global_song_counts[sid] = global_song_counts.get(sid, 0) + 1
        final_trending.append(s)
    content['trending_songs'] = final_trending
    
    for mix in content['personalized_mixes']:
        final_mix = []
        for s in mix['songs']:
            sid = s['saavn_id']
            if global_song_counts.get(sid, 0) < 2:
                final_mix.append(s)
                global_song_counts[sid] = global_song_counts.get(sid, 0) + 1
        mix['songs'] = final_mix
        
    try: current_app.logger.info(f"Home page built in {int((time.time() - start_time)*1000)}ms — sections: trending={len(content['trending_songs'])}, new_releases={len(content['new_releases'])}, mixes={len(content['personalized_mixes'])}")
    except: pass
    
    response_data = {
        'success': True, 
        'content': content,
        'personalized': bool(genre_names or artist_names)
    }
    
    _home_cache[cache_key] = {
        'timestamp': time.time(),
        'data': response_data
    }

    return jsonify(response_data)


def _resolve_or_create_artist(artist_name, artist_image_url=''):
    """
    Find or create an artist user + profile in our local DB.
    Returns the artist_id (from artist_profiles table).
    """
    # Check if artist already exists by username
    existing_user = fetch_one(
        "SELECT user_id, role, avatar_url FROM users WHERE username = %s", 
        (artist_name,)
    )
    
    if existing_user:
        # Update avatar if we have a better one and theirs is empty
        if artist_image_url and not existing_user.get('avatar_url'):
            execute_query(
                "UPDATE users SET avatar_url = %s WHERE user_id = %s",
                (artist_image_url, existing_user['user_id'])
            )
        
        # Ensure they have an artist profile
        artist_prof = fetch_one(
            "SELECT artist_id FROM artist_profiles WHERE user_id = %s",
            (existing_user['user_id'],)
        )
        if artist_prof:
            return artist_prof['artist_id']
        else:
            # Upgrade role if needed
            if existing_user['role'] == 'listener':
                execute_query("UPDATE users SET role = 'artist' WHERE user_id = %s", (existing_user['user_id'],))
            return execute_query(
                "INSERT INTO artist_profiles (user_id, bio, verified) VALUES (%s, %s, %s)",
                (existing_user['user_id'], "Artist", False)
            )
    else:
        # Create a stub user
        fake_email = f"saavn_{uuid.uuid4().hex[:8]}@wave.local"
        dummy_hash = "scrypt:32768:8:1$dummy$notalogin"
        
        new_user_id = execute_query(
            """INSERT INTO users (username, email, hashed_password, role, first_name, last_name, avatar_url) 
               VALUES (%s, %s, %s, 'artist', %s, '', %s)""",
            (artist_name, fake_email, dummy_hash, artist_name, artist_image_url)
        )
        
        artist_id = execute_query(
            "INSERT INTO artist_profiles (user_id, bio, verified) VALUES (%s, %s, %s)",
            (new_user_id, "Artist", False)
        )
        
        return artist_id
