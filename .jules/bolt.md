## 2024-06-11 - Removed `progress` state from global `PlayerContext`
**Learning:** Placing high-frequency state like media playback `progress` (updated by `timeupdate` several times a second) inside a global Context causes every component consuming the Context to needlessly re-render on every tick.
**Action:** Isolate high-frequency state by providing a `ref` (like `audioRef`) via Context, allowing child components (like `BottomPlayer`) to listen to native events and manage their own local state.

## 2026-08-18 - Batch fetching redundant loop optimization in `enrich_song_metadata`
**Learning:** Unpaginated database queries cause massive `IN` clause bottlenecks when arrays contain items that don't need enrichment.
**Action:** Always filter lists before creating `IN` clauses for database batching, and aggressively `continue` loops to prevent redundant overwrites when pushing static metadata.
