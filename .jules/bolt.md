## 2024-05-07 - Refactoring DB Inserts to execute_batch
**Learning:** Found N+1 query loops throughout backend during API optimization search, specifically in onboarding (`routes/auth.py`). The existing `db.py` lacked a method exposing `cursor.executemany()`.
**Action:** When working on performance, actively search for standard patterns like loops making database queries. Implementing an `execute_batch` wrapper immediately solves these bottlenecks. Update `conftest.py` with `mock_execute_batch` whenever extending DB utilities.
