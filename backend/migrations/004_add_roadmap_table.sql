CREATE TABLE IF NOT EXISTS roadmap_features (
    feature_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status ENUM('planned', 'in_progress', 'completed') DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seeding initial ideas
INSERT INTO roadmap_features (title, description, status) 
VALUES 
('Synced Lyrics Integration', 'Pull synced lyrics (.lrc format) during playback so users can sing along. Implement a sliding text UI in React that moves perfectly in time with the song''s audio scrubber.', 'planned'),
('AI-Generated "Smart Playlists"', 'Allow users to generate playlists using natural language prompts (e.g. "focus music for coding"). Use lightweight AI endpoint or smart SQL queries on genre/duration tags.', 'planned'),
('Admin & Artist Real-Time Analytics', 'Integrate Server-Sent Events (SSE) or WebSockets into the backend so that every time a user finishes a song, the Artist dashboard updates play counts instantly.', 'planned');
