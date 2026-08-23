import unittest
from unittest.mock import MagicMock, patch
import sys
import os

# Insert backend root directory to allow correct module resolution
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock external dependencies via sys.modules
mock_mysql = MagicMock()
sys.modules['mysql'] = mock_mysql
sys.modules['mysql.connector'] = mock_mysql

# We can import flask normally since we just pip installed it, but in case we hadn't:
# mock_flask = MagicMock()
# sys.modules['flask'] = mock_flask

# We mock other missing imports
sys.modules['jwt'] = MagicMock()
sys.modules['mutagen'] = MagicMock()
sys.modules['werkzeug.utils'] = MagicMock()
sys.modules['dotenv'] = MagicMock()
sys.modules['requests'] = MagicMock()

# We mock db
mock_db = MagicMock()
sys.modules['db'] = mock_db
sys.modules['db'].fetch_one = MagicMock(return_value={
    "artist_id": 1,
    "artist_name": "Test Artist",
    "artist_image": "",
    "bio": "",
    "verified": True,
    "total_songs": 10,
    "total_plays": 1000,
    "unique_listeners": 500,
    "avg_plays_per_song": 100.0,
    "top_song_title": "Hit",
    "top_song_cover": "",
    "top_song_plays": 500,
    "follower_count": 100
})
sys.modules['db'].fetch_all = MagicMock(return_value=[])

import importlib
from engine import cache
import routes.stats

class TestArtistStatsCache(unittest.TestCase):

    def setUp(self):
        # Reset cache
        cache.clear_all()
        # Reset mocks
        mock_db.fetch_one.reset_mock()
        mock_db.fetch_all.reset_mock()

        # Reload to ensure re-binding
        importlib.reload(routes.stats)

    @patch('routes.stats.jsonify')
    def test_get_artist_stats_caching(self, mock_jsonify):
        # Mock jsonify to just return its input
        mock_jsonify.side_effect = lambda x: x

        # First call: should hit the DB and cache the result
        artist_id = 999
        result1, status1 = routes.stats.get_artist_stats(artist_id)

        self.assertEqual(status1, 200)
        self.assertTrue(mock_db.fetch_one.called)

        # Save call count
        fetch_one_calls = mock_db.fetch_one.call_count
        fetch_all_calls = mock_db.fetch_all.call_count

        # Second call: should hit the cache, not the DB
        result2, status2 = routes.stats.get_artist_stats(artist_id)

        self.assertEqual(status2, 200)
        self.assertEqual(result1, result2) # Should return the same cached payload

        # Call count should not have increased
        self.assertEqual(mock_db.fetch_one.call_count, fetch_one_calls)
        self.assertEqual(mock_db.fetch_all.call_count, fetch_all_calls)

if __name__ == '__main__':
    unittest.main()
