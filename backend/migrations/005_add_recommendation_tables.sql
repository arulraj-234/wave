-- Track skip events for negative signal in recommendations
CREATE TABLE IF NOT EXISTS song_skips (
    skip_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    song_id INT NOT NULL,
    skipped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    skip_position INT DEFAULT 0,
    INDEX idx_skips_user (user_id),
    INDEX idx_skips_song (song_id)
);
