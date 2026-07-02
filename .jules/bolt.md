## 2024-07-02 - Skipping Pre-Enriched Items to Optimize IN Clauses

**Learning:** Unpaginated database queries cause massive `IN` clause bottlenecks during metadata enrichment (e.g., `enrich_song_metadata`). Even with batch fetching to fix N+1, querying for metadata that is already present on the items creates unnecessary DB load.

**Action:** When enriching data arrays, check for and skip items that already contain the target metadata (e.g., `artist_name` and `artists`) before extracting IDs. This minimizes the size of `IN` clauses during batch database fetches and avoids redundant lookups.
