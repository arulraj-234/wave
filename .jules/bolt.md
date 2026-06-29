
## 2024-06-29 - Minimizing Batch Query Payload Size
**Learning:** During recursive or sequential enrichment passes, when retrieving child items or metadata, many rows in the query set might already be enriched. Without optimization, you pass unnecessarily large `IN` clauses to the database.
**Action:** Filter target lists to exclude already-enriched items before performing batch DB fetches (e.g., `[id for item in items if 'metadata_field' not in item]`), and combine results cleanly.
