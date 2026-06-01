import sys
import os
import unittest
from unittest.mock import MagicMock, patch

# Add the backend directory to sys.path so 'db' and 'engine' can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock dependencies
sys.modules['flask'] = MagicMock()
sys.modules['mysql'] = MagicMock()
sys.modules['mysql.connector'] = MagicMock()
sys.modules['flask_cors'] = MagicMock()
sys.modules['flask_limiter'] = MagicMock()
sys.modules['flask_limiter.util'] = MagicMock()
sys.modules['jwt'] = MagicMock()
sys.modules['dotenv'] = MagicMock() # mock dotenv which is used in config.py
sys.modules['werkzeug'] = MagicMock()
sys.modules['werkzeug.utils'] = MagicMock()
sys.modules['mutagen'] = MagicMock()
sys.modules['requests'] = MagicMock()

# Setup mocks for Blueprint so route acts as a decorator returning the function
mock_blueprint = MagicMock()
def mock_route(*args, **kwargs):
    def decorator(f):
        f.route = args[0]
        return f
    return decorator
mock_blueprint.return_value.route = mock_route
sys.modules['flask'].Blueprint = mock_blueprint

# Mock jsonify to return the dict itself for easy testing
sys.modules['flask'].jsonify = lambda x: x

class TestArtistStatsCache(unittest.TestCase):
    @patch('engine.cache.get')
    @patch('engine.cache.set')
    @patch('db.fetch_one')
    @patch('db.fetch_all')
    def test_cache_hit_and_miss(self, mock_fetch_all, mock_fetch_one, mock_cache_set, mock_cache_get):
        from routes.stats import get_artist_stats

        # Test Cache Hit
        mock_cache_get.return_value = {"stats": {"artist_name": "Test Artist"}}
        response, status_code = get_artist_stats(1)
        self.assertEqual(status_code, 200)
        self.assertEqual(response['stats']['artist_name'], "Test Artist")
        mock_cache_get.assert_called_with("artist_stats_1")
        mock_fetch_one.assert_not_called()

        # Test Cache Miss
        mock_cache_get.reset_mock()
        mock_cache_get.return_value = None
        mock_fetch_one.return_value = {"artist_name": "New Artist"}
        mock_fetch_all.return_value = []

        response, status_code = get_artist_stats(2)
        self.assertEqual(status_code, 200)
        self.assertEqual(response['stats']['artist_name'], "New Artist")
        mock_cache_set.assert_called_with("artist_stats_2", response, ttl_seconds=3600)
        mock_fetch_one.assert_called()

if __name__ == '__main__':
    unittest.main()
