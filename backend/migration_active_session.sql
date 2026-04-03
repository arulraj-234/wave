-- Run this in your TiDB editor to add session tracking support
ALTER TABLE users ADD COLUMN active_session VARCHAR(64) DEFAULT NULL;
