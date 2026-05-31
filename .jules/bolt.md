## 2024-05-31 - Flask Response Caching Anti-Pattern
**Learning:** Flask Response objects (like those from `jsonify()`) are not thread-safe and can be mutated by middleware. Caching them directly leads to unpredictable bugs.
**Action:** Always cache the raw dictionary payload and call `jsonify()` on retrieval/return instead of caching the Response object.
