"""
recommend.py — Recommendation API Routes

Three endpoints that serve the hybrid recommendation engine:
  /recommend/home      — Personalized home feed (blended engines)
  /recommend/queue     — "Up Next" predictions based on current song
  /recommend/playlist  — Generate a playlist from seed songs

All endpoints gracefully fall back to JioSaavn API when the local
recommendation engine has insufficient data (lazy-import architecture).
"""

from flask import Blueprint, request, jsonify
from engine.ranker import get_home_recommendations, get_queue_predictions, generate_playlist
from engine.features import get_all_song_metadata

recommend_bp = Blueprint('recommend', __name__)


def _enrich_with_artist_info(songs):
    """Ensure each song has the fields the frontend expects."""
    from db import fetch_all
    enriched = []
    for song in songs:
        sid = song.get('song_id')
        if not sid:
            continue
        
        # Fetch artist list from song_artists junction table
        if 'artists' not in song or not song['artists']:
            artists = fetch_all("""
                SELECT ap.artist_id as id, u.username as name, u.avatar_url as image
                FROM song_artists sa
                JOIN artist_profiles ap ON sa.artist_id = ap.artist_id
                JOIN users u ON ap.user_id = u.user_id
                WHERE sa.song_id = %s
            """, (sid,))
            song['artists'] = artists or []
        
        enriched.append(song)
    return enriched


@recommend_bp.route('/home', methods=['GET'])
def home_recommendations():
    """
    GET /api/recommend/home?user_id=X
    
    Returns personalized recommendations for the home feed.
    Falls back to JioSaavn trending for cold-start users with no DB songs.
    """
    user_id = request.args.get('user_id', type=int)
    count = request.args.get('count', 15, type=int)
    
    if not user_id:
        return jsonify({'success': False, 'error': 'user_id is required'}), 400
    
    try:
        # Try the local recommendation engine first
        recs = get_home_recommendations(user_id, count=count)
        
        if recs and len(recs) >= 3:
            # We have enough local recommendations
            enriched = _enrich_with_artist_info(recs)
            return jsonify({
                'success': True,
                'songs': enriched,
                'source': 'hybrid_engine',
                'label': 'Recommended for You'
            })
        
        # Fall back to JioSaavn-powered recommendations
        return _jiosaavn_fallback_home(user_id, count)
        
    except Exception as e:
        print(f"[RecEngine] Home recommendation error: {e}")
        # Graceful fallback
        return _jiosaavn_fallback_home(user_id, count)


@recommend_bp.route('/queue', methods=['GET'])
def queue_predictions():
    """
    GET /api/recommend/queue?user_id=X&current_song_id=Y
    
    Returns predicted "Up Next" songs based on current playback.
    """
    user_id = request.args.get('user_id', type=int)
    current_song_id = request.args.get('current_song_id', type=int)
    count = request.args.get('count', 10, type=int)
    
    if not current_song_id:
        return jsonify({'success': False, 'error': 'current_song_id is required'}), 400
    
    try:
        recs = get_queue_predictions(user_id, current_song_id, count=count)
        
        if recs and len(recs) >= 2:
            enriched = _enrich_with_artist_info(recs)
            return jsonify({
                'success': True,
                'songs': enriched,
                'source': 'session_engine',
                'current_song_id': current_song_id
            })
        
        # Fallback: content similarity via the current song's attributes
        return _jiosaavn_fallback_queue(user_id, current_song_id, count)
        
    except Exception as e:
        print(f"[RecEngine] Queue prediction error: {e}")
        return _jiosaavn_fallback_queue(user_id, current_song_id, count)


@recommend_bp.route('/playlist', methods=['POST'])
def playlist_generation():
    """
    POST /api/recommend/playlist
    Body: { "seed_song_ids": [1,2,3], "count": 20, "user_id": X }
    
    Generates a playlist from seed songs using content similarity.
    """
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'JSON body required'}), 400
    
    seed_ids = data.get('seed_song_ids', [])
    count = data.get('count', 20)
    user_id = data.get('user_id')
    
    if not seed_ids:
        return jsonify({'success': False, 'error': 'seed_song_ids is required'}), 400
    
    try:
        recs = generate_playlist(seed_ids, count=count, user_id=user_id)
        enriched = _enrich_with_artist_info(recs)
        
        return jsonify({
            'success': True,
            'songs': enriched,
            'source': 'content_engine',
            'seed_count': len(seed_ids)
        })
    except Exception as e:
        print(f"[RecEngine] Playlist generation error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


# ── JioSaavn Fallback Functions ──────────────────────────────────────────

def _jiosaavn_fallback_home(user_id, count):
    """
    When the local engine doesn't have enough data, use JioSaavn API
    to generate recommendations based on the user's taste profile.
    This is the same strategy the old system used, but cleaner.
    """
    import requests as ext_requests
    from config import Config
    from engine.ranker import get_dynamic_taste_profile
    from routes.jiosaavn import _normalize_song, _dedup_songs, get_preferred_quality
    import random
    
    SAAVN_API_BASE = Config.SAAVN_API_URL
    profile = get_dynamic_taste_profile(user_id)
    pq = get_preferred_quality(user_id)
    
    # Build search queries from taste profile
    search_queries = []
    for artist in profile.get('artists', [])[:3]:
        if not artist.endswith('@wave.local'):
            search_queries.append(artist)
            search_queries.append(f"{artist} best")
    for genre in profile.get('genres', [])[:2]:
        search_queries.append(f"{genre} popular")
    
    if not search_queries:
        search_queries = ['trending songs', 'top hits 2026', 'viral hits']
    
    seen_ids = set()
    recommendations = []
    
    for query in search_queries[:6]:
        try:
            resp = ext_requests.get(
                f"{SAAVN_API_BASE}/search/songs",
                params={'query': query, 'limit': 8},
                timeout=60
            )
            data = resp.json()
            if data.get('success'):
                raw_data = data.get('data', {})
                results = raw_data.get('results', []) if isinstance(raw_data, dict) else []
                for s in results:
                    if isinstance(s, dict):
                        norm = _normalize_song(s, pq)
                        sid = norm.get('saavn_id', '')
                        if sid and sid not in seen_ids:
                            seen_ids.add(sid)
                            recommendations.append(norm)
        except Exception:
            continue
    
    recommendations = _dedup_songs(recommendations)
    random.shuffle(recommendations)
    
    return jsonify({
        'success': True,
        'songs': recommendations[:count],
        'source': 'jiosaavn_fallback',
        'label': 'Recommended for You',
        'based_on': {
            'genres': profile.get('genres', []),
            'artists': [a for a in profile.get('artists', []) if not a.endswith('@wave.local')]
        }
    })


def _jiosaavn_fallback_queue(user_id, current_song_id, count):
    """
    Fallback queue generation: find the current song's metadata,
    then search JioSaavn for similar content.
    """
    import requests as ext_requests
    from config import Config
    from db import fetch_one
    from routes.jiosaavn import _normalize_song, _dedup_songs, get_preferred_quality
    
    SAAVN_API_BASE = Config.SAAVN_API_URL
    pq = get_preferred_quality(user_id)
    
    # Get the current song's details for search context
    song = fetch_one("""
        SELECT s.title, s.genre, u.username AS artist_name
        FROM songs s
        LEFT JOIN artist_profiles ap ON s.artist_id = ap.artist_id
        LEFT JOIN users u ON ap.user_id = u.user_id
        WHERE s.song_id = %s
    """, (current_song_id,))
    
    if not song:
        return jsonify({'success': True, 'songs': [], 'source': 'empty'})
    
    query = song.get('artist_name', '') or song.get('genre', '') or song.get('title', '')
    
    try:
        resp = ext_requests.get(
            f"{SAAVN_API_BASE}/search/songs",
            params={'query': query, 'limit': count + 5},
            timeout=60
        )
        data = resp.json()
        if data.get('success'):
            raw_data = data.get('data', {})
            results = raw_data.get('results', []) if isinstance(raw_data, dict) else []
            songs = _dedup_songs([_normalize_song(s, pq) for s in results if isinstance(s, dict)])
            return jsonify({
                'success': True,
                'songs': songs[:count],
                'source': 'jiosaavn_fallback',
                'current_song_id': current_song_id
            })
    except Exception:
        pass
    
    return jsonify({'success': True, 'songs': [], 'source': 'empty'})
