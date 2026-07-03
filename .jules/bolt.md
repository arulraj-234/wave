## 2024-05-18 - Optimized Array Enrichment
**Learning:** Found an N+1 query bottleneck masking as a single query when doing metadata enrichment (e.g. `enrich_song_metadata`). Although batched, the `IN` clause can become massive and include items that are already enriched.
**Action:** Always verify if items in a batch array are already enriched before including them in the SQL query list for processing.
