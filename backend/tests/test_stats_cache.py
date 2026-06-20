import unittest
from unittest.mock import MagicMock
import sys
import os
import importlib

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

class TestStatsCache(unittest.TestCase):
    def setUp(self):
        # Mock flask
        self.mock_flask = MagicMock()

        # Blueprint mock
        self.mock_blueprint = MagicMock()
        # Ensure @route returns the function unmodified
        self.mock_blueprint.route.return_value = lambda f: f
        self.mock_flask.Blueprint.return_value = self.mock_blueprint

        # mock jsonify to just return the dictionary for easy assertions
        self.mock_flask.jsonify = lambda x: x
        self.mock_flask.request = MagicMock()
        sys.modules['flask'] = self.mock_flask

        # Mock db
        self.mock_db = MagicMock()
        self.mock_fetch_one = MagicMock()
        self.mock_fetch_all = MagicMock()
        self.mock_db.fetch_one = self.mock_fetch_one
        self.mock_db.fetch_all = self.mock_fetch_all
        sys.modules['db'] = self.mock_db

        # Mock routes.songs
        self.mock_routes_songs = MagicMock()
        sys.modules['routes.songs'] = self.mock_routes_songs

        import engine.cache
        self.cache = engine.cache

        import routes.stats
        importlib.reload(routes.stats)
        self.stats = routes.stats

        # Clear cache before each test
        self.cache.clear_all()

    def test_get_artist_stats_caching(self):
        # Setup mock db returns
        self.mock_fetch_one.return_value = {
            'artist_name': 'Test Artist',
            'total_songs': 10,
            'total_plays': 100,
            'avg_plays_per_song': 10.0,
            'follower_count': 5,
            'verified': 1,
            'avg_completion_pct': 85.0
        }
        self.mock_fetch_all.return_value = []

        artist_id = 123

        # First call - should hit DB
        response, status_code = self.stats.get_artist_stats(artist_id)

        self.assertEqual(status_code, 200)
        self.assertEqual(response['stats']['artist_name'], 'Test Artist')
        self.assertTrue(self.mock_fetch_one.called)

        # Reset mock to check if it gets called again
        call_count = self.mock_fetch_one.call_count
        self.mock_fetch_one.reset_mock()

        # Second call - should hit cache
        response_cached, status_code_cached = self.stats.get_artist_stats(artist_id)

        self.assertEqual(status_code_cached, 200)
        self.assertEqual(response_cached['stats']['artist_name'], 'Test Artist')
        self.mock_fetch_one.assert_not_called()

        # Check cache state directly
        cache_key = f"artist_stats_{artist_id}"
        self.assertIsNotNone(self.cache.get(cache_key))

if __name__ == '__main__':
    unittest.main()
