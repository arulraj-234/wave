## 2024-06-11 - Removed `progress` state from global `PlayerContext`
**Learning:** Placing high-frequency state like media playback `progress` (updated by `timeupdate` several times a second) inside a global Context causes every component consuming the Context to needlessly re-render on every tick.
**Action:** Isolate high-frequency state by providing a `ref` (like `audioRef`) via Context, allowing child components (like `BottomPlayer`) to listen to native events and manage their own local state.
## 2024-08-17 - Minimize IN clause size for array updates
**Learning:** Enumerable operations over lists like `enrich_song_metadata` blindly querying the database using an `IN` clause with all item IDs causes massive bottleneck if many items already contain that metadata. Unpaginated DB queries with `IN` constraints can result in terrible performance.
**Action:** Iterate and build `song_ids` checking first for `if "artists" not in s` to drastically cut down the DB payload size, ensuring subsequent iteration loops skip over previously hydrated data.
