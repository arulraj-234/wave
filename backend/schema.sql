CREATE DATABASE IF NOT EXISTS test;
USE test;

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
    play_count INT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INT NULL,
    FOREIGN KEY (artist_id) REFERENCES artist_profiles(artist_id) ON DELETE CASCADE,
    FOREIGN KEY (album_id) REFERENCES albums(album_id) ON DELETE SET NULL,
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id) ON DELETE SET NULL,
    FULLTEXT INDEX ft_idx_songs (title, genre)
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

CREATE TABLE IF NOT EXISTS streams (
    stream_id INT AUTO_INCREMENT,
    user_id INT,
    song_id INT NOT NULL,
    streamed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    listen_duration INT,
    PRIMARY KEY (stream_id, streamed_at)
    -- Foreign keys are intentionally omitted as MySQL does not support FKs on Partitioned InnoDB Tables.
) PARTITION BY RANGE (UNIX_TIMESTAMP(streamed_at)) (
    PARTITION p2024 VALUES LESS THAN (UNIX_TIMESTAMP('2025-01-01 00:00:00')),
    PARTITION p2025 VALUES LESS THAN (UNIX_TIMESTAMP('2026-01-01 00:00:00')),
    PARTITION p2026 VALUES LESS THAN (UNIX_TIMESTAMP('2027-01-01 00:00:00')),
    PARTITION p_future VALUES LESS THAN MAXVALUE
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

-- =====================================================
-- SEED DATA: Default Admin Account (only if not exists)
-- Email: admin@wave.com | Password: admin123
-- =====================================================
INSERT IGNORE INTO users (username, email, hashed_password, first_name, last_name, role)
VALUES ('admin', 'admin@wave.com', 'scrypt:32768:8:1$7ZpHQEOne9pzQYLe$96740143ebada23c57868f63d2f2801342626aeab4400c46c1bb506f99ff0386089e99920e24150481268b4f41ccb798bb6eb8ff759cfe09462f9cf7ef628b31', 'Admin', 'User', 'admin');

-- =====================================================
-- PERFORMANCE INDEXES (wrapped in procedures to handle IF NOT EXISTS)
-- =====================================================
CREATE INDEX idx_streams_user ON streams(user_id, streamed_at);
CREATE INDEX idx_streams_song ON streams(song_id, streamed_at);
CREATE INDEX idx_songs_artist ON songs(artist_id);
CREATE INDEX idx_follows_artist ON follows(followed_artist_id);
CREATE INDEX idx_liked_songs_user ON user_liked_songs(user_id);

-- =====================================================
-- ANALYTICAL VIEWS (use CREATE OR REPLACE to be idempotent)
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

-- Trending Songs: ranked by plays in last 7 days using window function
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

-- =====================================================
-- STORED PROCEDURES (DROP + CREATE for idempotency)
-- =====================================================

DELIMITER //

DROP PROCEDURE IF EXISTS GetListenerWrapped //
CREATE PROCEDURE GetListenerWrapped(IN p_user_id INT)
BEGIN
    SELECT * FROM listener_stats_view WHERE user_id = p_user_id;

    SELECT s.song_id, s.title, s.cover_image_url, s.genre, s.duration,
           u.username AS artist_name, COUNT(st.stream_id) AS play_count
    FROM streams st
    JOIN songs s ON st.song_id = s.song_id
    JOIN artist_profiles ap ON s.artist_id = ap.artist_id
    JOIN users u ON ap.user_id = u.user_id
    WHERE st.user_id = p_user_id
    GROUP BY s.song_id
    ORDER BY play_count DESC
    LIMIT 5;

    SELECT s.genre, COUNT(*) AS listen_count
    FROM streams st
    JOIN songs s ON st.song_id = s.song_id
    WHERE st.user_id = p_user_id AND s.genre IS NOT NULL AND s.genre != ''
    GROUP BY s.genre
    ORDER BY listen_count DESC
    LIMIT 5;

    SELECT HOUR(st.streamed_at) AS listen_hour, COUNT(*) AS stream_count
    FROM streams st
    WHERE st.user_id = p_user_id
    GROUP BY listen_hour
    ORDER BY listen_hour;
END //

DROP PROCEDURE IF EXISTS GetArtistDashboard //
CREATE PROCEDURE GetArtistDashboard(IN p_artist_id INT)
BEGIN
    SELECT * FROM artist_stats_view WHERE artist_id = p_artist_id;

    SELECT s.song_id, s.title, s.cover_image_url, s.duration, s.genre,
           s.play_count, s.uploaded_at
    FROM songs s
    WHERE s.artist_id = p_artist_id
    ORDER BY s.play_count DESC;

    SELECT DATE(st.streamed_at) AS stream_date, COUNT(*) AS daily_streams
    FROM streams st
    JOIN songs s ON st.song_id = s.song_id
    WHERE s.artist_id = p_artist_id
      AND st.streamed_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY stream_date
    ORDER BY stream_date ASC;

    SELECT u.username, u.avatar_url, f.followed_at
    FROM follows f
    JOIN users u ON f.follower_id = u.user_id
    WHERE f.followed_artist_id = p_artist_id
    ORDER BY f.followed_at DESC
    LIMIT 10;
END //

DELIMITER ;

CREATE TABLE IF NOT EXISTS platform_stats_cache (
    id INT PRIMARY KEY DEFAULT 1,
    total_users INT,
    total_artists INT,
    total_listeners INT,
    total_songs INT,
    total_streams INT,
    total_playlists INT,
    streams_today INT,
    streams_this_week INT,
    streams_this_month INT,
    new_users_this_week INT,
    most_popular_song VARCHAR(200),
    most_popular_song_plays INT,
    most_active_user VARCHAR(50),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DELIMITER //

DROP PROCEDURE IF EXISTS GetPlatformHealth //
CREATE PROCEDURE GetPlatformHealth()
BEGIN
    DECLARE cache_count INT DEFAULT 0;
    SELECT COUNT(*) INTO cache_count FROM platform_stats_cache WHERE id = 1;
    
    IF cache_count = 0 THEN
        INSERT INTO platform_stats_cache (id, total_users, total_artists, total_listeners, total_songs, total_streams, total_playlists, streams_today, streams_this_week, streams_this_month, new_users_this_week, most_popular_song, most_popular_song_plays, most_active_user)
        SELECT 1, total_users, total_artists, total_listeners, total_songs, total_streams, total_playlists, streams_today, streams_this_week, streams_this_month, new_users_this_week, most_popular_song, most_popular_song_plays, most_active_user
        FROM platform_stats_view;
    END IF;

    SELECT * FROM platform_stats_cache WHERE id = 1;

    SELECT DATE(streamed_at) AS stream_date, COUNT(*) AS daily_streams
    FROM streams
    WHERE streamed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY stream_date
    ORDER BY stream_date ASC;

    SELECT u.username AS artist_name, ap.artist_id, ap.verified,
           SUM(s.play_count) AS total_plays,
           COUNT(DISTINCT s.song_id) AS song_count
    FROM artist_profiles ap
    JOIN users u ON ap.user_id = u.user_id
    JOIN songs s ON s.artist_id = ap.artist_id
    GROUP BY ap.artist_id
    ORDER BY total_plays DESC
    LIMIT 5;

    SELECT role, COUNT(*) AS count FROM users GROUP BY role;
END //

-- Event requires global event scheduler ON
DROP EVENT IF EXISTS refresh_platform_stats_event //
CREATE EVENT refresh_platform_stats_event
ON SCHEDULE EVERY 1 HOUR
DO
BEGIN
    DELETE FROM platform_stats_cache WHERE id = 1;
    INSERT INTO platform_stats_cache (id, total_users, total_artists, total_listeners, total_songs, total_streams, total_playlists, streams_today, streams_this_week, streams_this_month, new_users_this_week, most_popular_song, most_popular_song_plays, most_active_user)
    SELECT 1, total_users, total_artists, total_listeners, total_songs, total_streams, total_playlists, streams_today, streams_this_week, streams_this_month, new_users_this_week, most_popular_song, most_popular_song_plays, most_active_user
    FROM platform_stats_view;
END //

-- =====================================================
-- TRIGGERS (DROP + CREATE for idempotency)
-- =====================================================

DROP TRIGGER IF EXISTS after_stream_insert //
CREATE TRIGGER after_stream_insert
AFTER INSERT ON streams
FOR EACH ROW
BEGIN
    IF NEW.listen_duration >= 20 THEN
        UPDATE songs SET play_count = play_count + 1 WHERE song_id = NEW.song_id;
    END IF;
END //

DELIMITER ;
