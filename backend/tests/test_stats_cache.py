import unittest
import sys
import os
from unittest.mock import MagicMock

# Allow imports from backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock database
mock_db = MagicMock()
sys.modules['db'] = mock_db

# Mock cache
mock_cache = MagicMock()
mock_cache.get.return_value = None
sys.modules['engine.cache'] = mock_cache
sys.modules['engine'] = MagicMock(cache=mock_cache)

# Mock Flask and other dependencies
mock_flask = MagicMock()
# Explicitly mock Blueprint to return a MagicMock so `@stats_bp.route` decorators work but don't break the return type when called directly
mock_blueprint = MagicMock()
mock_blueprint.route.return_value = lambda f: f
mock_flask.Blueprint = MagicMock(return_value=mock_blueprint)
sys.modules['flask'] = mock_flask

# Mock routes.songs
mock_songs = MagicMock()
sys.modules['routes.songs'] = mock_songs

# Import routes after mocking
from routes import stats
import importlib
importlib.reload(stats)

class TestStatsCache(unittest.TestCase):
    def setUp(self):
        # Reset mocks
        mock_db.fetch_one.reset_mock()
        mock_db.fetch_all.reset_mock()
        mock_cache.get.reset_mock()
        mock_cache.set.reset_mock()

        # Mock db returns to avoid NoneType errors in formatting
        mock_db.fetch_one.return_value = {
            'artist_name': 'Test Artist',
            'artist_image': 'url',
            'total_songs': 1,
            'total_plays': 1,
            'unique_listeners': 1,
            'avg_plays_per_song': 1.0,
            'top_song_title': 'Song 1',
            'top_song_cover': 'cover_url',
            'top_song_plays': 1,
            'follower_count': 1,
            'verified': 1,
            'total_listen_seconds': 3600,
            'total_streams': 1,
            'avg_completion_pct': 100.0,
            'username': 'superfan1',
            'avatar_url': 'avatar_url',
            'stream_count': 1,
            'new_listeners': 1,
            'returning_listeners': 0
        }
        mock_db.fetch_all.return_value = []

    def test_cache_miss(self):
        # Mock cache miss
        mock_cache.get.return_value = None

        # Call function
        # Mock flask.jsonify
        stats.jsonify = MagicMock(return_value="jsonified_data")
        result, status = stats.get_artist_stats(1)

        # Verify cache was checked
        mock_cache.get.assert_called_once_with('artist_stats_1')

        # Verify db was queried (cache miss)
        self.assertTrue(mock_db.fetch_one.called)

        # Verify cache was set
        self.assertTrue(mock_cache.set.called)
        args, kwargs = mock_cache.set.call_args
        self.assertEqual(args[0], 'artist_stats_1')
        self.assertEqual(kwargs['ttl_seconds'], 3600)
        self.assertIn('stats', args[1])

        self.assertEqual(status, 200)
        self.assertEqual(result, "jsonified_data")

    def test_cache_hit(self):
        # Mock cache hit
        cached_data = {"stats": {"artist_name": "Cached Artist"}}
        mock_cache.get.return_value = cached_data

        stats.jsonify = MagicMock(return_value="jsonified_cached_data")
        result, status = stats.get_artist_stats(2)

        # Verify cache was checked
        mock_cache.get.assert_called_once_with('artist_stats_2')

        # Verify db was NOT queried
        mock_db.fetch_one.assert_not_called()

        # Verify response is from cache
        stats.jsonify.assert_called_once_with(cached_data)
        self.assertEqual(status, 200)
        self.assertEqual(result, "jsonified_cached_data")

if __name__ == '__main__':
    unittest.main()
