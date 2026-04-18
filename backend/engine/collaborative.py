"""
collaborative.py — Item-Item Collaborative Filtering

Builds a co-occurrence matrix: "users who played song A also played song B".
Uses Jaccard similarity to normalize by popularity, preventing globally popular
songs from dominating every user's recommendations.

Source data: streams table grouped by user_id.
"""

from collections import defaultdict
from db import fetch_all
from engine import cache as rec_cache


def build_cooccurrence_matrix():
    """
    Build the item-item co-occurrence matrix from user streaming history.
    
    For each pair of songs (A, B), counts how many unique users played both.
    Normalizes using Jaccard: |A ∩ B| / |A ∪ B| to penalize globally popular songs.
    
    Stores in cache: { song_id: [(other_song_id, jaccard_score), ...] }
    """
    # Get all user-song pairs (only count users with at least 2 unique songs streamed)
    streams = fetch_all("""
        SELECT DISTINCT user_id, song_id 
        FROM streams 
        WHERE user_id IS NOT NULL
        ORDER BY user_id
    """)
    
    if not streams:
        rec_cache.set('collab_matrix', {}, ttl_seconds=3600)
        print("[RecEngine] Collaborative matrix: no stream data available")
        return
    
    # Group songs by user: { user_id: set(song_ids) }
    user_songs = defaultdict(set)
    for row in streams:
        user_songs[row['user_id']].add(row['song_id'])
    
    # Filter users with < 2 songs (no co-occurrence signal)
    user_songs = {uid: songs for uid, songs in user_songs.items() if len(songs) >= 2}
    
    if not user_songs:
        rec_cache.set('collab_matrix', {}, ttl_seconds=3600)
        print("[RecEngine] Collaborative matrix: insufficient user overlap")
        return
    
    # Build co-occurrence counts: { (song_a, song_b): count_of_shared_users }
    cooccurrence = defaultdict(int)
    song_user_counts = defaultdict(int)  # How many users played each song
    
    for uid, songs in user_songs.items():
        song_list = list(songs)
        for sid in song_list:
            song_user_counts[sid] += 1
        
        # Count co-occurrences for all pairs within this user's history
        for i in range(len(song_list)):
            for j in range(i + 1, len(song_list)):
                pair = tuple(sorted([song_list[i], song_list[j]]))
                cooccurrence[pair] += 1
    
    # Compute Jaccard similarity for each pair
    # Jaccard(A,B) = |users who played both| / |users who played A or B|
    similarity = defaultdict(list)
    
    for (song_a, song_b), shared_count in cooccurrence.items():
        union_count = song_user_counts[song_a] + song_user_counts[song_b] - shared_count
        if union_count == 0:
            continue
        jaccard = shared_count / union_count
        
        if jaccard > 0.01:  # Skip negligible similarities
            similarity[song_a].append((song_b, jaccard))
            similarity[song_b].append((song_a, jaccard))
    
    # Sort each song's similar list by score descending
    for sid in similarity:
        similarity[sid].sort(key=lambda x: x[1], reverse=True)
        similarity[sid] = similarity[sid][:30]  # Keep top 30
    
    rec_cache.set('collab_matrix', dict(similarity), ttl_seconds=3600)  # 1 hour
    
    total_pairs = sum(len(v) for v in similarity.values()) // 2
    print(f"[RecEngine] Collaborative matrix built: {len(similarity)} songs, "
          f"{total_pairs} co-occurrence pairs from {len(user_songs)} users")


def get_collaborative_recs(user_id, top_k=20):
    """
    Get collaborative recommendations for a user.
    
    Strategy:
    1. Find all songs the user has played
    2. For each played song, get co-occurring songs
    3. Aggregate scores across all played songs
    4. Exclude songs the user already played
    5. Return top_k scoring songs
    """
    collab = rec_cache.get('collab_matrix')
    if collab is None:
        build_cooccurrence_matrix()
        collab = rec_cache.get('collab_matrix') or {}
    
    if not collab:
        return []
    
    # Get user's play history
    user_streams = fetch_all(
        "SELECT DISTINCT song_id FROM streams WHERE user_id = %s",
        (user_id,)
    )
    played_ids = set(row['song_id'] for row in user_streams)
    
    if not played_ids:
        return []
    
    # Aggregate co-occurrence scores from all played songs
    candidate_scores = defaultdict(float)
    for played_id in played_ids:
        similar = collab.get(played_id, [])
        for other_id, score in similar:
            if other_id not in played_ids:  # Don't recommend already-played
                candidate_scores[other_id] += score
    
    # Sort by aggregate score
    ranked = sorted(candidate_scores.items(), key=lambda x: x[1], reverse=True)
    return ranked[:top_k]


def get_users_who_played(song_id):
    """Get the set of user IDs who have played a specific song."""
    rows = fetch_all(
        "SELECT DISTINCT user_id FROM streams WHERE song_id = %s AND user_id IS NOT NULL",
        (song_id,)
    )
    return set(row['user_id'] for row in rows)
