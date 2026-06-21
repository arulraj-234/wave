## 2026-06-21 - Prevent Redundant Metadata Queries
**Learning:** The metadata enrichment process (`enrich_song_metadata`) iterates through songs, but often is supplied with data objects that already have their artist data appended. Failing to skip these items expands the batch database `IN` clause querying for metadata unnecessarily.
**Action:** Always verify if an object already has the desired enriched properties prior to including it in batch queries to external stores or databases.
