-- =====================================================
-- Wave Music Platform — TiDB-Compatible Schema
-- Run this in the TiDB SQL Editor (Chat2Query or Web Shell)
-- =====================================================

-- NOTE: TiDB's web SQL editor does NOT support DELIMITER.
-- All stored procedures, triggers, and events have been removed.
-- Their logic is handled in the Python backend instead.

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
    avatar_url VARCHAR(255),
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
    banner_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS albums (
    album_id INT AUTO_INCREMENT PRIMARY KEY,
    artist_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    cover_image_url VARCHAR(255),
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
    audio_url VARCHAR(255),
    cover_image_url VARCHAR(255),
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
    cover_image_url VARCHAR(255),
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

-- Streams table (simplified — no partitioning for TiDB compatibility)
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

-- Many-to-Many: a song can have multiple artists
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

-- Liked playlists (was missing from original schema)
CREATE TABLE IF NOT EXISTS liked_playlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    saavn_playlist_id VARCHAR(100) NOT NULL,
    title VARCHAR(255),
    cover_image_url VARCHAR(500),
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_playlist (user_id, saavn_playlist_id)
);

-- =====================================================
-- SEED DATA: Default Admin Account
-- Email: admin@wave.com | Password: admin123
-- =====================================================
INSERT IGNORE INTO users (username, email, hashed_password, first_name, last_name, role)
VALUES ('admin', 'admin@wave.com', 'scrypt:32768:8:1$7ZpHQEOne9pzQYLe$96740143ebada23c57868f63d2f2801342626aeab4400c46c1bb506f99ff0386089e99920e24150481268b4f41ccb798bb6eb8ff759cfe09462f9cf7ef628b31', 'Admin', 'User', 'admin');

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================
CREATE INDEX idx_streams_user ON streams(user_id, streamed_at);
CREATE INDEX idx_streams_song ON streams(song_id, streamed_at);
CREATE INDEX idx_songs_artist ON songs(artist_id);
CREATE INDEX idx_follows_artist ON follows(followed_artist_id);
CREATE INDEX idx_liked_songs_user ON user_liked_songs(user_id);

-- =====================================================
-- ANALYTICAL VIEWS
-- =====================================================

-- Listener Stats: per-user streaming analytics
CREATE OR REPLACE VIEW listener_stats_view AS
SELECT
    u.user_id,
    u.username,
    COUNT(st.stream_id) AS total_streams,
    COALESCE(SUM(s.duration), 0) AS total_listen_seconds,
    COUNT(DISTINCT st.song_id) AS unique_songs,
    COUNT(DISTINCT s.artist_id) AS unique_artists,
    COUNT(DISTINCT s.genre) AS unique_genres,
    (SELECT s2.genre FROM streams st2
     JOIN songs s2 ON st2.song_id = s2.song_id
     WHERE st2.user_id = u.user_id AND s2.genre IS NOT NULL
     GROUP BY s2.genre ORDER BY COUNT(*) DESC LIMIT 1) AS top_genre,
    (SELECT u2.username FROM streams st2
     JOIN songs s2 ON st2.song_id = s2.song_id
     JOIN artist_profiles ap2 ON s2.artist_id = ap2.artist_id
     JOIN users u2 ON ap2.user_id = u2.user_id
     WHERE st2.user_id = u.user_id
     GROUP BY u2.user_id ORDER BY COUNT(*) DESC LIMIT 1) AS top_artist,
    (SELECT s2.title FROM streams st2
     JOIN songs s2 ON st2.song_id = s2.song_id
     WHERE st2.user_id = u.user_id
     GROUP BY s2.song_id ORDER BY COUNT(*) DESC LIMIT 1) AS top_song,
    (SELECT COUNT(*) FROM user_liked_songs ls WHERE ls.user_id = u.user_id) AS liked_count,
    (SELECT COUNT(*) FROM liked_playlists lp WHERE lp.user_id = u.user_id) AS liked_playlists_count
FROM users u
LEFT JOIN streams st ON u.user_id = st.user_id
LEFT JOIN songs s ON st.song_id = s.song_id
GROUP BY u.user_id;

-- Artist Stats: per-artist performance analytics
CREATE OR REPLACE VIEW artist_stats_view AS
SELECT
    ap.artist_id,
    u.username AS artist_name,
    ap.bio,
    ap.verified,
    COUNT(DISTINCT sa.song_id) AS total_songs,
    COALESCE(SUM(s.play_count), 0) AS total_plays,
    COUNT(DISTINCT st.user_id) AS unique_listeners,
    ROUND(COALESCE(AVG(s.play_count), 0), 1) AS avg_plays_per_song,
    (SELECT s2.title FROM songs s2
     JOIN song_artists sa2 ON s2.song_id = sa2.song_id
     WHERE sa2.artist_id = ap.artist_id
     ORDER BY s2.play_count DESC LIMIT 1) AS top_song_title,
    (SELECT MAX(s2.play_count) FROM songs s2
     JOIN song_artists sa2 ON s2.song_id = sa2.song_id
     WHERE sa2.artist_id = ap.artist_id) AS top_song_plays,
    (SELECT COUNT(*) FROM follows f WHERE f.followed_artist_id = ap.artist_id) AS follower_count
FROM artist_profiles ap
JOIN users u ON ap.user_id = u.user_id
LEFT JOIN song_artists sa ON ap.artist_id = sa.artist_id
LEFT JOIN songs s ON sa.song_id = s.song_id
LEFT JOIN streams st ON st.song_id = s.song_id
GROUP BY ap.artist_id;

-- Platform Stats: admin overview
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

-- Trending Songs: ranked by plays in last 7 days
CREATE OR REPLACE VIEW trending_songs_view AS
SELECT
    s.song_id,
    s.title,
    s.audio_url,
    s.cover_image_url,
    s.duration,
    s.genre,
    s.play_count AS total_plays,
    (SELECT GROUP_CONCAT(u2.username SEPARATOR ', ')
     FROM song_artists sa2
     JOIN artist_profiles ap2 ON sa2.artist_id = ap2.artist_id
     JOIN users u2 ON ap2.user_id = u2.user_id
     WHERE sa2.song_id = s.song_id) AS artist_name,
    s.artist_id,
    COUNT(st.stream_id) AS recent_plays,
    DENSE_RANK() OVER (ORDER BY COUNT(st.stream_id) DESC) AS trend_rank
FROM songs s
LEFT JOIN streams st ON s.song_id = st.song_id
    AND st.streamed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY s.song_id
HAVING recent_plays > 0
ORDER BY trend_rank ASC;
