from flask import Blueprint, request, jsonify
from db import execute_query, fetch_all, fetch_one
from middleware import token_required, artist_required

import os
import datetime
import hashlib
from werkzeug.utils import secure_filename
import mutagen
import requests as ext_requests
import urllib.parse

# Ensure upload directory exists
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads', 'songs')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

IMAGE_UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads', 'images')
os.makedirs(IMAGE_UPLOAD_FOLDER, exist_ok=True)

songs_bp = Blueprint('songs', __name__)

@songs_bp.route('', methods=['GET'])
def get_songs():
    query = """
        SELECT song_id, title, audio_url, cover_image_url, duration, genre, play_count, artist_id
        FROM songs
        ORDER BY uploaded_at DESC
    """
    songs = fetch_all(query)
    return jsonify({"songs": enrich_song_metadata(songs)}), 200

def enrich_song_metadata(songs):
    """Enrich songs with full artist names and metadata list for player."""
    if not songs:
        return []

    # Batch fetch all artists for all songs in ONE query (fixes N+1)
    song_ids = [s['song_id'] for s in songs if s.get('song_id')]
    if not song_ids:
        return songs

    placeholders = ','.join(['%s'] * len(song_ids))
    all_artists = fetch_all(f"""
        SELECT sa.song_id, ap.artist_id as id, u.username as name
        FROM song_artists sa
        JOIN artist_profiles ap ON sa.artist_id = ap.artist_id
        JOIN users u ON ap.user_id = u.user_id
        WHERE sa.song_id IN ({placeholders})
        ORDER BY sa.is_primary DESC
    """, tuple(song_ids))

    # Group artists by song_id
    from collections import defaultdict
    artists_by_song = defaultdict(list)
    for a in all_artists:
        artists_by_song[a['song_id']].append({'id': a['id'], 'name': a['name']})

    # Attach to each song
    for s in songs:
        artists = artists_by_song.get(s.get('song_id'), [])
        s['artist_name'] = ", ".join([a['name'] for a in artists])
        s['artists'] = artists
        if artists:
            s['artist_id'] = artists[0]['id']

    return songs

@songs_bp.route('', methods=['POST'])
@token_required
def add_song():
    # Handle File Upload
    if 'audio_file' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
        
    file = request.files['audio_file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
        
    # Use authenticated user from JWT token
    user_id = request.current_user.get('user_id')
    
    def log_error(msg):
        with open('upload_debug.log', 'a') as f:
            f.write(f"{datetime.datetime.now()}: {msg}\n")

    if not user_id:
        log_error("UPLOAD FAILED: Missing user_id in request")
        return jsonify({"error": "Missing user_id"}), 400

    # Verify uploader is an artist or admin
    user = fetch_one("SELECT role, username FROM users WHERE user_id = %s", (user_id,))
    
    if not user:
        log_error(f"UPLOAD FAILED: No user found with id {user_id}")
        return jsonify({"error": "Unauthorized. User not found."}), 403

    if user['role'] not in ['artist', 'admin']:
        log_error(f"UPLOAD FAILED: User {user_id} has insufficient role: {user['role']}")
        return jsonify({"error": "Unauthorized. Only artists and admins can upload songs."}), 403
        
    # Secure and save the physical file
    filename = secure_filename(file.filename)
    unique_filename = f"{user_id}_{filename}"
    filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(filepath)
    
    title = request.form.get('title')
    genre = request.form.get('genre', '')
    artist_name_input = request.form.get('artist_name', '').strip()
    
    # Auto-Extract Metadata seamlessly for any format
    duration = 0
    extracted_cover_data = None
    try:
        audio = mutagen.File(filepath)
        if audio is not None:
            duration = int(audio.info.length) if hasattr(audio, 'info') and hasattr(audio.info, 'length') else 0
            tags = audio.tags if hasattr(audio, 'tags') and audio.tags else {}
            
            def get_tag(keys):
                for k in keys:
                    if k in tags:
                        val = tags[k]
                        if isinstance(val, list) and len(val) > 0: val = val[0]
                        if hasattr(val, 'text') and val.text: return str(val.text[0])
                        return str(val)
                return None

            if not title: title = get_tag(['TIT2', '\xa9nam', 'title'])
            if not genre: genre = get_tag(['TCON', '\xa9gen', 'genre'])
            if not artist_name_input: artist_name_input = get_tag(['TPE1', '\xa9ART', 'artist'])
            
            # Universal Cover Art Extraction
            # MP3 (ID3 APIC)
            if hasattr(tags, 'keys'):
                for k in list(tags.keys()):
                    if isinstance(k, str) and k.startswith('APIC'):
                        extracted_cover_data = getattr(tags[k], 'data', None)
                        break
            # M4A (MP4 covr)
            if not extracted_cover_data and hasattr(tags, 'get'):
                covrs = tags.get('covr')
                if covrs and isinstance(covrs, list) and len(covrs) > 0: 
                    extracted_cover_data = covrs[0]
                elif covrs:
                    extracted_cover_data = covrs
            # FLAC (pictures)
            if not extracted_cover_data and hasattr(audio, 'pictures') and audio.pictures:
                extracted_cover_data = audio.pictures[0].data

    except Exception as e:
        log_error(f"Mutagen extraction failed for {filepath}: {str(e)}")

    if not title: title = filename
        
    # Resolve or Create Artist Stub Profile
    import uuid
    artist_id = None
    
    if user['role'] == 'artist':
        # Force the song strictly to the uploader's artist profile (ignoring ID3/distributor tags)
        artist_prof = fetch_one("SELECT artist_id FROM artist_profiles WHERE user_id = %s", (user_id,))
        if artist_prof:
            artist_id = artist_prof['artist_id']
        else:
            artist_id = execute_query("INSERT INTO artist_profiles (user_id, bio, verified) VALUES (%s, %s, %s)", (user_id, "System Generated Profile", False))
    else:
        # Admin uploads - use provided name or ID3 tag
        if artist_name_input:
            artist_name_input = artist_name_input[:50].strip()
        if not artist_name_input:
            artist_name_input = "Unknown Artist"
            
        existing_user = fetch_one("SELECT user_id, role FROM users WHERE username = %s", (artist_name_input,))
        
        if existing_user:
            if existing_user['role'] == 'listener':
                execute_query("UPDATE users SET role = 'artist' WHERE user_id = %s", (existing_user['user_id'],))
            artist_prof = fetch_one("SELECT artist_id FROM artist_profiles WHERE user_id = %s", (existing_user['user_id'],))
            if artist_prof:
                artist_id = artist_prof['artist_id']
            else:
                artist_id = execute_query("INSERT INTO artist_profiles (user_id, bio, verified) VALUES (%s, %s, %s)", (existing_user['user_id'], "System Generated Profile", False))
        else:
            # Create a stub user + profile
            fake_email = f"stub_{uuid.uuid4().hex[:8]}@wave.local"
            dummy_hash = "scrypt:32768:8:1$dummy"
            new_u_id = execute_query(
                "INSERT INTO users (username, email, hashed_password, role, first_name, last_name) VALUES (%s, %s, %s, %s, %s, %s)",
                (artist_name_input, fake_email, dummy_hash, 'artist', 'System', 'Artist')
            )
            artist_id = execute_query("INSERT INTO artist_profiles (user_id, bio, verified) VALUES (%s, %s, %s)", (new_u_id, "System Auto-Created Artist", False))

    from storage import upload_file_to_supabase
    s_audio_url = upload_file_to_supabase(filepath, f"songs/{unique_filename}")
    audio_url = s_audio_url if s_audio_url else f"/uploads/songs/{unique_filename}"
    cover_image_url = request.form.get('cover_image_url', '')

    if 'cover_image_file' in request.files and request.files['cover_image_file'].filename != '':
        cover_file = request.files['cover_image_file']
        cover_filename = secure_filename(cover_file.filename)
        unique_cover_filename = f"cover_{user_id}_{cover_filename}"
        
        from storage import upload_file_to_supabase
        s_url = upload_file_to_supabase(cover_file, f"images/{unique_cover_filename}")
        if s_url:
            cover_image_url = s_url
        else:
            cover_filepath = os.path.join(IMAGE_UPLOAD_FOLDER, unique_cover_filename)
            cover_file.seek(0)
            cover_file.save(cover_filepath)
            cover_image_url = f"/api/uploads/images/{unique_cover_filename}"
            
    elif extracted_cover_data and not cover_image_url:
        # Save auto-extracted cover art
        import hashlib
        cover_hash = hashlib.md5(extracted_cover_data).hexdigest()[:12]
        unique_cover_filename = f"auto_cover_{cover_hash}.jpg"
        cover_filepath = os.path.join(IMAGE_UPLOAD_FOLDER, unique_cover_filename)
        if not os.path.exists(cover_filepath):
            with open(cover_filepath, 'wb') as f:
                f.write(extracted_cover_data)
                
        from storage import upload_file_to_supabase
        s_url = upload_file_to_supabase(cover_filepath, f"images/{unique_cover_filename}")
        cover_image_url = s_url if s_url else f"/api/uploads/images/{unique_cover_filename}"

    album_id = request.form.get('album_id')

    query = """
        INSERT INTO songs (artist_id, album_id, title, audio_url, cover_image_url, duration, genre, uploaded_by)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """

    try:
        if not artist_id:
            msg = f"UPLOAD FAILED: artist_id resolution failed for {artist_name_input}"
            log_error(msg)
            return jsonify({"error": "Failed to resolve or create artist profile."}), 500
            
        safe_genre = genre[:100] if genre else ""
        album_id_val = int(album_id) if album_id and str(album_id).isdigit() else None
        result = execute_query(query, (artist_id, album_id_val, title[:200], audio_url, cover_image_url, duration, safe_genre, user_id))
        if result:
            song_id = result
            # Enforce song_artists mapping for universal search and recommendation engine
            if isinstance(song_id, int):
                execute_query(
                    "INSERT INTO song_artists (song_id, artist_id, is_primary) VALUES (%s, %s, TRUE)",
                    (song_id, artist_id)
                )
                
            return jsonify({
                "message": "Song added successfully", 
                "song_id": song_id,
                "metadata_extracted": {
                    "title": title,
                    "duration": duration,
                    "genre": genre
                }
            }), 201
        else:
            msg = f"FAILED TO ADD SONG: artist_id={artist_id}, title={title}"
            log_error(msg)
            return jsonify({"error": "Failed to add song to database (Database Error)"}), 500
    except Exception as e:
        msg = f"SONG UPLOAD CRASH: {str(e)}"
        log_error(msg)
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

@songs_bp.route('/<int:song_id>', methods=['DELETE'])
@token_required
def delete_song(song_id):
    # Only admin or the uploader can delete
    current_role = request.current_user.get('role')
    current_uid = request.current_user.get('user_id')
    if current_role != 'admin':
        song = fetch_one("SELECT uploaded_by FROM songs WHERE song_id = %s", (song_id,))
        if not song:
            return jsonify({"error": "Song not found"}), 404
        if song.get('uploaded_by') != current_uid:
            return jsonify({"error": "You can only delete your own songs"}), 403
    query = "DELETE FROM songs WHERE song_id = %s"
    if execute_query(query, (song_id,)):
        return jsonify({"message": "Song deleted successfully"}), 200
    return jsonify({"error": "Failed to delete song"}), 500

@songs_bp.route('/search', methods=['GET'])
def search_local():
    query_param = request.args.get('q', '').strip()
    search_type = request.args.get('type', 'song').lower().rstrip('s')
    if not query_param:
        return jsonify({"results": []}), 200
        
    like_pattern = f"%{query_param}%"
    boolean_pattern = f"{query_param}*" 

    if search_type == 'all':
        # Combined search for All tab
        # 1. Songs
        songs_query = """
            SELECT DISTINCT s.song_id, s.title, s.audio_url, s.cover_image_url, s.duration, s.genre, s.play_count
            FROM songs s
            LEFT JOIN song_artists sa ON s.song_id = sa.song_id
            LEFT JOIN artist_profiles ap ON sa.artist_id = ap.artist_id
            LEFT JOIN users u ON ap.user_id = u.user_id
            WHERE s.title LIKE %s OR s.genre LIKE %s OR u.username LIKE %s
            LIMIT 10
        """
        matched_songs = fetch_all(songs_query, (like_pattern, like_pattern, like_pattern))
        
        # 2. Artists
        artists_query = """
            SELECT ap.artist_id as id, u.username as name, u.avatar_url as image, ap.verified
            FROM artist_profiles ap
            JOIN users u ON ap.user_id = u.user_id
            WHERE u.username LIKE %s
            LIMIT 5
        """
        matched_artists = fetch_all(artists_query, (like_pattern,))
        for a in matched_artists: 
            a['type'] = 'artist'
            a['source'] = 'local'
            
        # 3. Playlists (Minimal for All tab)
        playlists_query = "SELECT playlist_id as id, title as name FROM playlists WHERE title LIKE %s LIMIT 5"
        matched_playlists = fetch_all(playlists_query, (like_pattern,))
        for p in matched_playlists: 
            p['type'] = 'playlist'
            p['source'] = 'local'

        return jsonify({
            "results": {
                "songs": enrich_song_metadata(matched_songs),
                "artists": matched_artists,
                "playlists": matched_playlists,
                "albums": []
            },
            "type": "all"
        })

    if search_type == 'song':
        # Search in titles, genres, and artist names (matching any artist in the song)
        search_query = """
            SELECT DISTINCT s.song_id, s.title, s.audio_url, s.cover_image_url, s.duration, s.genre, s.play_count
            FROM songs s
            LEFT JOIN song_artists sa ON s.song_id = sa.song_id
            LEFT JOIN artist_profiles ap ON sa.artist_id = ap.artist_id
            LEFT JOIN users u ON ap.user_id = u.user_id
            WHERE s.title LIKE %s OR s.genre LIKE %s
               OR u.username LIKE %s
        """
        matched_songs = fetch_all(search_query, (like_pattern, like_pattern, like_pattern))
        return jsonify({"results": enrich_song_metadata(matched_songs), "type": "song"})

    elif search_type == 'artist':
        search_query = """
            SELECT ap.artist_id as id, u.username as name, u.avatar_url as image, ap.verified, ap.bio
            FROM artist_profiles ap
            JOIN users u ON ap.user_id = u.user_id
            WHERE u.username LIKE %s
        """
        artists = fetch_all(search_query, (like_pattern,))
        # Map to common format
        for a in artists:
            a['type'] = 'artist'
            a['source'] = 'local'
        return jsonify({"results": artists, "type": "artist"})

    elif search_type == 'album':
        # Assuming we have an 'albums' table based on previous context/schema
        # If not, we'll return empty for now to avoid crash
        try:
            search_query = """
                SELECT album_id as id, title as name, cover_image_url, artist_id
                FROM albums
                WHERE title LIKE %s
            """
            albums = fetch_all(search_query, (like_pattern,))
            for a in albums:
                a['type'] = 'album'
                a['source'] = 'local'
            return jsonify({"results": albums, "type": "album"})
        except:
            return jsonify({"results": [], "type": "album"})

    elif search_type == 'playlist':
        search_query = """
            SELECT playlist_id as id, title as name, description, user_id
            FROM playlists
            WHERE (title LIKE %s OR description LIKE %s)
        """
        playlists = fetch_all(search_query, (like_pattern, like_pattern))
        for p in playlists:
            p['type'] = 'playlist'
            p['source'] = 'local'
        return jsonify({"results": playlists, "type": "playlist"})

    return jsonify({"results": [], "type": search_type}), 200

@songs_bp.route('/<int:song_id>/stream', methods=['POST'])
def record_stream(song_id):
    data = request.json
    user_id = data.get('user_id') # Can be null for anonymous streams
    listen_duration = data.get('listen_duration', 0)
    
    # Record stream history
    history_query = "INSERT INTO streams (user_id, song_id, listen_duration) VALUES (%s, %s, %s)"
    execute_query(history_query, (user_id, song_id, listen_duration))

    # Increment play_count in application code (replaces MySQL trigger for TiDB compatibility)
    if listen_duration >= 20:
        execute_query("UPDATE songs SET play_count = play_count + 1 WHERE song_id = %s", (song_id,))
    
    return jsonify({"message": "Stream recorded successfully"}), 200

@songs_bp.route('/<int:song_id>/skip', methods=['POST'])
def record_skip(song_id):
    """Record a skip event for negative signal in the recommendation engine."""
    data = request.json
    user_id = data.get('user_id')
    skip_position = data.get('skip_position', 0)  # Seconds into song when skipped
    
    if not user_id:
        return jsonify({"message": "Skip noted (anonymous)"}), 200
    
    execute_query(
        "INSERT INTO song_skips (user_id, song_id, skip_position) VALUES (%s, %s, %s)",
        (user_id, song_id, skip_position)
    )
    
    return jsonify({"message": "Skip recorded"}), 200

@songs_bp.route('/<int:song_id>/like', methods=['POST'])
def toggle_like_song(song_id):
    data = request.json
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
        
    # Check if already liked
    existing = fetch_one("SELECT * FROM user_liked_songs WHERE user_id = %s AND song_id = %s", (user_id, song_id))
    
    if existing:
        # Unlike
        execute_query("DELETE FROM user_liked_songs WHERE user_id = %s AND song_id = %s", (user_id, song_id))
        return jsonify({"liked": False, "message": "Song removed from library"}), 200
    else:
        # Like
        execute_query("INSERT INTO user_liked_songs (user_id, song_id) VALUES (%s, %s)", (user_id, song_id))
        return jsonify({"liked": True, "message": "Song added to library"}), 201

@songs_bp.route('/liked/<int:user_id>', methods=['GET'])
def get_liked_songs(user_id):
    query = """
        SELECT s.song_id, s.title, s.audio_url, s.cover_image_url, s.duration, s.genre, s.play_count,
               u.username as artist_name, ap.artist_id
        FROM songs s
        JOIN user_liked_songs ls ON s.song_id = ls.song_id
        JOIN artist_profiles ap ON s.artist_id = ap.artist_id
        JOIN users u ON ap.user_id = u.user_id
        WHERE ls.user_id = %s
    """
    songs = fetch_all(query, (user_id,))
    return jsonify({"songs": enrich_song_metadata(songs)}), 200

@songs_bp.route('/artist/<int:artist_id>', methods=['GET'])
def get_artist_profile(artist_id):
    # Fetch profile and user info
    query = """
        SELECT ap.artist_id, ap.bio, ap.verified, ap.banner_url,
               u.username, u.avatar_url
        FROM artist_profiles ap
        JOIN users u ON ap.user_id = u.user_id
        WHERE ap.artist_id = %s
    """
    profile = fetch_one(query, (artist_id,))
    if not profile:
        return jsonify({"error": "Artist not found"}), 404
        
    # Fetch songs
    songs_query = """
        SELECT s.song_id, s.title, s.audio_url, s.cover_image_url, s.duration, s.genre, s.play_count
        FROM songs s
        JOIN song_artists sa ON s.song_id = sa.song_id
        WHERE sa.artist_id = %s
        ORDER BY s.uploaded_at DESC
    """
    songs = fetch_all(songs_query, (artist_id,))
    profile['songs'] = enrich_song_metadata(songs)
    return jsonify({"profile": profile}), 200

@songs_bp.route('/artist/by-user/<int:user_id>', methods=['GET'])
def get_artist_by_user(user_id):
    """Look up artist profile and songs by user_id (for Artist Portal)"""
    artist_prof = fetch_one("SELECT artist_id FROM artist_profiles WHERE user_id = %s", (user_id,))
    if not artist_prof:
        return jsonify({"error": "No artist profile found for this user"}), 404
    
    artist_id = artist_prof['artist_id']
    profile_query = """
        SELECT ap.artist_id, ap.bio, ap.verified, ap.banner_url,
               u.username, u.avatar_url
        FROM artist_profiles ap
        JOIN users u ON ap.user_id = u.user_id
        WHERE ap.artist_id = %s
    """
    profile = fetch_one(profile_query, (artist_id,))
    
    songs_query = """
        SELECT s.song_id, s.title, s.audio_url, s.cover_image_url, s.duration, s.genre, s.play_count
        FROM songs s
        JOIN song_artists sa ON s.song_id = sa.song_id
        WHERE sa.artist_id = %s
        ORDER BY s.uploaded_at DESC
    """
    songs = fetch_all(songs_query, (artist_id,))
    profile['songs'] = enrich_song_metadata(songs)
    return jsonify({"profile": profile, "artist_id": artist_id}), 200

@songs_bp.route('/recent/<int:user_id>', methods=['GET'])
def get_recently_played(user_id):
    # Fetch user's latest unique streams
    query = """
        SELECT s.song_id, s.title, s.audio_url, s.cover_image_url, s.duration, s.genre,
               u.username as artist_name, ap.artist_id
        FROM songs s
        JOIN (
            SELECT song_id, MAX(streamed_at) as last_streamed
            FROM streams
            WHERE user_id = %s
            GROUP BY song_id
            ORDER BY last_streamed DESC
            LIMIT 10
        ) recent ON s.song_id = recent.song_id
        JOIN artist_profiles ap ON s.artist_id = ap.artist_id
        JOIN users u ON ap.user_id = u.user_id
        ORDER BY recent.last_streamed DESC
    """
    recent_songs = fetch_all(query, (user_id,))
    return jsonify({"songs": enrich_song_metadata(recent_songs)}), 200

@songs_bp.route('/<int:song_id>', methods=['PUT', 'PATCH'])
def update_song(song_id):
    title = request.form.get('title')
    genre = request.form.get('genre')
    cover_image_url = request.form.get('cover_image_url')

    if 'cover_image_file' in request.files:
        cover_file = request.files['cover_image_file']
        if cover_file and cover_file.filename != '':
            cover_filename = secure_filename(cover_file.filename)
            unique_cover_filename = f"cover_{song_id}_{cover_filename}"
            cover_filepath = os.path.join(IMAGE_UPLOAD_FOLDER, unique_cover_filename)
            cover_file.save(cover_filepath)
            cover_image_url = f"/api/uploads/images/{unique_cover_filename}"

    song = fetch_one("SELECT title, genre, cover_image_url, artist_id FROM songs WHERE song_id = %s", (song_id,))
    if not song:
        return jsonify({"error": "Song not found"}), 404

    new_title = title if title is not None else song['title']
    new_genre = genre if genre is not None else song['genre']
    new_cover = cover_image_url if cover_image_url is not None else song['cover_image_url']
    
    new_artist_id = song['artist_id']
    artist_name_input = request.form.get('artist_name')
    
    if artist_name_input is not None:
        artist_name_input = artist_name_input.strip()
        if artist_name_input:
            import uuid
            existing_user = fetch_one("SELECT user_id FROM users WHERE username = %s AND role = 'artist'", (artist_name_input,))
            if existing_user:
                artist_prof = fetch_one("SELECT artist_id FROM artist_profiles WHERE user_id = %s", (existing_user['user_id'],))
                if artist_prof:
                    new_artist_id = artist_prof['artist_id']
                else:
                    new_artist_id = execute_query("INSERT INTO artist_profiles (user_id, bio, verified) VALUES (%s, %s, %s)", (existing_user['user_id'], "System Generated Profile", False))
            else:
                fake_email = f"stub_{uuid.uuid4().hex[:8]}@wave.local"
                dummy_hash = "scrypt:32768:8:1$dummy"
                new_u_id = execute_query("INSERT INTO users (username, email, hashed_password, role, first_name, last_name) VALUES (%s, %s, %s, %s, %s, %s)", (artist_name_input, fake_email, dummy_hash, 'artist', 'System', 'Artist'))
                new_artist_id = execute_query("INSERT INTO artist_profiles (user_id, bio, verified) VALUES (%s, %s, %s)", (new_u_id, "System Auto-Created Artist", False))

    query = "UPDATE songs SET title = %s, genre = %s, cover_image_url = %s, artist_id = %s WHERE song_id = %s"
    if execute_query(query, (new_title, new_genre, new_cover, new_artist_id, song_id)):
        return jsonify({"message": "Song updated successfully"}), 200
    
    return jsonify({"error": "Failed to update song"}), 500


@songs_bp.route('/recommendations/<int:user_id>', methods=['GET'])
def get_recommendations(user_id):
    """
    Personalized recommendations based on listening history and preferences.
    
    Pipeline (in priority order):
    1. Hybrid Recommendation Engine (content + collaborative + session)
    2. JioSaavn API fallback for cold-start / sparse DB
    """
    # 1. Try the new hybrid recommendation engine
    try:
        from engine.ranker import get_home_recommendations
        engine_recs = get_home_recommendations(user_id, count=15)
        
        if engine_recs and len(engine_recs) >= 3:
            # Enrich with artist junction data
            from routes.songs import enrich_song_metadata
            return jsonify({
                "success": True,
                "songs": enrich_song_metadata(engine_recs),
                "label": "Recommended for You",
                "source": "hybrid_engine"
            }), 200
    except Exception as e:
        print(f"[RecEngine] Hybrid engine error in /recommendations: {e}")

    # 2. Fallback: delegate to the recommend blueprint's JioSaavn fallback
    try:
        from routes.recommend import _jiosaavn_fallback_home
        return _jiosaavn_fallback_home(user_id, 15)
    except Exception as e:
        print(f"[RecEngine] JioSaavn fallback error: {e}")

    # 3. Last resort: return empty
    return jsonify({
        'success': True,
        'songs': [],
        'label': 'Recommended for You',
        'source': 'empty'
    }), 200

# ==========================================
#              LYRICS INTEGRATION
# ==========================================
from engine import cache as rec_cache

@songs_bp.route('/<song_id>/lyrics', methods=['GET'])
def get_song_lyrics(song_id):
    """
    Fetch synced lyrics from LRCLIB.
    Uses in-memory cache to prevent rate-limiting from the public LRCLIB server.
    """
    cache_key = f"lyrics_{song_id}"
    cached = rec_cache.get(cache_key)
    if cached is not None:
        return jsonify(cached)

    try:
        title = ""
        artist = ""
        duration = 0
        
        # 1. Resolve metadata for the query
        if str(song_id).startswith("saavn_"):
            # Fetch from jiosaavn API proxy
            from routes.jiosaavn import SAAVN_API_BASE
            from routes.jiosaavn import _normalize_song, get_preferred_quality
            try:
                real_id = str(song_id).replace("saavn_", "")
                resp = ext_requests.get(f"{SAAVN_API_BASE}/songs", params={'ids': real_id}, timeout=10)
                data = resp.json()
                if data.get('success'):
                    sdata = data.get('data', [])
                    if sdata and len(sdata) > 0:
                        norm = _normalize_song(sdata[0], get_preferred_quality())
                        title = norm.get('title', '')
                        artist = norm.get('artist_name', '')
                        duration = norm.get('duration', 0)
            except Exception:
                pass
        else:
            # Fetch from local DB
            song_data = fetch_one("""
                SELECT s.title, s.duration, u.username as artist_name 
                FROM songs s 
                LEFT JOIN artist_profiles ap ON s.artist_id = ap.artist_id
                LEFT JOIN users u ON ap.user_id = u.user_id
                WHERE s.song_id = %s
            """, (song_id,))
            if song_data:
                title = song_data['title']
                artist = song_data['artist_name']
                duration = song_data['duration']

        # 2. Query LRCLIB
        if not title:
            return jsonify({'success': False, 'error': 'Song metadata could not be resolved for lyrics search'}), 404

        # Clean title slightly (remove features, remasters)
        import re
        clean_title = re.sub(r'\(.*?(feat|ft|remix|version|acoustic|live|radio).*?\)', '', title, flags=re.IGNORECASE).strip()
        clean_title = clean_title.split(' - ')[0].strip()
        
        search_params = {
            'track_name': clean_title,
            'artist_name': artist or ''
        }
        
        # LRCLIB API call
        resp = ext_requests.get('https://lrclib.net/api/search', params=search_params, timeout=10)
        
        if resp.status_code == 200:
            results = resp.json()
            if results and len(results) > 0:
                # Pick best match 
                best_match = None
                for res in results:
                    if res.get('syncedLyrics'):
                        best_match = res
                        break
                
                if not best_match:
                    best_match = results[0] # Fallback to plain text
                
                payload = {
                    'success': True,
                    'plainLyrics': best_match.get('plainLyrics', ''),
                    'syncedLyrics': best_match.get('syncedLyrics', ''),
                    'instrumental': best_match.get('instrumental', False)
                }
                
                # Cache for 24 hours
                rec_cache.set(cache_key, payload, ttl_seconds=86400)
                return jsonify(payload)

        # Fallback empty response
        payload = {
            'success': True,
            'plainLyrics': '',
            'syncedLyrics': ''
        }
        rec_cache.set(cache_key, payload, ttl_seconds=86400)
        return jsonify(payload)

    except Exception as e:
        print(f"[Lyrics Proxy] Error for {song_id}: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500


