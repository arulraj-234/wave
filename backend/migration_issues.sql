CREATE TABLE IF NOT EXISTS issues (
    issue_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    description TEXT NOT NULL,
    error_log TEXT,
    status ENUM('open', 'resolved') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE SET NULL
);
