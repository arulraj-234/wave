-- Migration: Expand URL columns from VARCHAR(255) to VARCHAR(2048)
-- JioSaavn CDN URLs with encrypted tokens regularly exceed 255 chars,
-- causing silent truncation and broken playback.
-- Run this on both local MySQL and TiDB production.

ALTER TABLE songs MODIFY COLUMN audio_url VARCHAR(2048);
ALTER TABLE songs MODIFY COLUMN cover_image_url VARCHAR(2048);
ALTER TABLE albums MODIFY COLUMN cover_image_url VARCHAR(2048);
ALTER TABLE users MODIFY COLUMN avatar_url VARCHAR(2048);
ALTER TABLE artist_profiles MODIFY COLUMN banner_url VARCHAR(2048);
ALTER TABLE playlists MODIFY COLUMN cover_image_url VARCHAR(2048);
ALTER TABLE liked_playlists MODIFY COLUMN cover_image_url VARCHAR(2048);
