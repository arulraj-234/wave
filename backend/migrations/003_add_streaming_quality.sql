-- Migration: Add streaming_quality column to users table
-- Target: MySQL / TiDB
-- Date: 2026-04-09

ALTER TABLE users 
ADD COLUMN streaming_quality ENUM('high', 'medium', 'low', 'extreme', 'auto') DEFAULT 'high' 
AFTER active_session;
