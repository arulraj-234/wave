import sys
import unittest
from unittest.mock import MagicMock, patch

def mock_route(*args, **kwargs):
    def decorator(f):
        return f
    return decorator

# Mock dependencies
sys.modules['flask'] = MagicMock()
bp_mock = MagicMock()
bp_mock.route = mock_route
sys.modules['flask'].Blueprint = lambda *args: bp_mock
sys.modules['flask'].jsonify = lambda x: x
sys.modules['flask'].request = MagicMock()

# Mock db
mock_db = MagicMock()
mock_db.fetch_one = MagicMock(return_value={"artist_name": "Test Artist"})
mock_db.fetch_all = MagicMock(return_value=[])
sys.modules['db'] = mock_db

# Mock engine
mock_engine = MagicMock()
mock_cache = MagicMock()
mock_engine.cache = mock_cache
sys.modules['engine'] = mock_engine

# Mock routes.songs
mock_routes_songs = MagicMock()
mock_routes_songs.enrich_song_metadata = lambda x: x
sys.modules['routes.songs'] = mock_routes_songs

sys.path.insert(0, './backend')
import routes.stats

class TestArtistStatsCache(unittest.TestCase):
    def setUp(self):
        # Reset mocks
        mock_db.fetch_one.reset_mock()
        mock_cache.get.reset_mock()
        mock_cache.set.reset_mock()

    def test_cache_miss(self):
        mock_cache.get.return_value = None

        response, status = routes.stats.get_artist_stats(1)

        self.assertEqual(status, 200)
        mock_cache.get.assert_called_once_with("artist_stats_1")
        mock_db.fetch_one.assert_called()
        mock_cache.set.assert_called_once()
        args, kwargs = mock_cache.set.call_args
        self.assertEqual(args[0], "artist_stats_1")
        self.assertEqual(kwargs['ttl_seconds'], 3600)

    def test_cache_hit(self):
        cached_data = {"stats": {"artist_name": "Cached Artist"}}
        mock_cache.get.return_value = cached_data

        response, status = routes.stats.get_artist_stats(2)

        self.assertEqual(status, 200)
        self.assertEqual(response, cached_data)
        mock_cache.get.assert_called_once_with("artist_stats_2")
        mock_db.fetch_one.assert_not_called()
        mock_cache.set.assert_not_called()

if __name__ == '__main__':
    unittest.main()
