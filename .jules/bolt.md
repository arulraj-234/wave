## 2024-06-11 - Removed `progress` state from global `PlayerContext`
**Learning:** Placing high-frequency state like media playback `progress` (updated by `timeupdate` several times a second) inside a global Context causes every component consuming the Context to needlessly re-render on every tick.
**Action:** Isolate high-frequency state by providing a `ref` (like `audioRef`) via Context, allowing child components (like `BottomPlayer`) to listen to native events and manage their own local state.
## 2024-08-13 - Optimized metadata enrichment
**Learning:** When enriching arrays of records with metadata (e.g., `enrich_song_metadata`), blindly collecting all IDs and querying the database leads to needlessly large `IN` clauses if some records are already enriched.
**Action:** Always filter the list of IDs to fetch down to only those items explicitly missing the target metadata key (e.g., `if 'artists' not in song`), and explicitly `continue` the loop when attaching metadata to avoid overwriting existing valid metadata with default empty states.
