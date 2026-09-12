## 2024-09-12 - Cached Analytics Dashboards
**Learning:** Read-heavy, complex analytics endpoints (like `get_artist_stats` which runs 10+ SQL queries) are prime targets for caching. The internal caching module (`engine.cache`) is suitable for reducing database load for stats that don't require real-time accuracy.
**Action:** When working on similar complex read-only dashboards, apply TTL caching on the payload.
