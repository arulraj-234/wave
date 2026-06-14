import sys
import os
import unittest
from unittest.mock import patch, MagicMock

# Mocks
sys.modules['flask'] = MagicMock()
sys.modules['flask_cors'] = MagicMock()
sys.modules['flask_limiter'] = MagicMock()
sys.modules['flask_limiter.util'] = MagicMock()
sys.modules['mysql'] = MagicMock()
sys.modules['mysql.connector'] = MagicMock()
sys.modules['dotenv'] = MagicMock()
sys.modules['jwt'] = MagicMock()
sys.modules['mutagen'] = MagicMock()
sys.modules['mutagen.mp3'] = MagicMock()
sys.modules['werkzeug'] = MagicMock()
sys.modules['werkzeug.utils'] = MagicMock()
sys.modules['requests'] = MagicMock()
sys.modules['urllib3'] = MagicMock()

# Configure Blueprint mock to return original function
def mock_route(*args, **kwargs):
    def decorator(f):
        return f
    return decorator

flask_mock = sys.modules['flask']
flask_mock.Blueprint.return_value.route = mock_route

# Append backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from routes import stats
from engine import cache

class TestTrending(unittest.TestCase):
    def setUp(self):
        # Clear cache before each test
        cache.clear_all()

    @patch('routes.stats.fetch_all')
    @patch('routes.stats.enrich_song_metadata')
    @patch('routes.stats.jsonify')
    def test_trending(self, mock_jsonify, mock_enrich, mock_fetch):
        mock_fetch.return_value = [{"song_id": 1}]
        mock_enrich.return_value = [{"song_id": 1, "enriched": True}]
        mock_jsonify.return_value = ({"songs": [{"song_id": 1, "enriched": True}]}, 200)

        # 1st call - should execute query and set cache
        res = stats.get_trending()
        self.assertTrue(mock_fetch.called)

        # Verify INNER JOIN is in query
        query = mock_fetch.call_args[0][0]
        self.assertIn("INNER JOIN", query)
        self.assertNotIn("HAVING recent_plays > 0", query)

        # Reset mock
        mock_fetch.reset_mock()
        mock_enrich.reset_mock()

        # 2nd call - should hit cache
        res_cached = stats.get_trending()
        self.assertFalse(mock_fetch.called)
        self.assertFalse(mock_enrich.called)

        # Verify cached data matches original payload via mock_jsonify calls
        first_call_args = mock_jsonify.call_args_list[0][0][0]
        second_call_args = mock_jsonify.call_args_list[1][0][0]
        self.assertEqual(first_call_args, second_call_args)

if __name__ == '__main__':
    unittest.main()
