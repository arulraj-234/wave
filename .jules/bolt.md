## 2024-06-25 - Python-Level Loop for Static Query Data
**Learning:** Found an anti-pattern in the backend search route (`search_local`) where static metadata (like `type='artist'` and `source='local'`) was being added to dictionary results via an O(n) Python loop *after* the database fetch.
**Action:** Always project static metadata directly in the SQL query (`SELECT 'artist' AS type, 'local' AS source`) instead of appending it in Python. This leverages the C-optimized DB connector and skips Python object iteration overhead.
