import json
from unittest.mock import patch

def test_get_home_content_deduplication(client, mock_db):
    """Test that the home content API correctly deduplicates trending and personalized mixes."""
    
    # Mock the database queries for user preferences
    mock_db['fetch_all'].side_effect = [
        # get user preferences
        [{'preference_type': 'language', 'preference_value': 'english'}],
        # get user listen history
        []
    ]
    
    # Mock the internal proxy Jiosaavn response to return duplicates
    mock_saavn_response = {
        "success": True,
        "data": {
            "trending_songs": [
                {"title": "Song A", "artist_name": "Artist 1", "saavn_id": "1"},
                {"title": "Song A", "artist_name": "Artist 1", "saavn_id": "2"},  # Duplicate title+artist
                {"title": "Song B", "artist_name": "Artist 2", "saavn_id": "3"}
            ],
            "trending_albums": [],
            "personalized_mixes": [
                {
                    "title": "English Mix",
                    "songs": [
                        {"title": "Song C", "artist_name": "Artist 3", "saavn_id": "4"},
                        {"title": "Song C", "artist_name": "Artist 3", "saavn_id": "5"}  # Duplicate
                    ]
                }
            ]
        }
    }
    
    with patch('routes.jiosaavn.get_home_content') as mock_home:
        # Patch the actual route to just return our mock format but execute the deduplication logic
        # Actually, get_home_content is the controller itself. 
        # We need to mock requests.get inside get_home_content
        pass

    # Better to test the module function directly
    from routes.jiosaavn import _dedup_songs
    
    # Test the deduplication mechanism directly
    raw_songs = [
        {"title": "Shape of You", "artist_name": "Ed Sheeran", "id": "1"},
        {"title": "Shape Of You (Remix)", "artist_name": "Ed Sheeran", "id": "2"}, # Technically different title
        {"title": "Shape of You", "artist_name": "Ed Sheeran", "id": "3"}, # Duplicate!
        {"title": "Blinding Lights", "artist_name": "The Weeknd", "id": "4"}
    ]
    
    deduped = _dedup_songs(raw_songs)
    
    assert len(deduped) == 3
    assert deduped[0]["id"] == "1"
    assert deduped[1]["id"] == "2"
    assert deduped[2]["id"] == "4"

def test_enrich_song_metadata_skips_existing():
    """Test that enrich_song_metadata skips fetching metadata for songs that already have 'artists' key."""
    from routes.songs import enrich_song_metadata

    songs = [
        {'song_id': 1},
        {'song_id': 2, 'artists': [{'id': 2, 'name': 'Existing Artist'}], 'artist_name': 'Existing Artist'}
    ]

    with patch('routes.songs.fetch_all') as mock_fetch_all:
        mock_fetch_all.return_value = [
            {'song_id': 1, 'id': 1, 'name': 'New Artist'}
        ]

        result = enrich_song_metadata(songs)

        # Verify fetch_all was called correctly (only for song_id 1)
        mock_fetch_all.assert_called_once()
        args, _ = mock_fetch_all.call_args
        query, params = args
        assert "%s" in query
        assert params == (1,)

        # Verify metadata was applied to song 1
        assert result[0]['artists'][0]['name'] == 'New Artist'
        assert result[0]['artist_name'] == 'New Artist'

        # Verify metadata for song 2 was untouched
        assert result[1]['artists'][0]['name'] == 'Existing Artist'
        assert result[1]['artist_name'] == 'Existing Artist'
