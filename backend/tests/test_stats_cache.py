import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock db module
mock_db = MagicMock()
# Give fetch_one and fetch_all default returns so it doesn't crash on initial logic
mock_db.fetch_one.return_value = {'artist_name': 'Test Artist', 'total_listen_seconds': 0}
mock_db.fetch_all.return_value = []
sys.modules['db'] = mock_db

# Mock flask module
mock_flask = MagicMock()
mock_flask.Blueprint = MagicMock()
mock_jsonify = MagicMock(side_effect=lambda x: x)
mock_flask.jsonify = mock_jsonify
sys.modules['flask'] = mock_flask

# Mock routes.songs
mock_routes_songs = MagicMock()
sys.modules['routes.songs'] = mock_routes_songs

class TestArtistStatsCache(unittest.TestCase):
    def setUp(self):
        # Clear mock calls before each test
        mock_db.fetch_one.reset_mock()
        mock_db.fetch_all.reset_mock()

        # We need to reload the stats module to ensure cache is clean
        from engine import cache
        cache.clear_all()

        # Import the module to test after mocks are applied
        import importlib
        import routes.stats
        importlib.reload(routes.stats)
        self.stats_module = routes.stats

    def test_cache_hit_and_miss(self):
        artist_id = 123

        # First call - should be a cache miss and hit the DB
        result1_tuple = self.stats_module.get_artist_stats(artist_id)
        if isinstance(result1_tuple, tuple):
            result1, status1 = result1_tuple
        else:
            result1 = result1_tuple
            status1 = 200

        # Verify DB was hit multiple times (fetch_one and fetch_all are called multiple times in this function)
        self.assertTrue(mock_db.fetch_one.called)
        self.assertTrue(mock_db.fetch_all.called)

        # Record number of calls
        fetch_one_calls = mock_db.fetch_one.call_count
        fetch_all_calls = mock_db.fetch_all.call_count

        # Verify result structure and status
        self.assertEqual(status1, 200)
        self.assertIn("stats", result1)
        self.assertEqual(result1["stats"]["artist_name"], "Test Artist")

        # Reset mocks for second call
        mock_db.fetch_one.reset_mock()
        mock_db.fetch_all.reset_mock()

        # Second call - should be a cache hit and NOT hit the DB
        result2_tuple = self.stats_module.get_artist_stats(artist_id)
        if isinstance(result2_tuple, tuple):
            result2, status2 = result2_tuple
        else:
            result2 = result2_tuple
            status2 = 200

        # Verify DB was NOT hit
        self.assertEqual(mock_db.fetch_one.call_count, 0)
        self.assertEqual(mock_db.fetch_all.call_count, 0)

        # Verify result is the same
        self.assertEqual(status2, 200)
        self.assertEqual(result1, result2)

if __name__ == '__main__':
    unittest.main()
