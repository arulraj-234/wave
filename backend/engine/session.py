"""
session.py — Session-Based Song Sequencing (Markov Chain)

Learns transition probabilities from consecutive streams within user sessions.
A "session" is defined as a sequence of streams from the same user with no
gap exceeding 30 minutes between consecutive plays.

This powers the "Up Next" / queue prediction feature.
"""

from collections import defaultdict
from db import fetch_all
from engine import cache as rec_cache


def build_transition_matrix():
    """
    Build a first-order Markov transition matrix from streaming history.
    
    For each song pair (A → B) where B was played right after A in the same session,
    count the transition frequency. Normalize into probabilities.
    
    Stores in cache: { song_id: [(next_song_id, probability), ...] }
    """
    # Fetch all streams ordered by user and time
    streams = fetch_all("""
        SELECT user_id, song_id, streamed_at
        FROM streams
        WHERE user_id IS NOT NULL
        ORDER BY user_id, streamed_at ASC
    """)
    
    if not streams:
        rec_cache.set('markov_transitions', {}, ttl_seconds=3600)
        print("[RecEngine] Markov transitions: no stream data available")
        return
    
    # Build sessions: group consecutive streams within 30-min windows
    transition_counts = defaultdict(lambda: defaultdict(int))
    
    prev_user = None
    prev_song = None
    prev_time = None
    
    for row in streams:
        user_id = row['user_id']
        song_id = row['song_id']
        streamed_at = row['streamed_at']
        
        # Same user, within 30 minutes = same session
        if user_id == prev_user and prev_time and streamed_at:
            try:
                gap = (streamed_at - prev_time).total_seconds()
            except (TypeError, AttributeError):
                gap = 9999  # Can't compute, treat as session break
            
            if gap <= 1800 and prev_song != song_id:  # 30 min, skip self-loops
                transition_counts[prev_song][song_id] += 1
        
        prev_user = user_id
        prev_song = song_id
        prev_time = streamed_at
    
    # Normalize into probabilities
    transitions = {}
    for from_song, to_songs in transition_counts.items():
        total = sum(to_songs.values())
        if total == 0:
            continue
        
        probs = [(to_id, count / total) for to_id, count in to_songs.items()]
        probs.sort(key=lambda x: x[1], reverse=True)
        transitions[from_song] = probs[:20]  # Keep top 20 transitions
    
    rec_cache.set('markov_transitions', transitions, ttl_seconds=3600)  # 1 hour
    
    total_transitions = sum(len(v) for v in transitions.values())
    print(f"[RecEngine] Markov transition matrix built: "
          f"{len(transitions)} source songs, {total_transitions} transitions")


def get_next_songs(current_song_id, top_k=10):
    """
    Predict the next songs to play after the current song using the Markov chain.
    Returns: [(song_id, probability), ...]
    """
    transitions = rec_cache.get('markov_transitions')
    if transitions is None:
        build_transition_matrix()
        transitions = rec_cache.get('markov_transitions') or {}
    
    return transitions.get(current_song_id, [])[:top_k]


def get_session_context(user_id, lookback_minutes=30):
    """
    Get the user's current listening session (songs played in the last N minutes).
    Useful for understanding what mood/genre the user is in right now.
    """
    recent = fetch_all("""
        SELECT s.song_id, s.title, s.genre, s.language, s.artist_id,
               u.username AS artist_name
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        LEFT JOIN artist_profiles ap ON s.artist_id = ap.artist_id
        LEFT JOIN users u ON ap.user_id = u.user_id
        WHERE st.user_id = %s 
          AND st.streamed_at >= DATE_SUB(NOW(), INTERVAL %s MINUTE)
        ORDER BY st.streamed_at DESC
    """, (user_id, lookback_minutes))
    
    return recent or []
