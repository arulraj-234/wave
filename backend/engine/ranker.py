"""
ranker.py — Candidate Ranking, Diversity, and Cold Start (v2 — Production Engine)

The final stage of the recommendation pipeline. Takes candidates from all
three engines (content-based, collaborative, session-based) and produces
a ranked, diverse list of recommendations.

v2 Improvements over v1:
  - Smooth cold-start → hybrid blend (no hard 5-stream cliff)
  - Temporal decay: recent streams dominate over stale history
  - Completion ratio: fully-listened songs are stronger positive signals
  - Onboarding preference decay as implicit history grows
  - Soft skip penalties instead of binary exclusion
  - Dynamic per-user engine blend weights
  - Cloud boost from top-3 weighted tracks instead of 1
"""

import math
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from db import fetch_all, fetch_one
from engine import cache as rec_cache
from engine.features import get_similar_songs, get_all_song_metadata, get_similar_by_attributes
from engine.collaborative import get_collaborative_recs
from engine.session import get_next_songs, get_session_context
import requests
from config import Config

SAAVN_API_BASE = Config.SAAVN_API_URL.rstrip('/')

# Diversity rules
MAX_SONGS_PER_ARTIST = 3
MIN_GENRES_IN_RESULT = 2

# ─── Temporal Decay & Completion Ratio ──────────────────────────────────────

DECAY_HALFLIFE_DAYS = 30  # e^(-days/30)


def _get_weighted_stream_history(user_id):
    """
    Get the user's full stream history with temporal decay and completion ratio.
    Each stream is weighted by: completion_ratio * exp(-days_ago / 30)

    Returns list of dicts: [{ song_id, weight, days_ago, completion }, ...]
    """
    rows = fetch_all("""
        SELECT st.song_id, st.listen_duration, s.duration AS song_duration,
               DATEDIFF(NOW(), st.streamed_at) AS days_ago
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        WHERE st.user_id = %s
        ORDER BY st.streamed_at DESC
    """, (user_id,))

    weighted = []
    for r in rows:
        days_ago = float(r.get('days_ago') or 0)
        listen_dur = float(r.get('listen_duration') or 0)
        song_dur = float(r.get('song_duration') or 1)

        # Completion ratio: how much of the song the user actually heard
        completion = min(listen_dur / max(song_dur, 1.0), 1.0)

        # Temporal decay: recent streams dominate
        time_decay = math.exp(-days_ago / DECAY_HALFLIFE_DAYS)

        # Combined weight
        weight = completion * time_decay

        weighted.append({
            'song_id': r['song_id'],
            'weight': weight,
            'days_ago': days_ago,
            'completion': completion
        })

    return weighted


def _get_recently_played(user_id, hours=24):
    """Get song IDs the user played in the last N hours."""
    rows = fetch_all("""
        SELECT DISTINCT song_id FROM streams 
        WHERE user_id = %s AND streamed_at >= DATE_SUB(NOW(), INTERVAL %s HOUR)
    """, (user_id, hours))
    return set(r['song_id'] for r in rows)


# ─── Soft Skip Penalties ────────────────────────────────────────────────────

def _get_skip_penalties(user_id):
    """
    Compute a soft skip penalty per song instead of binary exclusion.
    
    recent_skips (last 24h): -0.5 per skip
    older_skips  (last 7d):  -0.15 per skip
    Capped at -0.9 so no song is completely killed by skips alone.
    """
    rows = fetch_all("""
        SELECT song_id,
               SUM(CASE WHEN skipped_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 ELSE 0 END) AS very_recent,
               SUM(CASE WHEN skipped_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                        AND skipped_at < DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 ELSE 0 END) AS older
        FROM song_skips
        WHERE user_id = %s AND skipped_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY song_id
    """, (user_id,))

    penalties = {}
    for r in rows:
        very_recent = float(r.get('very_recent') or 0)
        older = float(r.get('older') or 0)
        penalty = (very_recent * 0.5) + (older * 0.15)
        penalties[r['song_id']] = min(penalty, 0.9)

    return penalties


# ─── Dynamic Taste Profile with Temporal Decay ──────────────────────────────

def get_dynamic_taste_profile(user_id):
    """
    Build a taste profile from the user's preferences and listening history.
    
    v2: Uses temporal decay + completion ratio to weight implicit signals.
    Cached for 10 minutes.
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

    # Enrich from streaming history with TEMPORAL DECAY + COMPLETION RATIO
    stream_genres = fetch_all("""
        SELECT s.genre,
               SUM(
                   LEAST(st.listen_duration / GREATEST(s.duration, 1), 1.0) *
                   EXP(-DATEDIFF(NOW(), st.streamed_at) / 30)
               ) AS weighted_cnt
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        WHERE st.user_id = %s AND s.genre IS NOT NULL AND s.genre != '' AND s.genre != 'Unknown'
        GROUP BY s.genre ORDER BY weighted_cnt DESC LIMIT 5
    """, (user_id,))
    for g in stream_genres:
        if g['genre'] not in profile['genres']:
            profile['genres'].append(g['genre'])

    stream_artists = fetch_all("""
        SELECT u.username AS artist_name,
               SUM(
                   LEAST(st.listen_duration / GREATEST(s.duration, 1), 1.0) *
                   EXP(-DATEDIFF(NOW(), st.streamed_at) / 30)
               ) AS weighted_cnt
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        JOIN song_artists sa ON s.song_id = sa.song_id
        JOIN artist_profiles ap ON sa.artist_id = ap.artist_id
        JOIN users u ON ap.user_id = u.user_id
        WHERE st.user_id = %s AND sa.is_primary = 1
        GROUP BY u.username ORDER BY weighted_cnt DESC LIMIT 8
    """, (user_id,))
    for a in stream_artists:
        name = a['artist_name']
        if name and not name.endswith('@wave.local') and name not in profile['artists']:
            profile['artists'].append(name)

    # Cache for 10 minutes (responsive but efficient)
    try:
        rec_cache.set(cache_key, profile, ttl_seconds=600)
    except: pass

    return profile


# ─── Dynamic Blend Weights ──────────────────────────────────────────────────

def _compute_user_blend_weights(user_id):
    """
    Compute dynamic engine blend weights based on user listening behaviour.
    
    Metrics:
      repeat_rate: streams of already-heard songs / total (last 30 days)
      avg_session: average distinct songs per session (last 30 days)
      
    High repeat_rate (>0.7) → comfort listener → boost content-based
    Low repeat_rate (<0.3)  → explorer → boost collaborative
    Long sessions (>15)     → boost Markov (sequential predictions matter)
    Short sessions (<5)     → reduce Markov
    
    Cached for 30 minutes.
    """
    cache_key = f"blend_weights_{user_id}"
    cached = rec_cache.get(cache_key)
    if cached is not None:
        return cached

    # Base weights
    cb, cf, mk = 0.40, 0.35, 0.25

    try:
        # Repeat rate: what fraction of streams are replays?
        repeat_data = fetch_one("""
            SELECT COUNT(*) AS total_streams,
                   COUNT(*) - COUNT(DISTINCT song_id) AS repeat_streams
            FROM streams
            WHERE user_id = %s AND streamed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        """, (user_id,))

        total = float((repeat_data or {}).get('total_streams') or 0)
        repeats = float((repeat_data or {}).get('repeat_streams') or 0)
        repeat_rate = repeats / max(total, 1.0)

        # Session depth: avg songs per session (30-min gap = new session)
        session_rows = fetch_all("""
            SELECT streamed_at FROM streams
            WHERE user_id = %s AND streamed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            ORDER BY streamed_at ASC
        """, (user_id,))

        if session_rows and len(session_rows) >= 2:
            sessions = 1
            songs_in_session = 1
            total_songs = 1
            prev_time = session_rows[0]['streamed_at']

            for row in session_rows[1:]:
                curr_time = row['streamed_at']
                try:
                    gap = (curr_time - prev_time).total_seconds()
                except (TypeError, AttributeError):
                    gap = 9999
                if gap > 1800:  # 30-min gap = new session
                    sessions += 1
                total_songs += 1
                prev_time = curr_time

            avg_session = total_songs / max(sessions, 1)
        else:
            avg_session = total

        # Apply adjustments
        if repeat_rate > 0.7:
            cb += 0.15; cf -= 0.10; mk -= 0.05
        elif repeat_rate < 0.3:
            cb -= 0.10; cf += 0.15; mk -= 0.05

        if avg_session > 15:
            mk += 0.10; cb -= 0.05; cf -= 0.05
        elif avg_session < 5:
            mk -= 0.08; cb += 0.04; cf += 0.04

        # Normalize so weights sum to 1.0
        total_w = cb + cf + mk
        if total_w > 0:
            cb /= total_w
            cf /= total_w
            mk /= total_w

    except Exception as e:
        print(f"[Ranker] Dynamic weight computation failed, using defaults: {e}")
        cb, cf, mk = 0.40, 0.35, 0.25

    weights = {'content': cb, 'collaborative': cf, 'session': mk}
    rec_cache.set(cache_key, weights, ttl_seconds=1800)  # 30 min

    return weights


# ─── Diversity Enforcement ──────────────────────────────────────────────────

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


# ─── Cloud Recommendations ──────────────────────────────────────────────────

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


def _cloud_boost_top3(user_id, all_meta):
    """
    Cloud boost from top-3 most-engaged tracks in the past 7 days.
    
    Instead of using just the single most recent stream (noisy),
    we pick the 3 highest weighted tracks (completion_ratio × recency_decay)
    from the last week and fire JioSaavn Radio for all 3 in parallel.
    """
    rows = fetch_all("""
        SELECT st.song_id, s.saavn_id,
               st.listen_duration, s.duration AS song_duration,
               DATEDIFF(NOW(), st.streamed_at) AS days_ago
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        WHERE st.user_id = %s 
          AND st.streamed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
          AND s.saavn_id IS NOT NULL AND s.saavn_id != ''
    """, (user_id,))

    if not rows:
        return []

    # Score each stream and pick top 3 unique saavn_ids
    scored = []
    seen_saavn = set()
    for r in rows:
        saavn_id = r.get('saavn_id')
        if not saavn_id or saavn_id in seen_saavn:
            continue

        days_ago = float(r.get('days_ago') or 0)
        listen_dur = float(r.get('listen_duration') or 0)
        song_dur = float(r.get('song_duration') or 1)
        completion = min(listen_dur / max(song_dur, 1.0), 1.0)
        weight = completion * math.exp(-days_ago / 7.0)  # Faster decay for cloud selection

        scored.append((saavn_id, weight))
        seen_saavn.add(saavn_id)

    scored.sort(key=lambda x: x[1], reverse=True)
    top3_ids = [sid for sid, _ in scored[:3]]

    if not top3_ids:
        return []

    # Parallel cloud fetch for all 3 tracks
    all_cloud = []
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = {executor.submit(get_cloud_recommendations, sid, 10): sid for sid in top3_ids}
        for future in as_completed(futures):
            try:
                recs = future.result()
                all_cloud.extend(recs)
            except Exception:
                pass

    # Deduplicate by saavn_id
    seen = set()
    deduped = []
    for cr in all_cloud:
        csid = cr.get('saavn_id') or cr.get('song_id')
        if csid and csid not in seen:
            seen.add(csid)
            deduped.append(cr)

    return deduped


# ─── Onboarding Decay ───────────────────────────────────────────────────────

def _get_onboarding_multiplier(total_streams):
    """
    Fade onboarding weight with usage so implicit history dominates.
    """
    if total_streams < 10:
        return 1.0
    elif total_streams < 30:
        return 0.6
    elif total_streams < 60:
        return 0.25
    else:
        return 0.05


# ─── Main Recommendation Functions ──────────────────────────────────────────

def get_home_recommendations(user_id, count=15):
    """
    Generate blended recommendations for a user's home feed.
    
    v2 Pipeline:
    1. Compute stream count → smooth cold/hybrid blend weights
    2. Run both cold-start AND hybrid engines
    3. Blend scores proportionally (no hard cliff)
    4. Apply soft skip penalties
    5. Enforce diversity
    6. Return top N with metadata
    """
    profile = get_dynamic_taste_profile(user_id)

    # Check stream count
    stream_count_row = fetch_one(
        "SELECT COUNT(*) as cnt FROM streams WHERE user_id = %s", (user_id,)
    )
    total_streams = stream_count_row['cnt'] if stream_count_row else 0

    all_meta = get_all_song_metadata()

    # ── Smooth cold → hybrid blend (no cliff) ──
    # At 0 streams:  100% cold, 0% hybrid
    # At 8 streams:  ~47% cold, ~53% hybrid
    # At 15 streams: 0% cold, 100% hybrid
    cold_weight = max(0.0, 1.0 - (total_streams / 15.0))
    hybrid_weight = 1.0 - cold_weight

    cold_results = {}   # { song_id: score }
    hybrid_results = {}  # { song_id: score }

    # ── Always run cold-start scoring (weighted by cold_weight) ──
    if cold_weight > 0.01:
        cold_results = _cold_start_scores(user_id, total_streams, all_meta)

    # ── Run hybrid engine once user has some history ──
    if hybrid_weight > 0.01 and total_streams >= 3:
        hybrid_results = _hybrid_scores(user_id, total_streams, all_meta)

    # ── Merge: multiply by blend weights, deduplicate keeping higher score ──
    candidates = defaultdict(float)
    for sid, score in cold_results.items():
        candidates[sid] += score * cold_weight
    for sid, score in hybrid_results.items():
        candidates[sid] += score * hybrid_weight

    # ── Cloud boost from top-3 engaged tracks ──
    if total_streams >= 3:
        cloud_recs = _cloud_boost_top3(user_id, all_meta)
        for cr in cloud_recs:
            csid = cr.get('saavn_id') or cr.get('song_id')
            if csid:
                candidates[csid] += 0.6

    # ── Apply soft skip penalties ──
    skip_penalties = _get_skip_penalties(user_id)
    for sid in list(candidates.keys()):
        penalty = skip_penalties.get(sid, 0)
        if penalty > 0:
            candidates[sid] -= penalty

    # ── Filter recently played & low-score candidates ──
    recently_played = _get_recently_played(user_id, 24)

    # Get seed IDs to exclude
    liked = fetch_all(
        "SELECT song_id FROM user_liked_songs WHERE user_id = %s", (user_id,)
    )
    liked_ids = set(r['song_id'] for r in liked)
    recent = fetch_all("""
        SELECT DISTINCT song_id FROM streams 
        WHERE user_id = %s ORDER BY streamed_at DESC LIMIT 10
    """, (user_id,))
    seed_ids = liked_ids | set(r['song_id'] for r in recent)
    exclude_ids = recently_played | seed_ids

    filtered = [
        (sid, score) for sid, score in candidates.items()
        if sid not in exclude_ids and score >= 0.05  # Soft skip threshold
    ]
    filtered.sort(key=lambda x: x[1], reverse=True)

    # Apply diversity rules
    diverse = _enforce_diversity(filtered, all_meta)

    # Build response with full metadata
    result = []
    for song_id, score in diverse[:count]:
        meta = all_meta.get(song_id)
        if meta:
            meta['rec_score'] = round(score, 4)
            result.append(meta)

    # CRITICAL FALLBACK: If we still have nothing, fetch cloud trending in user language
    if not result:
        try:
            langs = ",".join(profile.get('languages', ['hindi']))
            url = f"{SAAVN_API_BASE}/search/songs"
            resp = requests.get(url, params={'query': 'trending', 'languages': langs, 'limit': count}, timeout=5)
            data = resp.json()
            if data.get('success'):
                from routes.jiosaavn import _normalize_song
                result = [_normalize_song(s) for s in data.get('data', {}).get('results', [])[:count]]
        except:
            pass

    return result


def _cold_start_scores(user_id, total_streams, all_meta):
    """
    Score songs for cold-start users using onboarding preferences
    with decay applied based on stream count.
    
    Returns: { song_id: score }
    """
    profile = get_dynamic_taste_profile(user_id)
    onboarding_mult = _get_onboarding_multiplier(total_streams)

    if not all_meta:
        return {}

    scored = {}
    for sid, meta in all_meta.items():
        score = 0.0

        # Genre match (decayed by onboarding multiplier)
        if meta.get('genre') and meta['genre'] in profile['genres']:
            score += 0.5 * onboarding_mult

        # Language match
        if meta.get('language') and meta['language'] in profile['languages']:
            score += 0.3 * onboarding_mult

        # Artist match (strongest signal)
        if meta.get('artist_name') and meta['artist_name'] in profile['artists']:
            score += 0.7 * onboarding_mult

        # Small popularity boost to surface quality content
        pop = math.log1p(float(meta.get('play_count', 0)))
        score += min(pop * 0.05, 0.3)

        if score > 0:
            scored[sid] = score

    return scored


def _hybrid_scores(user_id, total_streams, all_meta):
    """
    Full hybrid engine scoring using content-based, collaborative,
    and session-based engines with dynamic per-user weights and
    weighted stream history.
    
    Returns: { song_id: score }
    """
    # Dynamic weights per user profile
    weights = _compute_user_blend_weights(user_id)

    candidates = defaultdict(float)

    # Get weighted stream history for content-based seeding
    weighted_history = _get_weighted_stream_history(user_id)

    # 1. Content-based: use top weighted seeds
    liked = fetch_all(
        "SELECT song_id FROM user_liked_songs WHERE user_id = %s", (user_id,)
    )
    liked_ids = [r['song_id'] for r in liked]

    # Use top-weighted streams as seeds (completion × recency)
    top_seeds = sorted(weighted_history, key=lambda x: x['weight'], reverse=True)
    seed_ids = list(set(liked_ids + [s['song_id'] for s in top_seeds[:10]]))

    for seed_id in seed_ids[:10]:
        similar = get_similar_songs(seed_id, top_k=10)
        for other_id, sim_score in similar:
            candidates[other_id] += sim_score * weights['content']

    # 2. Collaborative filtering
    collab_recs = get_collaborative_recs(user_id, top_k=20)
    for song_id, collab_score in collab_recs:
        candidates[song_id] += collab_score * weights['collaborative']

    # 3. Session-based: boost songs that follow the user's current session
    session = get_session_context(user_id, lookback_minutes=30)
    if session:
        current_song_id = session[0]['song_id']
        next_songs = get_next_songs(current_song_id, top_k=10)
        for song_id, prob in next_songs:
            candidates[song_id] += prob * weights['session']

    return dict(candidates)


# ─── Queue Predictions ──────────────────────────────────────────────────────

def get_queue_predictions(user_id, current_song_id, count=10):
    """
    Predict the next songs for the "Up Next" queue.
    
    Priority:
    1. Markov chain transitions (what usually plays after this song)
    2. Content similarity to current song
    3. Collaborative padding
    4. Cloud suggestions from top-3 engaged tracks
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

    # 4. Cloud Professional Suggestions (top-3 version)
    curr_meta = all_meta.get(current_song_id, {})
    saavn_id = curr_meta.get('saavn_id')
    if saavn_id:
        cloud_recs = get_cloud_recommendations(saavn_id, count=15)
        for rec in cloud_recs:
            sid = rec.get('song_id') or rec.get('saavn_id')
            candidates[sid] += 0.6

    # Apply soft skip penalties
    if user_id:
        skip_penalties = _get_skip_penalties(user_id)
        for sid in list(candidates.keys()):
            penalty = skip_penalties.get(sid, 0)
            if penalty > 0:
                candidates[sid] -= penalty

    # Filter out current song, recently played, and below-threshold candidates
    recently_played = _get_recently_played(user_id, 2) if user_id else set()
    exclude = recently_played | {current_song_id}

    filtered = [
        (sid, score) for sid, score in candidates.items()
        if sid not in exclude and score >= 0.05
    ]
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
        if saavn_id:
            result = get_cloud_recommendations(saavn_id, count=count)

    # Genre-Locked Fallback: If still empty
    if not result:
        curr_meta = all_meta.get(current_song_id, {})
        genre = curr_meta.get('genre', 'pop')
        try:
            url = f"{SAAVN_API_BASE}/search/songs"
            resp = requests.get(url, params={'query': f"{genre} trending", 'limit': count}, timeout=5)
            if resp.status_code == 200:
                from routes.jiosaavn import _normalize_song
                result = [_normalize_song(s) for s in resp.json().get('data', {}).get('results', [])]
        except:
            pass

    return result


# ─── Playlist Generation ────────────────────────────────────────────────────

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
