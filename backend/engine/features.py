"""
features.py — Content-Based Filtering Engine

Builds a feature vector for every song in the database and computes
pairwise cosine similarity. Used for "similar songs" and playlist generation.

Feature vector composition:
  - Genre (one-hot encoded)
  - Language (one-hot encoded)
  - Primary artist ID (one-hot encoded)
  - Duration bucket (normalized)
  - Popularity score (log-normalized play_count)

No NumPy dependency — uses pure Python math for portability on Render.
"""

import math
from collections import defaultdict
from db import fetch_all
from engine import cache as rec_cache


def _build_feature_vectors():
    """
    Fetch all songs from DB and build a feature vector for each.
    Returns: { song_id: { 'vector': [...], 'meta': {...} } }
    """
    songs = fetch_all("""
        SELECT s.song_id, s.title, s.genre, s.language, s.duration, s.play_count,
               s.artist_id, s.cover_image_url, s.audio_url, s.saavn_id,
               u.username AS artist_name
        FROM songs s
        LEFT JOIN artist_profiles ap ON s.artist_id = ap.artist_id
        LEFT JOIN users u ON ap.user_id = u.user_id
    """)
    
    if not songs:
        return {}
    
    # Collect all unique genres, languages, and artist_ids for encoding
    all_genres = sorted(set(s.get('genre') or 'Unknown' for s in songs))
    all_languages = sorted(set(s.get('language') or 'Unknown' for s in songs))
    all_artists = sorted(set(s.get('artist_id') or 0 for s in songs))
    
    genre_idx = {g: i for i, g in enumerate(all_genres)}
    lang_idx = {l: i for i, l in enumerate(all_languages)}
    artist_idx = {a: i for i, a in enumerate(all_artists)}
    
    # Max duration for normalization (cap at 600s = 10 min)
    max_duration = max(s.get('duration') or 0 for s in songs) or 600
    # Max play_count for log normalization
    max_plays = max(s.get('play_count') or 0 for s in songs) or 1
    
    vectors = {}
    for s in songs:
        song_id = s['song_id']
        
        # One-hot genre
        genre_vec = [0.0] * len(all_genres)
        g = s.get('genre') or 'Unknown'
        if g in genre_idx:
            genre_vec[genre_idx[g]] = 1.0
        
        # One-hot language
        lang_vec = [0.0] * len(all_languages)
        l = s.get('language') or 'Unknown'
        if l in lang_idx:
            lang_vec[lang_idx[l]] = 1.0
        
        # One-hot artist (lighter weight — we want genre/language to dominate)
        artist_vec = [0.0] * len(all_artists)
        a = s.get('artist_id') or 0
        if a in artist_idx:
            artist_vec[artist_idx[a]] = 0.5  # Half weight
        
        # Duration normalized [0, 1]
        dur = min(s.get('duration') or 0, 600) / max_duration
        
        # Popularity: log-normalized play_count [0, 1]
        plays = s.get('play_count') or 0
        pop = math.log1p(plays) / math.log1p(max_plays) if max_plays > 0 else 0
        
        # Combine into single vector
        vector = genre_vec + lang_vec + artist_vec + [dur, pop]
        
        vectors[song_id] = {
            'vector': vector,
            'meta': {
                'song_id': song_id,
                'title': s.get('title', ''),
                'genre': g,
                'language': l,
                'artist_id': a,
                'artist_name': s.get('artist_name', ''),
                'duration': s.get('duration', 0),
                'cover_image_url': s.get('cover_image_url', ''),
                'audio_url': s.get('audio_url', ''),
                'saavn_id': s.get('saavn_id', ''),
                'play_count': plays
            }
        }
    
    return vectors


def _cosine_similarity(vec_a, vec_b):
    """Compute cosine similarity between two vectors. Pure Python, no NumPy."""
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    mag_a = math.sqrt(sum(a * a for a in vec_a))
    mag_b = math.sqrt(sum(b * b for b in vec_b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)


def build_similarity_matrix():
    """
    Precompute pairwise cosine similarity for all songs in the DB.
    Stores in cache as: { song_id: [(other_song_id, score), ...] } sorted desc.
    """
    vectors = _build_feature_vectors()
    if not vectors:
        rec_cache.set('content_similarity', {}, ttl_seconds=1800)
        rec_cache.set('song_vectors', {}, ttl_seconds=1800)
        return
    
    song_ids = list(vectors.keys())
    similarity = {}
    
    for i, sid in enumerate(song_ids):
        scores = []
        for j, other_sid in enumerate(song_ids):
            if sid == other_sid:
                continue
            score = _cosine_similarity(vectors[sid]['vector'], vectors[other_sid]['vector'])
            if score > 0.01:  # Skip near-zero similarities
                scores.append((other_sid, score))
        
        # Sort by similarity descending
        scores.sort(key=lambda x: x[1], reverse=True)
        similarity[sid] = scores[:50]  # Keep top 50 similar songs
    
    # Cache both the matrix and the raw vectors (useful for ranking)
    rec_cache.set('content_similarity', similarity, ttl_seconds=1800)  # 30 min
    rec_cache.set('song_vectors', vectors, ttl_seconds=1800)
    
    print(f"[RecEngine] Content similarity matrix built: {len(song_ids)} songs, "
          f"{sum(len(v) for v in similarity.values())} similarity pairs")


def get_similar_songs(song_id, top_k=20):
    """
    Get the top_k most similar songs to a given song_id.
    Returns list of (song_id, similarity_score) tuples.
    """
    similarity = rec_cache.get('content_similarity')
    if similarity is None:
        build_similarity_matrix()
        similarity = rec_cache.get('content_similarity') or {}
    
    return similarity.get(song_id, [])[:top_k]


def get_similar_by_attributes(genre=None, language=None, artist_name=None, top_k=20):
    """
    Find songs similar to a set of attributes (for JioSaavn songs not in our DB).
    This is the key function for the lazy-import architecture — we can find local
    DB songs that match the taste profile without requiring the target song to be imported.
    """
    vectors = rec_cache.get('song_vectors')
    if vectors is None:
        build_similarity_matrix()
        vectors = rec_cache.get('song_vectors') or {}
    
    if not vectors:
        return []
    
    # Score each song based on attribute matches
    scored = []
    for sid, data in vectors.items():
        meta = data['meta']
        score = 0.0
        
        if genre and meta.get('genre', '').lower() == genre.lower():
            score += 0.5
        if language and meta.get('language', '').lower() == language.lower():
            score += 0.3
        if artist_name and artist_name.lower() in (meta.get('artist_name') or '').lower():
            score += 0.8
        
        if score > 0:
            scored.append((sid, score, meta))
    
    scored.sort(key=lambda x: x[1], reverse=True)
    return scored[:top_k]


def get_all_song_metadata():
    """Return all song metadata from the cached vectors."""
    vectors = rec_cache.get('song_vectors')
    if vectors is None:
        build_similarity_matrix()
        vectors = rec_cache.get('song_vectors') or {}
    return {sid: data['meta'] for sid, data in vectors.items()}
