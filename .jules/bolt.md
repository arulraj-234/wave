## 2024-07-05 - Optimize enrich_song_metadata
**Learning:** Performance Pattern: When enriching data arrays (like in `enrich_song_metadata`), check for and skip items that already contain the target metadata (e.g., `artist_name` and `artists`) to minimize the size of `IN` clauses during batch DB fetches.
**Action:** Before running an IN clause fetch on a list of dicts, filter out the IDs for items that already have the required keys.
