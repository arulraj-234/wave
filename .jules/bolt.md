## 2024-05-17 - Optimize sequential INSERTS with batch insertion
**Learning:** Sequential `INSERT` statements in `for` loops using `execute_query` cause significant N+1 round-trip performance bottlenecks when saving user preferences and importing songs with multiple artists.
**Action:** Always implement and use a batch database execution wrapper like `execute_batch` with `cursor.executemany()` to reduce overhead from O(n) to O(1) for bulk inserts.
