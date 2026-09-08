## 2024-06-11 - Removed `progress` state from global `PlayerContext`
**Learning:** Placing high-frequency state like media playback `progress` (updated by `timeupdate` several times a second) inside a global Context causes every component consuming the Context to needlessly re-render on every tick.
**Action:** Isolate high-frequency state by providing a `ref` (like `audioRef`) via Context, allowing child components (like `BottomPlayer`) to listen to native events and manage their own local state.
## 2026-08-14 - Optimize enrich_song_metadata IN clause overhead
**Learning:** When enriching metadata via a batched SQL query using an `IN` clause, large unpaginated responses or redundant processing of already-enriched objects can cause significant performance overhead. Repeated loops over dictionaries without checking for existing keys leads to unnecessary database queries and overwriting valid data.
**Action:** Always verify if a dictionary already contains the target keys (e.g., using `if 'key' not in obj:`) before adding its identifier to the list for batch fetching, and use early `continue` statements in subsequent processing loops to skip redundant updates.
## 2026-08-14 - Optimize get_artist_stats aggregations
**Learning:** Endpoints that execute large numbers of aggregation queries (like `get_artist_stats` executing 16+  and  queries across large tables like streams and songs) can cause significant database load when hit repeatedly on dashboard reloads.
**Action:** When data does not require strict real-time consistency, apply a generous Time-To-Live (TTL) cache (e.g., using `engine.cache` with a 1-hour TTL) to offload the database and dramatically improve response times.
## 2026-09-08 - Cache Heavy Aggregation Endpoints
**Learning:** Endpoints executing numerous aggregation queries (like `get_artist_stats`) cause severe database load on repeated dashboard views.
**Action:** For read-heavy, non-real-time analytics, implement TTL-based caching using the internal `engine.cache` layer to mitigate database bottlenecks and improve endpoint latency.
