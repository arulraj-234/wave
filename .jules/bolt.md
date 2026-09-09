## 2024-06-11 - Removed `progress` state from global `PlayerContext`
**Learning:** Placing high-frequency state like media playback `progress` (updated by `timeupdate` several times a second) inside a global Context causes every component consuming the Context to needlessly re-render on every tick.
**Action:** Isolate high-frequency state by providing a `ref` (like `audioRef`) via Context, allowing child components (like `BottomPlayer`) to listen to native events and manage their own local state.
## 2026-08-14 - Optimize enrich_song_metadata IN clause overhead
**Learning:** When enriching metadata via a batched SQL query using an `IN` clause, large unpaginated responses or redundant processing of already-enriched objects can cause significant performance overhead. Repeated loops over dictionaries without checking for existing keys leads to unnecessary database queries and overwriting valid data.
**Action:** Always verify if a dictionary already contains the target keys (e.g., using `if 'key' not in obj:`) before adding its identifier to the list for batch fetching, and use early `continue` statements in subsequent processing loops to skip redundant updates.
## 2024-09-09 - Cache Python dictionaries, not Flask Response objects
**Learning:** When adding caching to an API endpoint using an in-memory dictionary cache, caching the Flask `Response` object (e.g. from `jsonify()`) leads to thread-safety issues because it can be mutated by framework middleware.
**Action:** Always extract the raw dictionary payload, cache the payload itself, and then pass the cached payload to `jsonify()` before returning. Apply generous TTLs (e.g., 1 hour) for read-heavy analytical endpoints (like `get_artist_stats`) that don't need real-time accuracy to drastically reduce DB load.
