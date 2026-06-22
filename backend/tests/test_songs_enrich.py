import unittest
from unittest.mock import patch, MagicMock

class TestEnrich(unittest.TestCase):
    @patch('routes.songs.fetch_all')
    def test_enrich_skips_existing(self, mock_fetch_all):
        import routes.songs as songs

        mock_fetch_all.return_value = []

        input_songs = [
            {'song_id': 1},
            {'song_id': 2, 'artists': [{'id': 99, 'name': 'Existing Artist'}], 'artist_name': 'Existing Artist'}
        ]

        result = songs.enrich_song_metadata(input_songs)

        call_args = mock_fetch_all.call_args
        self.assertIsNotNone(call_args)
        query = call_args[0][0]
        params = call_args[0][1]

        self.assertEqual(params, (1,))
        self.assertEqual(result[1]['artist_name'], 'Existing Artist')
