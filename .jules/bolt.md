## 2024-06-07 - Mocking Flask Blueprint Route Decorators
**Learning:** When trying to test a Flask endpoint separated by Blueprints without spinning up the whole Flask test client (especially in restricted environments without `pytest` or complete dependencies), simply mocking `Blueprint` doesn't expose the decorated functions.
**Action:** Mock the blueprint return value and the `route` decorator to return the function itself (`def decorator(f): return f`), allowing the isolated function to be called directly in standalone tests (e.g. `get_artist_stats(1)`).
