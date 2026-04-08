-- Add active_session column for concurrent session management
ALTER TABLE users ADD COLUMN active_session VARCHAR(64) DEFAULT NULL;
