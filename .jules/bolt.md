## $(date +%Y-%m-%d) - Optimize `enrich_song_metadata` DB Query
**Learning:** We can reduce database load in batch fetches (`IN` clause) by skipping items that already have the required enriched metadata (e.g., from JioSaavn API or external caches). This directly applies the performance pattern of reducing the `IN` clause footprint.
**Action:** When mapping IDs for batch processing or enrichment, always filter out items that already contain the targeted data to minimize query size.
