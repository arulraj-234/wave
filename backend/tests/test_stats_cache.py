import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app
from engine import cache

class TestStatsCache(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.testing = True
        self.client = self.app.test_client()
        cache.clear_all()

    @patch('routes.stats.fetch_one')
    @patch('routes.stats.fetch_all')
    def test_caching_behavior(self, mock_fetch_all, mock_fetch_one):
        # Setup mock db responses
        mock_fetch_one.return_value = {"artist_name": "Test Artist"}
        mock_fetch_all.return_value = []

        # Call the endpoint for the first time
        response1 = self.client.get('/api/stats/artist/1')

        # Check that DB was queried
        self.assertTrue(mock_fetch_one.called)

        # Reset DB call counts
        mock_fetch_one.reset_mock()
        mock_fetch_all.reset_mock()

        # Call the endpoint a second time
        response2 = self.client.get('/api/stats/artist/1')

        # DB should not be queried the second time
        self.assertFalse(mock_fetch_one.called)
        self.assertFalse(mock_fetch_all.called)

        # Results should be identical
        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response1.json, response2.json)

if __name__ == '__main__':
    unittest.main()
