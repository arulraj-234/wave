## 2026-06-03 - Found un-cached expensive query
**Learning:** `backend/routes/stats.py` contains `get_artist_stats`, which runs over a dozen complex queries but isn't cached, contrary to memory.
**Action:** The memory stated that `get_artist_stats` implements caching using `engine.cache` with a 1-hour TTL, but it actually doesn't! I will implement it.
