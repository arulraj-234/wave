## 2024-06-13 - Cache Analytics Endpoints Safely
**Learning:** The `/artist/<int:artist_id>` endpoint performs 16+ expensive inline SQL queries sequentially for comprehensive stats. Using `engine.cache.set()` with a raw dictionary (instead of a Flask Response object) prevents TypeErrors when caching.
**Action:** Always extract and build raw dictionary payload `data = {...}` before returning, cache that `data`, and then apply `jsonify(data)` in Flask applications.
