import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import unittest.mock as mock

class TestEnrichSongMetadata(unittest.TestCase):
    @mock.patch('routes.songs.fetch_all')
    def test_enrich_optimization(self, mock_fetch_all):
        from routes.songs import enrich_song_metadata

        songs = [
            {'song_id': 1},
            {'song_id': 2, 'artist_name': 'Known', 'artists': [{'id': 1, 'name': 'Known'}]},
            {'song_id': 3, 'artist_name': 'Already Has It', 'artists': [{'id': 5, 'name': 'Already Has It'}]}
        ]

        mock_fetch_all.return_value = [
            {'song_id': 1, 'id': 10, 'name': 'New Artist'}
        ]

        result = enrich_song_metadata(songs)

        # Verify fetch_all was called correctly
        self.assertEqual(mock_fetch_all.call_count, 1)
        args, kwargs = mock_fetch_all.call_args

        # Check that it only queried for song_id=1
        self.assertIn('%s', args[0])
        self.assertEqual(args[1], (1,))

        # Check result
        self.assertEqual(result[0]['artist_name'], 'New Artist')
        self.assertEqual(result[0]['artists'][0]['id'], 10)

        # Check others remain untouched
        self.assertEqual(result[1]['artist_name'], 'Known')
        self.assertEqual(result[2]['artist_name'], 'Already Has It')

if __name__ == '__main__':
    unittest.main()
