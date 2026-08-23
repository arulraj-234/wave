## 2024-06-11 - Removed `progress` state from global `PlayerContext`
**Learning:** Placing high-frequency state like media playback `progress` (updated by `timeupdate` several times a second) inside a global Context causes every component consuming the Context to needlessly re-render on every tick.
**Action:** Isolate high-frequency state by providing a `ref` (like `audioRef`) via Context, allowing child components (like `BottomPlayer`) to listen to native events and manage their own local state.
## 2026-08-14 - Optimize enrich_song_metadata IN clause overhead
**Learning:** When enriching metadata via a batched SQL query using an `IN` clause, large unpaginated responses or redundant processing of already-enriched objects can cause significant performance overhead. Repeated loops over dictionaries without checking for existing keys leads to unnecessary database queries and overwriting valid data.
**Action:** Always verify if a dictionary already contains the target keys (e.g., using `if 'key' not in obj:`) before adding its identifier to the list for batch fetching, and use early `continue` statements in subsequent processing loops to skip redundant updates.
## 2024-11-20 - Backend Caching Serialization Limitation
**Learning:** Never cache Flask `Response` objects directly in `engine.cache`. While caching the `jsonify(payload)` object might seem cleaner, Flask response objects are not thread-safe and can be mutated by framework middleware, causing subsequent retrievals to fail or return corrupted data.
**Action:** Always cache the raw dictionary `payload` and wrap it in `jsonify()` *after* retrieval from the cache when returning to the client.
