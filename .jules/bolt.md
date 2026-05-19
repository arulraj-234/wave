## 2024-05-19 - Caching complex queries
**Learning:** The `get_artist_stats` endpoint executes 16+ complex queries synchronously on every hit, causing latency and db pressure.
**Action:** Always add TTL caching for static-heavy dashboards (like artist stats) that don't need real-time data, using existing in-memory cache helpers.
