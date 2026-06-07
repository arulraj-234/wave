import sys
import os
import unittest
from unittest.mock import MagicMock, patch

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock dependencies
sys.modules['flask'] = MagicMock()
sys.modules['flask'].Blueprint = MagicMock()
sys.modules['flask'].jsonify = lambda x: x
sys.modules['flask'].request = MagicMock()

sys.modules['db'] = MagicMock()
sys.modules['db'].fetch_all = MagicMock()
sys.modules['db'].fetch_one = MagicMock()
sys.modules['db'].execute_query = MagicMock()
sys.modules['db'].get_connection = MagicMock()

sys.modules['routes.songs'] = MagicMock()
sys.modules['routes.songs'].enrich_song_metadata = MagicMock()

sys.modules['engine'] = MagicMock()
mock_cache = MagicMock()
sys.modules['engine'].cache = mock_cache

# We need to mock the route decorator so that the function can be directly tested
def mock_route(*args, **kwargs):
    def decorator(f):
        return f
    return decorator

# apply to the mocked Blueprint instance returned when calling Blueprint()
sys.modules['flask'].Blueprint.return_value.route = mock_route

from routes.stats import get_artist_stats

class TestArtistStatsCaching(unittest.TestCase):
    def setUp(self):
        # Reset mocks
        mock_cache.get.reset_mock()
        mock_cache.set.reset_mock()
        sys.modules['db'].fetch_one.reset_mock()
        sys.modules['db'].fetch_all.reset_mock()

    def test_cache_hit(self):
        # Setup cache hit
        mock_cache.get.return_value = {"stats": {"artist_name": "Test Artist"}}

        # Call the function
        result, status = get_artist_stats(1)

        # Verify cache was checked
        mock_cache.get.assert_called_once_with("artist_stats_1")

        # Verify we returned cached data and didn't call db
        self.assertEqual(result, {"stats": {"artist_name": "Test Artist"}})
        self.assertEqual(status, 200)
        sys.modules['db'].fetch_one.assert_not_called()
        sys.modules['db'].fetch_all.assert_not_called()

    def test_cache_miss(self):
        # Setup cache miss
        mock_cache.get.return_value = None

        # Setup DB mocks to avoid errors during calculation
        sys.modules['db'].fetch_one.return_value = {"artist_name": "New Artist"}
        sys.modules['db'].fetch_all.return_value = []

        # Call the function
        result, status = get_artist_stats(2)

        # Verify cache was checked
        mock_cache.get.assert_called_once_with("artist_stats_2")

        # Verify DB was called (meaning we bypassed cache)
        self.assertTrue(sys.modules['db'].fetch_one.called)

        # Verify cache was set with the computed response
        mock_cache.set.assert_called_once()
        args, kwargs = mock_cache.set.call_args
        self.assertEqual(args[0], "artist_stats_2")
        self.assertIn("stats", args[1])
        self.assertEqual(kwargs['ttl_seconds'], 3600)
        self.assertEqual(status, 200)

if __name__ == '__main__':
    unittest.main()
