import sys
import os
import unittest
from unittest.mock import patch, MagicMock

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import importlib

# Mock flask
mock_flask = MagicMock()
def mock_route(*args, **kwargs):
    def decorator(f):
        return f
    return decorator

mock_bp = MagicMock()
mock_bp.route = mock_route
mock_flask.Blueprint.return_value = mock_bp
sys.modules['flask'] = mock_flask

# Mock db module
mock_db = MagicMock()
mock_db.fetch_one.return_value = {"artist_name": "Test Artist"}
mock_db.fetch_all.return_value = []
sys.modules['db'] = mock_db

# Mock routes.songs
mock_songs = MagicMock()
sys.modules['routes.songs'] = mock_songs

# Real cache for testing
from engine import cache
import routes.stats

class TestArtistStatsCache(unittest.TestCase):
    def setUp(self):
        cache.clear_all()
        importlib.reload(routes.stats)

    @patch('routes.stats.fetch_one')
    @patch('routes.stats.fetch_all')
    @patch('routes.stats.jsonify')
    def test_cache(self, mock_jsonify, mock_fetch_all, mock_fetch_one):
        mock_jsonify.side_effect = lambda x: x
        mock_fetch_one.return_value = {"artist_name": "Test Artist"}
        mock_fetch_all.return_value = []

        # Call 1: Should hit database
        result1, status1 = routes.stats.get_artist_stats(1)
        self.assertEqual(status1, 200)
        self.assertEqual(result1['stats']['artist_name'], "Test Artist")
        self.assertTrue(mock_fetch_one.called)

        mock_fetch_one.reset_mock()
        mock_fetch_all.reset_mock()

        # Call 2: Should hit cache
        result2, status2 = routes.stats.get_artist_stats(1)
        self.assertEqual(status2, 200)
        self.assertEqual(result2['stats']['artist_name'], "Test Artist")
        self.assertFalse(mock_fetch_one.called)

if __name__ == '__main__':
    unittest.main()
