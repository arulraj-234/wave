## 2024-06-18 - Caching Flask Response vs Raw Payload
**Learning:** Caching Flask `Response` objects directly (like `jsonify({...})`) causes issues because they are not thread-safe and can be mutated by framework middleware. The codebase has an explicit convention to cache the raw dictionary payload instead, and apply `jsonify()` when serving from cache.
**Action:** When implementing endpoint caching in Flask apps, always cache the raw data structure (dict/list) and perform the serialization/response creation (`jsonify()`) on cache hits.
