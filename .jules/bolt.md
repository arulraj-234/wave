## 2024-06-14 - Inline imports vs global module scope
**Learning:** Adding imports inline (e.g., `from engine import cache`) inside a Flask Blueprint route definition violates PEP 8 and can be messy. It's better to structure `engine.cache` imports at the top-level of the file to maintain code quality.
**Action:** Next time I add caching dependencies like `engine.cache` to a module, ensure they are placed at the top of the file alongside the other standard imports.
