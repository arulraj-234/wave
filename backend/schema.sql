-- =====================================================
-- Wave Music Platform — Universal Schema
-- Works on both MySQL and TiDB
-- =====================================================
-- All stored procedures, triggers, and events are handled
-- in the Python backend (routes/stats.py, etc.)
-- =====================================================

-- =====================================================
-- TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role ENUM('listener', 'artist', 'admin') DEFAULT 'listener',
    gender ENUM('male', 'female', 'non-binary', 'other', 'prefer_not_to_say') DEFAULT 'prefer_not_to_say',
    dob DATE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    avatar_url VARCHAR(2048),
    active_session VARCHAR(64) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_preferences (
    preference_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    preference_type ENUM('genre', 'language', 'artist') NOT NULL,
    preference_value VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_pref (user_id, preference_type, preference_value)
);

CREATE TABLE IF NOT EXISTS artist_profiles (
    artist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    bio TEXT,
    verified BOOLEAN DEFAULT FALSE,
    banner_url VARCHAR(2048),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS albums (
    album_id INT AUTO_INCREMENT PRIMARY KEY,
    artist_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    cover_image_url VARCHAR(2048),
    release_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artist_profiles(artist_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS songs (
    song_id INT AUTO_INCREMENT PRIMARY KEY,
    saavn_id VARCHAR(100) UNIQUE,
    artist_id INT NOT NULL,
    album_id INT,
    title VARCHAR(200) NOT NULL,
    audio_url VARCHAR(2048),
    cover_image_url VARCHAR(2048),
    duration INT DEFAULT 0,
    genre VARCHAR(100),
    language VARCHAR(100),
    play_count INT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INT NULL,
    FOREIGN KEY (artist_id) REFERENCES artist_profiles(artist_id) ON DELETE CASCADE,
    FOREIGN KEY (album_id) REFERENCES albums(album_id) ON DELETE SET NULL,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_songs_title (title),
    INDEX idx_songs_genre (genre)
);

CREATE TABLE IF NOT EXISTS playlists (
    playlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(2048),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS playlist_songs (
    playlist_id INT NOT NULL,
    song_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (playlist_id, song_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS streams (
    stream_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    song_id INT NOT NULL,
    streamed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    listen_duration INT
);

CREATE TABLE IF NOT EXISTS user_liked_songs (
    user_id INT NOT NULL,
    song_id INT NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, song_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS song_artists (
    song_id INT NOT NULL,
    artist_id INT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    role VARCHAR(50) DEFAULT 'primary',
    PRIMARY KEY (song_id, artist_id),
    FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artist_profiles(artist_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS follows (
    follower_id INT NOT NULL,
    followed_artist_id INT NOT NULL,
    followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, followed_artist_id),
    FOREIGN KEY (follower_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (followed_artist_id) REFERENCES artist_profiles(artist_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subscriptions (
    subscription_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_tier ENUM('free', 'premium', 'family') DEFAULT 'free',
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS liked_playlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    saavn_playlist_id VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    cover_image_url VARCHAR(2048),
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_playlist (user_id, saavn_playlist_id)
);

CREATE TABLE IF NOT EXISTS issues (
    issue_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    description TEXT NOT NULL,
    error_log TEXT,
    status ENUM('open', 'resolved') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- =====================================================
-- SEED DATA
-- =====================================================
INSERT IGNORE INTO users (username, email, hashed_password, first_name, last_name, role)
VALUES ('admin', 'admin@wave.com', 'scrypt:32768:8:1$7ZpHQEOne9pzQYLe$96740143ebada23c57868f63d2f2801342626aeab4400c46c1bb506f99ff0386089e99920e24150481268b4f41ccb798bb6eb8ff759cfe09462f9cf7ef628b31', 'Admin', 'User', 'admin');

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================
CREATE INDEX idx_streams_user ON streams(user_id, streamed_at);
CREATE INDEX idx_streams_song ON streams(song_id, streamed_at);
CREATE INDEX idx_songs_artist ON songs(artist_id);
CREATE INDEX idx_songs_saavn_id ON songs(saavn_id);
CREATE INDEX idx_follows_artist ON follows(followed_artist_id);
CREATE INDEX idx_liked_songs_user ON user_liked_songs(user_id);
CREATE INDEX idx_playlist_songs_playlist ON playlist_songs(playlist_id);

-- =====================================================
-- ANALYTICAL VIEWS
-- listener_stats_view, artist_stats_view, and trending_songs_view
-- are handled in Python (routes/stats.py) since TiDB doesn't
-- support correlated subqueries in VIEW definitions.
-- =====================================================
CREATE OR REPLACE VIEW platform_stats_view AS
SELECT
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM users WHERE role = 'artist') AS total_artists,
    (SELECT COUNT(*) FROM users WHERE role = 'listener') AS total_listeners,
    (SELECT COUNT(*) FROM songs) AS total_songs,
    (SELECT COUNT(*) FROM streams) AS total_streams,
    (SELECT COUNT(*) FROM playlists) AS total_playlists,
    (SELECT COUNT(*) FROM streams WHERE streamed_at >= CURDATE()) AS streams_today,
    (SELECT COUNT(*) FROM streams WHERE streamed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) AS streams_this_week,
    (SELECT COUNT(*) FROM streams WHERE streamed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) AS streams_this_month,
    (SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)) AS new_users_this_week,
    (SELECT s.title FROM songs s ORDER BY s.play_count DESC LIMIT 1) AS most_popular_song,
    (SELECT MAX(s.play_count) FROM songs s) AS most_popular_song_plays,
    (SELECT u.username FROM users u
     JOIN streams st ON u.user_id = st.user_id
     GROUP BY u.user_id ORDER BY COUNT(*) DESC LIMIT 1) AS most_active_user;
