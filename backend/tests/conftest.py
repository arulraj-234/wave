import pytest
import os
import sys

# Add backend directory to Python path for testing
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app as flask_app

@pytest.fixture
def app():
    flask_app.config.update({
        "TESTING": True,
    })
    yield flask_app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def mock_db(mocker):
    """
    Mock the database module to prevent tests from mutating the actual database.
    """
    mock_execute = mocker.patch('db.execute_query', return_value=1)
    mock_fetch_one = mocker.patch('db.fetch_one', return_value=None)
    mock_fetch_all = mocker.patch('db.fetch_all', return_value=[])
    
    return {
        'execute': mock_execute,
        'fetch_one': mock_fetch_one,
        'fetch_all': mock_fetch_all
    }
