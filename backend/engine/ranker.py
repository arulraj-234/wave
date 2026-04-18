"""
ranker.py — Candidate Ranking, Diversity, and Cold Start

The final stage of the recommendation pipeline. Takes candidates from all
three engines (content-based, collaborative, session-based) and produces
a ranked, diverse list of recommendations.

Responsibilities:
  - Blend candidates from multiple engines with configurable weights
  - Enforce diversity rules (max N songs per artist, genre variety)
  - Filter out recently played and skipped songs
  - Handle cold-start users (< 5 streams) with graceful fallbacks
"""

from collections import defaultdict
from db import fetch_all, fetch_one
from engine import cache as rec_cache
from engine.features import get_similar_songs, get_all_song_metadata, get_similar_by_attributes
from engine.collaborative import get_collaborative_recs
from engine.session import get_next_songs, get_session_context
import requests
from config import Config

SAAVN_API_BASE = Config.SAAVN_API_URL.rstrip('/')


# Engine weights for blending
WEIGHTS = {
    'content': 0.40,
    'collaborative': 0.35,
    'session': 0.25
}

# Diversity rules
MAX_SONGS_PER_ARTIST = 3
MIN_GENRES_IN_RESULT = 2
RECENTLY_PLAYED_PENALTY_HOURS = 24
SKIP_PENALTY_HOURS = 48


def _get_recently_played(user_id, hours=24):
    """Get song IDs the user played in the last N hours."""
    rows = fetch_all("""
        SELECT DISTINCT song_id FROM streams 
        WHERE user_id = %s AND streamed_at >= DATE_SUB(NOW(), INTERVAL %s HOUR)
    """, (user_id, hours))
    return set(r['song_id'] for r in rows)


def _get_recently_skipped(user_id, hours=48):
    """Get song IDs the user skipped in the last N hours."""
    rows = fetch_all("""
        SELECT DISTINCT song_id FROM song_skips 
        WHERE user_id = %s AND skipped_at >= DATE_SUB(NOW(), INTERVAL %s HOUR)
    """, (user_id, hours))
    return set(r['song_id'] for r in rows)


def get_dynamic_taste_profile(user_id):
    """
    Build a taste profile from the user's preferences and listening history.
    Heavily cached (6 hours) to prevent expensive GROUP BY queries on every page load.
    Returns: { 'genres': [...], 'languages': [...], 'artists': [...] }
    """
    if not user_id:
        return {'genres': [], 'languages': [], 'artists': []}
        
    cache_key = f"taste_profile_{user_id}"
    cached = rec_cache.get(cache_key)
    if cached is not None:
        return cached
        
    profile = {'genres': [], 'languages': [], 'artists': []}
    
    # Explicit onboarding preferences
    prefs = fetch_all(
        "SELECT preference_type, preference_value FROM user_preferences WHERE user_id = %s",
        (user_id,)
    )
    for p in prefs:
        if p['preference_type'] == 'genre':
            profile['genres'].append(p['preference_value'])
        elif p['preference_type'] == 'language':
            profile['languages'].append(p['preference_value'])
        elif p['preference_type'] == 'artist':
            profile['artists'].append(p['preference_value'])
    
    # Enrich from streaming history (implicit signals)
    stream_genres = fetch_all("""
        SELECT s.genre, COUNT(*) AS cnt
        FROM streams st JOIN songs s ON st.song_id = s.song_id
        WHERE st.user_id = %s AND s.genre IS NOT NULL AND s.genre != '' AND s.genre != 'Unknown'
        GROUP BY s.genre ORDER BY cnt DESC LIMIT 5
    """, (user_id,))
    for g in stream_genres:
        if g['genre'] not in profile['genres']:
            profile['genres'].append(g['genre'])
    
    stream_artists = fetch_all("""
        SELECT u.username AS artist_name, COUNT(*) AS cnt
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        JOIN artist_profiles ap ON s.artist_id = ap.artist_id
        JOIN users u ON ap.user_id = u.user_id
        WHERE st.user_id = %s
        GROUP BY u.username ORDER BY cnt DESC LIMIT 8
    """, (user_id,))
    for a in stream_artists:
        name = a['artist_name']
        if name and not name.endswith('@wave.local') and name not in profile['artists']:
            profile['artists'].append(name)
            
    # Cache for 6 hours
    rec_cache.set(cache_key, profile, ttl_seconds=21600)
    
    return profile


def _enforce_diversity(songs, all_meta):
    """
    Apply diversity rules to a ranked list of song IDs.
    - Max MAX_SONGS_PER_ARTIST songs from the same artist
    - Try to maintain at least MIN_GENRES_IN_RESULT different genres
    """
    artist_counts = defaultdict(int)
    genre_set = set()
    result = []
    deferred = []  # Songs we skipped for diversity, may add later
    
    for song_id, score in songs:
        meta = all_meta.get(song_id, {})
        artist_id = meta.get('artist_id', 0)
        genre = meta.get('genre', 'Unknown')
        
        if artist_counts[artist_id] >= MAX_SONGS_PER_ARTIST:
            deferred.append((song_id, score))
            continue
        
        artist_counts[artist_id] += 1
        genre_set.add(genre)
        result.append((song_id, score))
    
    # If we don't have enough genre diversity, try to inject from deferred
    if len(genre_set) < MIN_GENRES_IN_RESULT and deferred:
        existing_genres = genre_set.copy()
        for song_id, score in deferred:
            meta = all_meta.get(song_id, {})
            genre = meta.get('genre', 'Unknown')
            if genre not in existing_genres:
                result.append((song_id, score))
                existing_genres.add(genre)
                if len(existing_genres) >= MIN_GENRES_IN_RESULT:
                    break
    
    return result


def get_cloud_recommendations(saavn_id, count=15):
    """
    Fetch recommendations directly from JioSaavn Cloud API (Radio/Suggestions).
    Used as high-priority signal for "Straight to Cloud" UX.
    """
    if not saavn_id: return []
    try:
        url = f"{SAAVN_API_BASE}/songs/{saavn_id}/suggestions"
        resp = requests.get(url, params={'limit': count}, timeout=10)
        data = resp.json()
        if data.get('success'):
            raw = data.get('data', [])
            # Map JioSaavn format to our internal metadata format (simplified)
            from routes.jiosaavn import _normalize_song
            return [_normalize_song(s) for s in raw if isinstance(s, dict)]
    except Exception as e:
        print(f"[Ranker] Cloud fetch failed: {e}")
    return []


def get_home_recommendations(user_id, count=15):
    """
    Generate blended recommendations for a user's home feed.
    
    Pipeline:
    1. Check if user is a cold-start case (< 5 streams)
    2. Generate candidates from all engines
    3. Blend scores with weights
    4. Filter recently played/skipped
    5. Enforce diversity
    6. Return top N with metadata
    """
    profile = get_dynamic_taste_profile(user_id)
    
    # Check stream count
    stream_count = fetch_one(
        "SELECT COUNT(*) as cnt FROM streams WHERE user_id = %s", (user_id,)
    )
    total_streams = stream_count['cnt'] if stream_count else 0
    
    all_meta = get_all_song_metadata()
    
    if total_streams < 5:
        # Cold start — use taste profile to find matching songs
        return _cold_start_recommendations(user_id, count, all_meta)
    
    # Generate candidates from each engine
    candidates = defaultdict(float)
    
    # 1. Content-based: find songs similar to what the user has liked/played
    liked = fetch_all(
        "SELECT song_id FROM user_liked_songs WHERE user_id = %s", (user_id,)
    )
    liked_ids = [r['song_id'] for r in liked]
    
    # Also use recent streams as seed
    recent = fetch_all("""
        SELECT DISTINCT song_id FROM streams 
        WHERE user_id = %s ORDER BY streamed_at DESC LIMIT 10
    """, (user_id,))
    seed_ids = list(set(liked_ids + [r['song_id'] for r in recent]))
    
    for seed_id in seed_ids[:10]:  # Cap to prevent slow computation
        similar = get_similar_songs(seed_id, top_k=10)
        for other_id, sim_score in similar:
            candidates[other_id] += sim_score * WEIGHTS['content']
    
    # 2. Collaborative filtering
    collab_recs = get_collaborative_recs(user_id, top_k=20)
    for song_id, collab_score in collab_recs:
        candidates[song_id] += collab_score * WEIGHTS['collaborative']
    
    # 3. Session-based: boost songs that follow the user's current session
    session = get_session_context(user_id, lookback_minutes=30)
    if session:
        current_song_id = session[0]['song_id']
        next_songs = get_next_songs(current_song_id, top_k=10)
        for song_id, prob in next_songs:
            candidates[song_id] += prob * WEIGHTS['session']
    
    # 4. Cloud Boost (Direct from JioSaavn Radio)
    # If the user has a recent song, get cloud suggestions for it
    if recent:
        top_recent_saavn_ids = []
        for r in recent[:2]:
            meta = all_meta.get(r['song_id'], {})
            if meta.get('saavn_id'): top_recent_saavn_ids.append(meta['saavn_id'])
            
        for sid in top_recent_saavn_ids:
            cloud_recs = get_cloud_recommendations(sid, count=10)
            for cr in cloud_recs:
                csid = cr.get('saavn_id') or cr.get('song_id')
                if csid: candidates[csid] += 0.6  # High weight for Cloud suggestions
    
    # Filter out recently played and skipped
    recently_played = _get_recently_played(user_id, RECENTLY_PLAYED_PENALTY_HOURS)
    recently_skipped = _get_recently_skipped(user_id, SKIP_PENALTY_HOURS)
    exclude_ids = recently_played | recently_skipped
    
    # Also exclude the seed songs themselves
    exclude_ids.update(seed_ids)
    
    filtered = [(sid, score) for sid, score in candidates.items() if sid not in exclude_ids]
    filtered.sort(key=lambda x: x[1], reverse=True)
    
    # Apply diversity rules
    diverse = _enforce_diversity(filtered, all_meta)
    
    # Build response with full metadata
    result = []
    for song_id, score in diverse[:count]:
        meta = all_meta.get(song_id)
        if not meta and isinstance(song_id, str):
             # Handle case where song_id might be a pure saavn_id from cloud boost
             # We should probably have a better way to resolve this, but for now:
             # If we don't have it in all_meta, it came straight from the cloud.
             # We'll need to fetch its metadata if it's not already in the cloud_recs map.
             pass
        if meta:
            meta['rec_score'] = round(score, 4)
            result.append(meta)
            
    # CRITICAL FALLBACK: If we still have nothing, fetch cloud trending in user language
    if not result:
        try:
             langs = ",".join(profile.get('languages', ['hindi']))
             url = f"{SAAVN_API_BASE}/search/songs"
             # Use localized trending for a "Smart" fallback
             resp = requests.get(url, params={'query': 'trending', 'languages': langs, 'limit': count}, timeout=5)
             data = resp.json()
             if data.get('success'):
                 from routes.jiosaavn import _normalize_song
                 result = [_normalize_song(s) for s in data.get('data', {}).get('results', [])[:count]]
        except: pass
    
    return result


def _cold_start_recommendations(user_id, count, all_meta):
    """
    Recommendations for users with very little listening history.
    Uses onboarding preferences and global popularity as signals.
    """
    profile = get_dynamic_taste_profile(user_id)
    
    if not all_meta:
        return []
    
    scored = []
    for sid, meta in all_meta.items():
        score = 0.0
        
        # Genre match
        if meta.get('genre') and meta['genre'] in profile['genres']:
            score += 0.5
        
        # Language match
        if meta.get('language') and meta['language'] in profile['languages']:
            score += 0.3
        
        # Artist match
        if meta.get('artist_name') and meta['artist_name'] in profile['artists']:
            score += 0.7
        
        # Small popularity boost to surface quality content
        import math
        pop = math.log1p(meta.get('play_count', 0))
        score += min(pop * 0.05, 0.3)
        
        if score > 0:
            scored.append((sid, score))
    
    scored.sort(key=lambda x: x[1], reverse=True)
    
    # Apply diversity
    diverse = _enforce_diversity(scored, all_meta)
    
    result = []
    for song_id, score in diverse[:count]:
        meta = all_meta.get(song_id, {})
        if meta:
            meta['rec_score'] = round(score, 4)
            result.append(meta)
    
    return result


def get_queue_predictions(user_id, current_song_id, count=10):
    """
    Predict the next songs for the "Up Next" queue.
    
    Priority:
    1. Markov chain transitions (what usually plays after this song)
    2. Content similarity to current song
    3. Collaborative padding
    """
    all_meta = get_all_song_metadata()
    candidates = defaultdict(float)
    
    # 1. Markov transitions (strongest signal for queue)
    markov = get_next_songs(current_song_id, top_k=15)
    for song_id, prob in markov:
        candidates[song_id] += prob * 0.5
    
    # 2. Content similarity to current song
    similar = get_similar_songs(current_song_id, top_k=15)
    for song_id, sim_score in similar:
        candidates[song_id] += sim_score * 0.35
    
    # 3. Collaborative padding
    if user_id:
        collab = get_collaborative_recs(user_id, top_k=10)
        for song_id, collab_score in collab:
            candidates[song_id] += collab_score * 0.15
    
    # Filter out current song and recently played
    recently_played = _get_recently_played(user_id, 2) if user_id else set()
    exclude = recently_played | {current_song_id}
    
    filtered = [(sid, score) for sid, score in candidates.items() if sid not in exclude]
    filtered.sort(key=lambda x: x[1], reverse=True)
    
    # Apply light diversity
    diverse = _enforce_diversity(filtered, all_meta)
    
    result = []
    for song_id, score in diverse[:count]:
        meta = all_meta.get(song_id, {})
        if meta:
            meta['rec_score'] = round(score, 4)
            result.append(meta)
    
    # FALLBACK: If still empty, fetch Cloud-Radio for this specific song
    if not result:
        # Get saavn_id for current_song
        curr_meta = all_meta.get(current_song_id, {})
        saavn_id = curr_meta.get('saavn_id')
        if saavn_id:
            result = get_cloud_recommendations(saavn_id, count=count)
            
    # Genre-Locked Fallback: If still empty or mood-consistent check failed
    if not result:
        curr_meta = all_meta.get(current_song_id, {})
        genre = curr_meta.get('genre', 'pop')
        try:
             url = f"{SAAVN_API_BASE}/search/songs"
             resp = requests.get(url, params={'query': f"{genre} trending", 'limit': count}, timeout=5)
             if resp.status_code == 200:
                  from routes.jiosaavn import _normalize_song
                  result = [_normalize_song(s) for s in resp.json().get('data', {}).get('results', [])]
        except: pass
            
    return result


def generate_playlist(seed_song_ids, count=20, user_id=None):
    """
    Generate a playlist from seed songs using content similarity.
    
    Strategy:
    1. For each seed, get similar songs
    2. Merge and deduplicate
    3. Optionally boost with collaborative signal if user_id provided
    4. Enforce diversity
    """
    all_meta = get_all_song_metadata()
    candidates = defaultdict(float)
    seed_set = set(seed_song_ids)
    
    for seed_id in seed_song_ids:
        similar = get_similar_songs(seed_id, top_k=count)
        for song_id, sim_score in similar:
            if song_id not in seed_set:
                candidates[song_id] += sim_score
    
    # Optional collaborative boost
    if user_id:
        collab = get_collaborative_recs(user_id, top_k=count)
        for song_id, collab_score in collab:
            if song_id not in seed_set:
                candidates[song_id] += collab_score * 0.3
    
    ranked = sorted(candidates.items(), key=lambda x: x[1], reverse=True)
    diverse = _enforce_diversity(ranked, all_meta)
    
    result = []
    for song_id, score in diverse[:count]:
        meta = all_meta.get(song_id, {})
        if meta:
            meta['rec_score'] = round(score, 4)
            result.append(meta)
    
    return result
