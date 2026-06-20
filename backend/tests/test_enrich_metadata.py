import unittest
from unittest.mock import MagicMock
import sys
import os
import importlib

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

class TestEnrichMetadata(unittest.TestCase):
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

        # Mock middleware
        self.mock_middleware = MagicMock()
        self.mock_middleware.token_required = lambda f: f
        self.mock_middleware.artist_required = lambda f: f
        sys.modules['middleware'] = self.mock_middleware

        sys.modules['mutagen'] = MagicMock()
        sys.modules['storage'] = MagicMock()

        mock_werkzeug = MagicMock()
        sys.modules['werkzeug'] = mock_werkzeug
        sys.modules['werkzeug.utils'] = mock_werkzeug

        sys.modules['requests'] = MagicMock()

        import engine.cache
        self.cache = engine.cache

        import routes.songs
        importlib.reload(routes.songs)
        self.songs = routes.songs

    def test_enrich_metadata_skips_already_enriched(self):
        # Setup mock db returns
        self.mock_fetch_all.return_value = []

        # First call - with songs that need enrichment
        songs = [{'song_id': 1}, {'song_id': 2}]
        self.songs.enrich_song_metadata(songs)
        self.assertTrue(self.mock_fetch_all.called)

        self.mock_fetch_all.reset_mock()

        # Second call - with songs that are already enriched
        songs_enriched = [
            {'song_id': 1, 'artist_name': 'Artist 1', 'artists': [{'id': 1, 'name': 'Artist 1'}]},
            {'song_id': 2, 'artist_name': 'Artist 2', 'artists': [{'id': 2, 'name': 'Artist 2'}]}
        ]
        self.songs.enrich_song_metadata(songs_enriched)
        self.mock_fetch_all.assert_not_called()

        # Mixed call
        songs_mixed = [
            {'song_id': 1, 'artist_name': 'Artist 1', 'artists': [{'id': 1, 'name': 'Artist 1'}]},
            {'song_id': 2}
        ]
        self.songs.enrich_song_metadata(songs_mixed)
        self.assertTrue(self.mock_fetch_all.called)

if __name__ == '__main__':
    unittest.main()
