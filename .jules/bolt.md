## 2024-06-11 - Removed `progress` state from global `PlayerContext`
**Learning:** Placing high-frequency state like media playback `progress` (updated by `timeupdate` several times a second) inside a global Context causes every component consuming the Context to needlessly re-render on every tick.
**Action:** Isolate high-frequency state by providing a `ref` (like `audioRef`) via Context, allowing child components (like `BottomPlayer`) to listen to native events and manage their own local state.

## 2024-08-15 - Optimize array metadata enrichment loop
**Learning:** When enriching data arrays (like in `enrich_song_metadata`), iterating over all elements and overwriting existing metadata with empty defaults or fetching duplicates can cause redundant `IN` clause database bottlenecks.
**Action:** Check for explicit key presence (e.g., `'artists' in s`) rather than truthiness to skip items that already contain the target metadata, minimizing `IN` clause sizes. Furthermore, ensure the subsequent metadata attachment loop explicitly skips these items (e.g., using `continue`) to prevent overwriting existing valid metadata with default empty states.
