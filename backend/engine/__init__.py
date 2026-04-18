# Wave Recommendation Engine
# A hybrid recommendation system that combines content-based filtering,
# collaborative filtering, and session-based sequencing to generate
# personalized music recommendations.
#
# Architecture:
#   features.py      - Content-based similarity (genre, language, artist, duration)
#   collaborative.py - Item-item co-occurrence from user streams
#   session.py       - Markov chain transition probabilities for "up next"
#   ranker.py        - Blending, diversity enforcement, cold-start fallback
#   cache.py         - TTL-based in-memory cache
#   precompute.py    - Background thread to rebuild matrices periodically
