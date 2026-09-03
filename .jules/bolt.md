## 2024-06-11 - Removed `progress` state from global `PlayerContext`
**Learning:** Placing high-frequency state like media playback `progress` (updated by `timeupdate` several times a second) inside a global Context causes every component consuming the Context to needlessly re-render on every tick.
**Action:** Isolate high-frequency state by providing a `ref` (like `audioRef`) via Context, allowing child components (like `BottomPlayer`) to listen to native events and manage their own local state.
## 2026-08-14 - Optimize enrich_song_metadata IN clause overhead
**Learning:** When enriching metadata via a batched SQL query using an `IN` clause, large unpaginated responses or redundant processing of already-enriched objects can cause significant performance overhead. Repeated loops over dictionaries without checking for existing keys leads to unnecessary database queries and overwriting valid data.
**Action:** Always verify if a dictionary already contains the target keys (e.g., using `if 'key' not in obj:`) before adding its identifier to the list for batch fetching, and use early `continue` statements in subsequent processing loops to skip redundant updates.
## 2026-08-16 - Cache heavy DB endpoints instead of optimizing massive queries
**Learning:** Some endpoints, like `/artist/<int:artist_id>`, aggregate data from over 15 complex SQL queries. Attempting to optimize these queries individually or convert them to views is often less impactful and higher risk than simply caching the entire serialized payload.
**Action:** Identify endpoints that perform heavy reads where real-time accuracy is not critical, and wrap the final `jsonify` payload in an in-memory cache (like `engine.cache`) with an appropriate TTL before serving.
