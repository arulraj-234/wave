## 2024-06-11 - Removed `progress` state from global `PlayerContext`
**Learning:** Placing high-frequency state like media playback `progress` (updated by `timeupdate` several times a second) inside a global Context causes every component consuming the Context to needlessly re-render on every tick.
**Action:** Isolate high-frequency state by providing a `ref` (like `audioRef`) via Context, allowing child components (like `BottomPlayer`) to listen to native events and manage their own local state.

## 2026-08-14 - Optimize enrich_song_metadata IN clause overhead
**Learning:** When enriching metadata via a batched SQL query using an `IN` clause, large unpaginated responses or redundant processing of already-enriched objects can cause significant performance overhead. Repeated loops over dictionaries without checking for existing keys leads to unnecessary database queries and overwriting valid data.
**Action:** Always verify if a dictionary already contains the target keys (e.g., using `if 'key' not in obj:`) before adding its identifier to the list for batch fetching, and use early `continue` statements in subsequent processing loops to skip redundant updates.

## 2026-10-24 - API Response Caching Anti-Pattern
**Learning:** It is an anti-pattern to globally mock standard framework behaviors (like overriding `sys.modules['flask']` globally in a Python `unittest` script) when attempting to write tests for a newly introduced cached endpoint. This pollutes the environment and breaks the rest of the test suite. Furthermore, Flask `Response` objects should never be cached as they are mutable by middleware.
**Action:** Only cache raw python dictionary payloads. When testing cached behavior, use context-managed local patch decorators (`@patch('routes.stats.fetch_one')`) instead of overriding `sys.modules` globally to ensure clean test isolation.
