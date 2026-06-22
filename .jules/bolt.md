## 2026-06-22 - test pollution with sys.modules
**Learning:** Testing logic in sandbox environments by mutating sys.modules at the global scope causes tests to pollute the application execution and leads to failures in other components by overriding required imports for subsequent tests.
**Action:** When mocking modules, avoid changing sys.modules globally and permanently. Use properly scoped patches and mocks, and clean up temporary scripts afterward.
