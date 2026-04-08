import json
import jwt

def test_register_missing_data(client, mock_db):
    """Test registration with missing fields fails gracefully."""
    response = client.post('/api/auth/register', json={
        "username": "testuser"
        # missing password, email
    })
    assert response.status_code == 400
    data = json.loads(response.data)
    assert "error" in data

def test_login_success(client, mock_db):
    """Test successful login yields JWT token."""
    from werkzeug.security import generate_password_hash
    
    mock_db['fetch_one'].return_value = {
        'user_id': 1,
        'username': 'testuser',
        'hashed_password': generate_password_hash('password123'),
        'role': 'listener',
        'email': 'test@test.com'
    }
    
    response = client.post('/api/auth/login', json={
        "username": "testuser",
        "password": "password123"
    })
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "token" in data
    assert data["user"]["username"] == "testuser"

def test_auth_me_valid_token(client, mock_db):
    """Test /auth/me correctly decodes the JWT and returns user."""
    from app import app
    token = jwt.encode({
        "user_id": 1,
        "username": "testuser",
        "role": "listener"
    }, app.config['SECRET_KEY'], algorithm="HS256")
    
    mock_db['fetch_one'].return_value = {
        'user_id': 1,
        'username': 'testuser',
        'email': 'test@test.com',
        'role': 'listener',
        'avatar_url': None,
        'first_name': 'Test',
        'last_name': 'User',
        'onboarding_completed': True
    }
    
    response = client.get('/api/auth/me', headers={
        "Authorization": f"Bearer {token}"
    })
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["success"] is True
    assert data["user"]["username"] == "testuser"
