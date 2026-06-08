import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Create an inline mock cache implementation for testing
class MockCache:
    def __init__(self):
        self.data = {}

    def get(self, key):
        return self.data.get(key)

    def set(self, key, value, ttl_seconds=900):
        self.data[key] = value

    def clear(self):
        self.data = {}

mock_cache = MockCache()

# Mock the entire engine.cache module
mock_engine_cache = MagicMock()
mock_engine_cache.get = mock_cache.get
mock_engine_cache.set = mock_cache.set
sys.modules['engine'] = MagicMock()
sys.modules['engine'].cache = mock_engine_cache
sys.modules['engine.cache'] = mock_engine_cache

# Mock flask and other dependencies
def mock_route(*args, **kwargs):
    def decorator(f):
        return f
    return decorator

mock_flask = MagicMock()
mock_blueprint = MagicMock()
mock_blueprint.route = mock_route
mock_flask.Blueprint.return_value = mock_blueprint

def mock_jsonify(data):
    return MagicMock(is_json=True, data=data)

mock_flask.jsonify = mock_jsonify
sys.modules['flask'] = mock_flask

# We don't need to actually test the DB queries, just that the caching logic triggers
# So we can mock the fetch_all, fetch_one, execute_query
mock_db = MagicMock()
# Give empty responses for most things so stats logic doesn't crash
mock_db.fetch_one.return_value = {'artist_id': 1, 'artist_name': 'Test', 'verified': 1, 'total_listen_seconds': 0}
mock_db.fetch_all.return_value = []
sys.modules['db'] = mock_db

# Mock routes.songs
mock_songs = MagicMock()
mock_songs.enrich_song_metadata.return_value = []
sys.modules['routes.songs'] = mock_songs

# Now import the target
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import importlib
import routes.stats

class TestStatsCache(unittest.TestCase):
    def setUp(self):
        importlib.reload(routes.stats)
        mock_cache.clear()
        mock_db.fetch_one.reset_mock()
        mock_db.fetch_all.reset_mock()

    def test_cache_miss_then_hit(self):
        # First call - Cache miss
        # Should call DB and set cache
        artist_id = 1
        result = routes.stats.get_artist_stats(artist_id)

        # Unpack if it returns a tuple
        if isinstance(result, tuple):
            response, status_code = result
        else:
            response = result
            status_code = 200

        self.assertEqual(status_code, 200)
        self.assertTrue(mock_db.fetch_one.called)

        # Verify it was added to the mock cache
        cache_key = f"artist_stats_{artist_id}"
        self.assertIn(cache_key, mock_cache.data)

        # Reset DB mocks
        mock_db.fetch_one.reset_mock()
        mock_db.fetch_all.reset_mock()

        # Second call - Cache hit
        # Should not call DB
        result2 = routes.stats.get_artist_stats(artist_id)
        if isinstance(result2, tuple):
            response2, status_code2 = result2
        else:
            response2 = result2
            status_code2 = 200
        self.assertEqual(status_code2, 200)
        self.assertFalse(mock_db.fetch_one.called)

        # The data should be the same
        self.assertEqual(response.data, response2.data)

if __name__ == '__main__':
    unittest.main()
