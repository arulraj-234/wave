import sys
import unittest
from unittest.mock import MagicMock, patch

sys.modules['flask'] = MagicMock()
import flask
def route_decorator(*args, **kwargs):
    return lambda f: f
flask.Blueprint.return_value.route = route_decorator
flask.jsonify.side_effect = lambda x: x

sys.modules['db'] = MagicMock()
from db import fetch_all, fetch_one, execute_query, get_connection
fetch_one.side_effect = [{"artist_id": 1, "artist_name": "Test Artist"}] + [{}] * 20
fetch_all.return_value = []

sys.modules['routes.songs'] = MagicMock()
from routes.songs import enrich_song_metadata
enrich_song_metadata.return_value = []

import routes.stats

class TestStatsCaching(unittest.TestCase):
    @patch('routes.stats.cache')
    def test_get_artist_stats_caching(self, mock_cache):
        # Setup mock cache miss
        mock_cache.get.return_value = None

        # Call function
        result = routes.stats.get_artist_stats(1)

        # Verify cache.set was called with expected key and TTL
        mock_cache.set.assert_called_once()
        args, kwargs = mock_cache.set.call_args
        self.assertEqual(args[0], "artist_stats_1")
        self.assertEqual(kwargs.get('ttl_seconds'), 3600)
        self.assertIn("stats", args[1])

        # Setup mock cache hit
        mock_cache.reset_mock()
        mock_cache.get.return_value = {"cached": "data"}

        # Call function
        routes.stats.get_artist_stats(1)

        # Verify cache.set was NOT called on cache hit
        mock_cache.set.assert_not_called()

if __name__ == '__main__':
    unittest.main()
