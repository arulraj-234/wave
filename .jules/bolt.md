## 2024-04-27 - Push Static Metadata to SQL in Backend Search
**Learning:** For high-traffic data retrieval routes (like search) built with Python and MySQL, manually looping over result sets to inject static dictionary keys (e.g., `type`, `source`) causes unnecessary Python-level CPU overhead.
**Action:** Always push static metadata injection directly into the SQL query using static string aliases (e.g., `SELECT 'artist' AS type, 'local' AS source`) instead of relying on application-level Python `for` loops.
