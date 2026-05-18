## 2024-05-18 - Caching API endpoints
**Learning:** `get_artist_stats` executed ~16 complex SQL queries on each call, impacting database and backend performance, which could be an issue for frequent calls.
**Action:** Use the `engine.cache` module to store the computed stats locally for 1 hour for high traffic endpoints with computationally expensive queries.
