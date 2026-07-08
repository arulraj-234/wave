## 2025-02-12 - Prevent N+1 metadata overwrite in backend
**Learning:** `enrich_song_metadata` in `backend/routes/songs.py` was pulling metadata for *all* provided songs even if some of them already had `artists` populated, which increased SQL `IN` clause sizes and resulted in `artists` being overwritten if they already existed.
**Action:** When enriching large data collections, always explicitly skip elements that already contain the targeted data both in the SQL query preparation step (ID extraction) and during the final attachment loop.
