import unittest
from unittest.mock import MagicMock
import sys
import os
import importlib

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

class TestArtistStatsCache(unittest.TestCase):
    def setUp(self):
        # We need to test caching logic inside stats.py without poisoning other tests.
        # We mock at the module level locally for this test ONLY, and clean up afterwards.
        self.original_modules = {}
        for mod in ['flask', 'db', 'routes.songs']:
            if mod in sys.modules:
                self.original_modules[mod] = sys.modules[mod]

        # Mock flask
        self.mock_flask = MagicMock()
        self.mock_jsonify = MagicMock(side_effect=lambda x: x)
        self.mock_flask.jsonify = self.mock_jsonify

        # Mock Blueprint so we can just grab the registered route function
        self.route_handlers = {}
        class MockBlueprint:
            def __init__(self, name, import_name):
                self.name = name
            def route(self, rule, **options):
                def decorator(f):
                    # We need to access route_handlers from the outer scope, but class is a new scope
                    # so we assign it directly using self which won't work in a method without passing self
                    pass
                return decorator

        # Better way to mock blueprint route
        def mock_route_decorator(rule, **options):
            def decorator(f):
                self.route_handlers[f.__name__] = f
                return f
            return decorator

        mock_bp = MagicMock()
        mock_bp.route = mock_route_decorator
        self.mock_flask.Blueprint = MagicMock(return_value=mock_bp)

        sys.modules['flask'] = self.mock_flask

        # Mock db
        self.mock_db = MagicMock()
        self.mock_db.fetch_one = MagicMock(return_value={"artist_name": "Test Artist", "total_listen_seconds": 3600})
        self.mock_db.fetch_all = MagicMock(return_value=[])
        sys.modules['db'] = self.mock_db

        # Mock routes.songs
        self.mock_routes_songs = MagicMock()
        self.mock_routes_songs.enrich_song_metadata = MagicMock(return_value=[])
        sys.modules['routes.songs'] = self.mock_routes_songs

    def test_artist_stats_caching(self):
        # Clear the cache before the test
        from engine import cache
        cache.clear_all()

        # Reset mock call counts
        self.mock_db.fetch_one.reset_mock()
        self.mock_db.fetch_all.reset_mock()

        # Reload stats module to ensure it picks up the mocked cache properly if needed
        import routes.stats
        importlib.reload(routes.stats)
        get_artist_stats = self.route_handlers.get('get_artist_stats')

        # If it's not registered (e.g. mock missed it), fallback to module import
        if not get_artist_stats:
             get_artist_stats = routes.stats.get_artist_stats

        artist_id = 123

        # First call: cache miss, should execute DB queries
        response, status = get_artist_stats(artist_id)

        # Verify db.fetch_one was called at least once (for stats)
        self.assertGreater(self.mock_db.fetch_one.call_count, 0)

        # Record call count
        fetch_one_calls = self.mock_db.fetch_one.call_count
        fetch_all_calls = self.mock_db.fetch_all.call_count

        # Second call: cache hit, should not execute DB queries
        response2, status2 = get_artist_stats(artist_id)

        # Call count should not increase
        self.assertEqual(self.mock_db.fetch_one.call_count, fetch_one_calls)
        self.assertEqual(self.mock_db.fetch_all.call_count, fetch_all_calls)

        # Status code should be 200
        self.assertEqual(status, 200)
        self.assertEqual(status2, 200)

        # Response should be the same
        self.assertEqual(response, response2)

        # Verify it's actually in the cache
        cached_data = cache.get(f"artist_stats_{artist_id}")
        self.assertIsNotNone(cached_data)
        self.assertEqual(cached_data['stats']['artist_name'], "Test Artist")

    def tearDown(self):
        # Clean up sys.modules so it doesn't poison other tests that might run after
        for mod in ['flask', 'db', 'routes.songs']:
            if mod in sys.modules:
                del sys.modules[mod]
            if mod in self.original_modules:
                sys.modules[mod] = self.original_modules[mod]

if __name__ == '__main__':
    unittest.main()
