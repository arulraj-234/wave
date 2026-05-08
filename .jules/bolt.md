## 2024-05-30 - Added `execute_batch` to shared DB module and mock fixture
**Learning:** `execute_batch` was implemented in `db.py` to optimize DB insertions but not all modules were using it and tests did not have `execute_batch` mocked in the shared `mock_db` fixture, which leads to `ModuleNotFoundError` or similar import errors or missing mocks in testing.
**Action:** Always ensure that new utility functions (especially database related like `execute_batch`) are mocked appropriately in global test fixtures (`conftest.py`) to maintain an isolated test suite.
