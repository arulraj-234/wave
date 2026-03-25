from flask import Blueprint, request, jsonify
from db import execute_query, fetch_all, fetch_one
import requests
import uuid
import html

from config import Config

jiosaavn_bp = Blueprint('jiosaavn', __name__)

SAAVN_API_BASE = Config.SAAVN_API_URL.rstrip('/') # Handle trailing slashes gracefully
print(f"[JioSaavn Config] Active API Base: {SAAVN_API_BASE}")


def log_error(msg):
    """Simple error logger."""
    print(f"[JioSaavn Route Error] {msg}")


@jiosaavn_bp.route('/search', methods=['GET'])
def search_global():
    """Proxy search to the JioSaavn microservice and return results by type."""
    query = request.args.get('query', '').strip()
    search_type = request.args.get('type', 'song').lower().rstrip('s') # Normalize to singular: song, artist, album, playlist
    limit = request.args.get('limit', '20')
    
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400
    
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
            timeout=10
        )
        data = resp.json()
        
        if not isinstance(data, dict):
            return jsonify({'error': f'Upstream error: expected JSON object but got {type(data)}', 'raw': str(data)[:100]}), 502
            
        if not data.get('success'):
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
                'songs': [_normalize_song(s) for s in get_safe_results('songs') if isinstance(s, dict)],
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
                results.append(_normalize_song(item))
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

def _normalize_song(song):
    if not isinstance(song, dict):
        return {}
        
    # Get the best quality download URL (Priority logic: 320kbps > 160kbps)
    download_urls = song.get('downloadUrl', [])
    if not isinstance(download_urls, list): download_urls = []
    
    audio_url = ''
    for dl in download_urls:
        if isinstance(dl, dict) and dl.get('quality') == '320kbps':
            audio_url = dl.get('url', '')
            break
    if not audio_url:
        for dl in download_urls:
            if isinstance(dl, dict) and dl.get('quality') == '160kbps':
                audio_url = dl.get('url', '')
                break
    if not audio_url and download_urls:
        audio_url = download_urls[-1].get('url', '') if isinstance(download_urls[-1], dict) else ''

    # Force 320kbps high-quality stream to prevent audio stretching/breaking glitches
    if audio_url and '_p.mp4' in audio_url:
        import re
        audio_url = re.sub(r'_\d+_p\.mp4', '_320.mp4', audio_url)
    elif audio_url and '_p.m4a' in audio_url:
        import re
        audio_url = re.sub(r'_\d+_p\.m4a', '_320.m4a', audio_url)
    # Get 500x500 cover image
    cover_url = _get_high_res_image(song.get('image'))
    
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
        'year': song.get('year', ''),
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
            detail_resp = requests.get(f"{SAAVN_API_BASE}/songs/{saavn_id}", timeout=5)
            detail_data = detail_resp.json()
            if detail_data.get('success') and detail_data.get('data') and len(detail_data['data']) > 0:
                full_song = detail_data['data'][0]
                norm = _normalize_song(full_song)
                audio_url = norm.get('audio_url')
                duration = norm.get('duration', duration)
                cover_image_url = norm.get('cover_image_url', cover_image_url)
                artists_list = norm.get('artists', artists_list)
                artist_name = norm.get('artist_name', artist_name)
                title = norm.get('title', title)
                log_error(f"Backfill successful for {saavn_id}. Resolved audio_url: {audio_url}")
            else:
                log_error(f"Backfill failed for {saavn_id}: success={detail_data.get('success')}, data_len={len(detail_data.get('data', []))}")
        except Exception as e:
            log_error(f"Failed to fetch song details for import-backfill ({saavn_id}): {str(e)}")

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
            itunes_resp = requests.get(f"https://itunes.apple.com/search?term={query_str}&entity=song&limit=1", timeout=3)
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
        resp = requests.get(
            f"{SAAVN_API_BASE}/artists/{artist_id}",
            params={'songCount': 20, 'albumCount': 10, 'sortBy': 'popularity'},
            timeout=10
        )
        data = resp.json()
        if not data.get('success'):
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
        top_songs = [_normalize_song(s) for s in top_songs_raw if isinstance(s, dict)]

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
            timeout=10
        )
        data = resp.json()
        if not data.get('success'):
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
            timeout=10
        )
        data = resp.json()
        if not data.get('success'):
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

@jiosaavn_bp.route('/home', methods=['GET'])
def get_home_content():
    """
    Personalized home page content based on user listening history.
    Accepts optional ?user_id= to personalize results.
    Returns: featured_playlists, trending_songs, new_releases, personalized_mixes.
    Cached for 5 minutes per user.
    """
    user_id = request.args.get('user_id', type=int)
    
    cache_key = f"home_{user_id if user_id else 'guest'}"
    if cache_key in _home_cache and time.time() - _home_cache[cache_key]['timestamp'] < 300: # 5 min TTL
        return jsonify(_home_cache[cache_key]['data'])

    content = {
        'featured_playlists': [],
        'trending_songs': [],
        'new_releases': [],
        'personalized_mixes': [],   # "Because you listen to X" sections
    }

    # ── Fetch user taste profile ──────────────────────────────
    user_genres = []
    user_artists = []
    
    if user_id:
        try:
            # 1. Inject Explicit Onboarding Preferences
            prefs = fetch_all("SELECT preference_type, preference_value FROM user_preferences WHERE user_id = %s", (user_id,))
            for p in prefs:
                if p['preference_type'] == 'genre':
                    user_genres.append({'genre': p['preference_value']})
                elif p['preference_type'] == 'artist':
                    user_artists.append({'artist_name': p['preference_value']})

            # 2. Top genres from live listening history (real genres only)
            stream_genres = fetch_all("""
                SELECT s.genre, COUNT(*) AS cnt
                FROM streams st
                JOIN songs s ON st.song_id = s.song_id
                WHERE st.user_id = %s AND s.genre IS NOT NULL AND s.genre != '' AND s.genre != 'Unknown'
                GROUP BY s.genre
                ORDER BY cnt DESC
                LIMIT 5
            """, (user_id,))
            user_genres.extend(stream_genres)
            
            # 3. Top artists from live listening history (primary signal)
            stream_artists = fetch_all("""
                SELECT u.username AS artist_name, COUNT(*) AS cnt
                FROM streams st
                JOIN songs s ON st.song_id = s.song_id
                JOIN artist_profiles ap ON s.artist_id = ap.artist_id
                JOIN users u ON ap.user_id = u.user_id
                WHERE st.user_id = %s
                GROUP BY u.username
                ORDER BY cnt DESC
                LIMIT 8
            """, (user_id,))
            user_artists.extend(stream_artists)
        except Exception as e:
            log_error(f"Error fetching user taste: {str(e)}")

    # ── Build personalized search queries ──────────────────────
    genre_names = [g['genre'] for g in user_genres if g.get('genre')]
    artist_names = [a['artist_name'] for a in user_artists 
                    if a.get('artist_name') and not a['artist_name'].endswith('@wave.local')]
    
    if artist_names:
        # Build playlist queries from top artists
        playlist_queries = []
        for a in artist_names[:4]:
            playlist_queries.append(f"{a} mix")
            playlist_queries.append(f"best of {a}")
        # Add some discovery queries
        playlist_queries.extend(['Trending Now', 'Chill Vibes', 'Top Hits'])
    else:
        # Default queries for new users
        playlist_queries = [
            'Bollywood Hits', 'Top Hindi', 'Trending Now', 'Chill Vibes',
            'Romantic Hits', 'Punjabi Hits', 'English Pop', 'Lofi'
        ]

    # Trending query — personalized by top artist or generic
    trending_query = artist_names[0] if artist_names else 'trending'
    
    # New releases query — based on taste or generic
    new_release_query = artist_names[0] + ' album' if artist_names else 'new releases 2026'

    try:
        # ── 1. Featured Playlists ──────────────────────────────
        for query in playlist_queries[:8]:
            try:
                resp = requests.get(
                    f"{SAAVN_API_BASE}/search/playlists",
                    params={'query': query, 'limit': 2},
                    timeout=5
                )
                data = resp.json()
                if data.get('success'):
                    raw_data = data.get('data', {})
                    results = raw_data.get('results', []) if isinstance(raw_data, dict) else []
                    if not results:
                        log_error(f"Empty results for featured playlist query '{query}'")
                    for p in results:
                        if isinstance(p, dict):
                            content['featured_playlists'].append(_normalize_playlist(p))
                else:
                    log_error(f"Upstream failure for playlist query '{query}': {data.get('message', 'No details')}")
            except Exception as e:
                log_error(f"Network error for playlist query '{query}': {str(e)}")
                continue

        # Deduplicate
        seen_ids = set()
        unique_playlists = []
        for p in content['featured_playlists']:
            if p.get('id') and p['id'] not in seen_ids:
                seen_ids.add(p['id'])
                unique_playlists.append(p)
        content['featured_playlists'] = unique_playlists[:12]

        # ── 2. Trending Songs (personalized) ───────────────────
        try:
            resp = requests.get(
                f"{SAAVN_API_BASE}/search/songs",
                params={'query': trending_query, 'limit': 15},
                timeout=8
            )
            data = resp.json()
            if data.get('success'):
                raw_data = data.get('data', {})
                results = raw_data.get('results', []) if isinstance(raw_data, dict) else []
                if not results:
                    log_error(f"Empty results for trending query '{trending_query}'")
                content['trending_songs'] = [_normalize_song(s) for s in results if isinstance(s, dict)]
            else:
                log_error(f"Upstream failure for trending query: {data.get('message', 'No details')}")
        except Exception as e:
            log_error(f"Failed to fetch trending songs: {str(e)}")

        # ── 3. New Releases (personalized) ─────────────────────
        try:
            resp = requests.get(
                f"{SAAVN_API_BASE}/search/albums",
                params={'query': new_release_query, 'limit': 10},
                timeout=8
            )
            data = resp.json()
            if data.get('success'):
                raw_data = data.get('data', {})
                results = raw_data.get('results', []) if isinstance(raw_data, dict) else []
                if not results:
                    log_error(f"Empty results for new releases query '{new_release_query}'")
                content['new_releases'] = [_normalize_album(a) for a in results if isinstance(a, dict)]
            else:
                log_error(f"Upstream failure for new releases: {data.get('message', 'No details')}")
        except Exception as e:
            log_error(f"Failed to fetch new releases: {str(e)}")

        # ── 4. Personalized Mixes ("Because you listen to [Genre]" & "More of [artist]") ─
        if genre_names or artist_names:
            seen_song_ids = set()
            
            # Genre-based mixes
            for genre in genre_names[:3]:
                try:
                    resp = requests.get(
                        f"{SAAVN_API_BASE}/search/songs",
                        params={'query': f"{genre} popular", 'limit': 10},
                        timeout=5
                    )
                    data = resp.json()
                    if data.get('success'):
                        raw_data = data.get('data', {})
                        results = raw_data.get('results', []) if isinstance(raw_data, dict) else []
                        songs = []
                        for s in results:
                            if isinstance(s, dict):
                                norm = _normalize_song(s)
                                sid = norm.get('saavn_id', '')
                                if sid and sid not in seen_song_ids:
                                    seen_song_ids.add(sid)
                                    songs.append(norm)
                        if songs:
                            content['personalized_mixes'].append({
                                'title': f"Because you like {genre}",
                                'type': 'genre',
                                'key': f"genre-{genre}",
                                'songs': songs[:8]
                            })
                except:
                    continue

            # Artist-based mixes for top artists
            for artist in artist_names[:3]:
                try:
                    resp = requests.get(
                        f"{SAAVN_API_BASE}/search/songs",
                        params={'query': artist, 'limit': 12},
                        timeout=5
                    )
                    data = resp.json()
                    if data.get('success'):
                        raw_data = data.get('data', {})
                        results = raw_data.get('results', []) if isinstance(raw_data, dict) else []
                        songs = []
                        for s in results:
                            if isinstance(s, dict):
                                norm = _normalize_song(s)
                                sid = norm.get('saavn_id', '')
                                if sid and sid not in seen_song_ids:
                                    seen_song_ids.add(sid)
                                    songs.append(norm)
                        if songs:
                            content['personalized_mixes'].append({
                                'title': f"More of {artist}",
                                'type': 'artist',
                                'key': artist,
                                'songs': songs[:8]
                            })
                except:
                    continue

    except Exception as e:
        log_error(f"Home content aggregation error: {str(e)}")

    response_data = {
        'success': True, 
        'content': content,
        'personalized': bool(genre_names or artist_names)
    }
    
    # Save to memory cache for 5 minutes
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
