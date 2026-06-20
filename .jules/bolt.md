## 2024-05-18 - Caching Artist Stats
**Learning:** `get_artist_stats` executes ~16 complex SQL queries, creating a severe bottleneck for artists viewing their dashboard.
**Action:** Implemented caching for `get_artist_stats` using the native `engine.cache` with a 1-hour TTL (`3600` seconds). This eliminates redundant DB queries and speeds up response times significantly.

## 2024-05-18 - Optimizing `enrich_song_metadata`
**Learning:** `enrich_song_metadata` executes an unpaginated query with a potentially massive `IN` clause during metadata enrichment, which causes a significant performance bottleneck.
**Action:** Optimized `enrich_song_metadata` to skip songs that already have `artist_name` and `artists` populated, which reduces the size of the `IN` clause array significantly.
