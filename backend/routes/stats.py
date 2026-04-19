from flask import Blueprint, jsonify, request
from db import fetch_all, fetch_one, execute_query, get_connection
from routes.songs import enrich_song_metadata

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/listener/<int:user_id>', methods=['GET'])
def get_listener_stats(user_id):
    """Spotify Wrapped-style analytics for a listener"""
    # Main stats (inline query — replaces listener_stats_view for TiDB compatibility)
    stats = fetch_one("""
        SELECT
            u.user_id,
            u.username,
            COUNT(st.stream_id) AS total_streams,
            COALESCE(SUM(st.listen_duration), 0) AS total_listen_seconds,
            COUNT(DISTINCT st.song_id) AS unique_songs,
            COUNT(DISTINCT s.artist_id) AS unique_artists,
            COUNT(DISTINCT s.genre) AS unique_genres,
            (SELECT COUNT(*) FROM user_liked_songs ls WHERE ls.user_id = u.user_id) AS liked_count,
            (SELECT COUNT(*) FROM liked_playlists lp WHERE lp.user_id = u.user_id) AS liked_playlists_count
        FROM users u
        LEFT JOIN streams st ON u.user_id = st.user_id
        LEFT JOIN songs s ON st.song_id = s.song_id
        WHERE u.user_id = %s
        GROUP BY u.user_id
    """, (user_id,))

    # Fetch top_artist and top_song separately (avoids correlated subqueries)
    top_artist_row = fetch_one("""
        SELECT u2.username AS top_artist FROM streams st2
        JOIN songs s2 ON st2.song_id = s2.song_id
        JOIN artist_profiles ap2 ON s2.artist_id = ap2.artist_id
        JOIN users u2 ON ap2.user_id = u2.user_id
        WHERE st2.user_id = %s
        GROUP BY u2.user_id ORDER BY COUNT(*) DESC LIMIT 1
    """, (user_id,))
    top_song_row = fetch_one("""
        SELECT s2.title AS top_song FROM streams st2
        JOIN songs s2 ON st2.song_id = s2.song_id
        WHERE st2.user_id = %s
        GROUP BY s2.song_id ORDER BY COUNT(*) DESC LIMIT 1
    """, (user_id,))
    if not stats:
        return jsonify({"error": "User not found"}), 404
        
    # Get unique languages count manually since view doesn't have it
    language_stats = fetch_one("SELECT COUNT(DISTINCT s.language) as unique_languages FROM streams st JOIN songs s ON st.song_id = s.song_id WHERE st.user_id = %s AND s.language IS NOT NULL", (user_id,))
    unique_languages = language_stats['unique_languages'] if language_stats else 0

    # Top 5 most played songs
    top_songs = fetch_all("""
        SELECT s.song_id, s.title, s.cover_image_url, s.genre, s.duration,
               u.username AS artist_name, COUNT(st.stream_id) AS play_count
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        JOIN artist_profiles ap ON s.artist_id = ap.artist_id
        JOIN users u ON ap.user_id = u.user_id
        WHERE st.user_id = %s
        GROUP BY s.song_id
        ORDER BY play_count DESC
        LIMIT 5
    """, (user_id,))

    # Top genres (real genres)
    top_genres = fetch_all("""
        SELECT s.genre, COUNT(*) AS listen_count
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        WHERE st.user_id = %s AND s.genre IS NOT NULL AND s.genre != '' AND s.genre != 'Unknown'
        GROUP BY s.genre
        ORDER BY listen_count DESC
        LIMIT 5
    """, (user_id,))
    
    # Top languages
    top_languages = fetch_all("""
        SELECT s.language, COUNT(*) AS listen_count
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        WHERE st.user_id = %s AND s.language IS NOT NULL AND s.language != '' AND s.language != 'Unknown'
        GROUP BY s.language
        ORDER BY listen_count DESC
        LIMIT 5
    """, (user_id,))

    # Listening activity by hour
    hourly_activity = fetch_all("""
        SELECT HOUR(st.streamed_at) AS listen_hour, COUNT(*) AS stream_count
        FROM streams st
        WHERE st.user_id = %s
        GROUP BY listen_hour
        ORDER BY listen_hour
    """, (user_id,))

    # Format listen time
    total_seconds = stats.get('total_listen_seconds', 0) or 0
    hours = int(total_seconds // 3600)
    minutes = int((total_seconds % 3600) // 60)

    return jsonify({
        "stats": {
            "total_streams": stats.get('total_streams', 0),
            "total_listen_time": f"{hours}h {minutes}m",
            "total_listen_seconds": total_seconds,
            "unique_songs": stats.get('unique_songs', 0),
            "unique_artists": stats.get('unique_artists', 0),
            "unique_genres": stats.get('unique_genres', 0),
            "unique_languages": unique_languages,
            "top_genre": top_genres[0]['genre'] if top_genres else '--',
            "top_language": top_languages[0]['language'] if top_languages else '--',
            "top_artist": top_artist_row.get('top_artist') if top_artist_row else None,
            "top_song": top_song_row.get('top_song') if top_song_row else None,
            "liked_count": stats.get('liked_count', 0),
            "liked_playlists_count": stats.get('liked_playlists_count', 0)
        },
        "top_songs": enrich_song_metadata(top_songs),
        "top_genres": top_genres,
        "top_languages": top_languages,
        "hourly_activity": hourly_activity
    }), 200


@stats_bp.route('/artist/<int:artist_id>', methods=['GET'])
def get_artist_stats(artist_id):
    """Comprehensive artist analytics dashboard — maximum insights."""
    # Main stats (inline query — replaces artist_stats_view for TiDB compatibility)
    stats = fetch_one("""
        SELECT
            ap.artist_id,
            u.username AS artist_name,
            u.avatar_url AS artist_image,
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
            (SELECT s2.cover_image_url FROM songs s2
             JOIN song_artists sa2 ON s2.song_id = sa2.song_id
             WHERE sa2.artist_id = ap.artist_id
             ORDER BY s2.play_count DESC LIMIT 1) AS top_song_cover,
            (SELECT MAX(s2.play_count) FROM songs s2
             JOIN song_artists sa2 ON s2.song_id = sa2.song_id
             WHERE sa2.artist_id = ap.artist_id) AS top_song_plays,
            (SELECT COUNT(*) FROM follows f WHERE f.followed_artist_id = ap.artist_id) AS follower_count
        FROM artist_profiles ap
        JOIN users u ON ap.user_id = u.user_id
        LEFT JOIN song_artists sa ON ap.artist_id = sa.artist_id
        LEFT JOIN songs s ON sa.song_id = s.song_id
        LEFT JOIN streams st ON st.song_id = s.song_id
        WHERE ap.artist_id = %s
        GROUP BY ap.artist_id
    """, (artist_id,))
    if not stats:
        return jsonify({"error": "Artist not found"}), 404

    # ── Daily streams (last 30 days) ──────────────────────────
    daily_streams = fetch_all("""
        SELECT DATE(st.streamed_at) AS stream_date, COUNT(*) AS daily_streams
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        JOIN song_artists sa ON s.song_id = sa.song_id
        WHERE sa.artist_id = %s
          AND st.streamed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY stream_date
        ORDER BY stream_date ASC
    """, (artist_id,))

    # ── All songs ranked by performance ───────────────────────
    top_songs = fetch_all("""
        SELECT s.song_id, s.title, s.cover_image_url, s.play_count, s.duration,
               s.genre, s.language
        FROM songs s
        JOIN song_artists sa ON s.song_id = sa.song_id
        WHERE sa.artist_id = %s
        ORDER BY s.play_count DESC
    """, (artist_id,))

    # ── Peak listening hours (0-23) ───────────────────────────
    hourly_activity = fetch_all("""
        SELECT HOUR(st.streamed_at) AS listen_hour, COUNT(*) AS stream_count
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        JOIN song_artists sa ON s.song_id = sa.song_id
        WHERE sa.artist_id = %s
        GROUP BY listen_hour
        ORDER BY listen_hour
    """, (artist_id,))

    # ── Peak listening days (1=Sun, 7=Sat) ────────────────────
    daily_activity = fetch_all("""
        SELECT DAYOFWEEK(st.streamed_at) AS day_of_week, COUNT(*) AS stream_count
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        JOIN song_artists sa ON s.song_id = sa.song_id
        WHERE sa.artist_id = %s
        GROUP BY day_of_week
        ORDER BY day_of_week
    """, (artist_id,))

    # ── Gender breakdown of listeners ─────────────────────────
    gender_breakdown = fetch_all("""
        SELECT u.gender, COUNT(DISTINCT u.user_id) AS listener_count
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        JOIN song_artists sa ON s.song_id = sa.song_id
        JOIN users u ON st.user_id = u.user_id
        WHERE sa.artist_id = %s AND u.gender IS NOT NULL
        GROUP BY u.gender
        ORDER BY listener_count DESC
    """, (artist_id,))

    # ── Age distribution of listeners ─────────────────────────
    age_distribution = fetch_all("""
        SELECT
            CASE
                WHEN TIMESTAMPDIFF(YEAR, u.dob, CURDATE()) < 18 THEN 'Under 18'
                WHEN TIMESTAMPDIFF(YEAR, u.dob, CURDATE()) BETWEEN 18 AND 24 THEN '18-24'
                WHEN TIMESTAMPDIFF(YEAR, u.dob, CURDATE()) BETWEEN 25 AND 34 THEN '25-34'
                WHEN TIMESTAMPDIFF(YEAR, u.dob, CURDATE()) BETWEEN 35 AND 44 THEN '35-44'
                WHEN TIMESTAMPDIFF(YEAR, u.dob, CURDATE()) >= 45 THEN '45+'
                ELSE 'Unknown'
            END AS age_group,
            COUNT(DISTINCT u.user_id) AS listener_count
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        JOIN song_artists sa ON s.song_id = sa.song_id
        JOIN users u ON st.user_id = u.user_id
        WHERE sa.artist_id = %s AND u.dob IS NOT NULL
        GROUP BY age_group
        ORDER BY listener_count DESC
    """, (artist_id,))

    # ── Superfan (top listener) ───────────────────────────────
    superfan = fetch_one("""
        SELECT u.user_id, u.username, u.avatar_url, COUNT(*) AS stream_count
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        JOIN song_artists sa ON s.song_id = sa.song_id
        JOIN users u ON st.user_id = u.user_id
        WHERE sa.artist_id = %s AND u.user_id IS NOT NULL
        GROUP BY u.user_id
        ORDER BY stream_count DESC
        LIMIT 1
    """, (artist_id,))

    # ── Streaming quality preferences of listeners ────────────
    quality_preferences = fetch_all("""
        SELECT u.streaming_quality AS quality, COUNT(DISTINCT u.user_id) AS listener_count
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        JOIN song_artists sa ON s.song_id = sa.song_id
        JOIN users u ON st.user_id = u.user_id
        WHERE sa.artist_id = %s AND u.streaming_quality IS NOT NULL
        GROUP BY u.streaming_quality
        ORDER BY listener_count DESC
    """, (artist_id,))

    # ── Total listen time generated (seconds) ─────────────────
    listen_time = fetch_one("""
        SELECT COALESCE(SUM(st.listen_duration), 0) AS total_listen_seconds,
               COUNT(*) AS total_streams
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        JOIN song_artists sa ON s.song_id = sa.song_id
        WHERE sa.artist_id = %s
    """, (artist_id,))

    # ── Listener retention / completion rate ──────────────────
    retention = fetch_one("""
        SELECT ROUND(
            AVG(CASE WHEN s.duration > 0 THEN LEAST(st.listen_duration * 100.0 / s.duration, 100) ELSE 0 END),
            1
        ) AS avg_completion_pct
        FROM streams st
        JOIN songs s ON st.song_id = s.song_id
        JOIN song_artists sa ON s.song_id = sa.song_id
        WHERE sa.artist_id = %s AND st.listen_duration IS NOT NULL AND st.listen_duration > 0
    """, (artist_id,))

    # ── Genre distribution of catalog ─────────────────────────
    genre_distribution = fetch_all("""
        SELECT s.genre, COUNT(*) AS song_count
        FROM songs s
        JOIN song_artists sa ON s.song_id = sa.song_id
        WHERE sa.artist_id = %s AND s.genre IS NOT NULL AND s.genre != ''
        GROUP BY s.genre
        ORDER BY song_count DESC
    """, (artist_id,))

    # ── Language distribution of catalog ──────────────────────
    language_distribution = fetch_all("""
        SELECT s.language, COUNT(*) AS song_count
        FROM songs s
        JOIN song_artists sa ON s.song_id = sa.song_id
        WHERE sa.artist_id = %s AND s.language IS NOT NULL AND s.language != ''
        GROUP BY s.language
        ORDER BY song_count DESC
    """, (artist_id,))

    # ── Recent followers with avatars ─────────────────────────
    recent_followers = fetch_all("""
        SELECT u.user_id, u.username, u.avatar_url, f.followed_at
        FROM follows f
        JOIN users u ON f.follower_id = u.user_id
        WHERE f.followed_artist_id = %s
        ORDER BY f.followed_at DESC
        LIMIT 10
    """, (artist_id,))

    # ── Follower growth (monthly buckets) ─────────────────────
    follower_growth = fetch_all("""
        SELECT DATE_FORMAT(f.followed_at, '%%Y-%%m') AS month, COUNT(*) AS new_followers
        FROM follows f
        WHERE f.followed_artist_id = %s
        GROUP BY month
        ORDER BY month ASC
    """, (artist_id,))

    # ── New vs Returning listeners (last 30 days) ─────────────
    new_vs_returning = fetch_one("""
        SELECT
            COUNT(DISTINCT CASE WHEN first_stream >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN user_id END) AS new_listeners,
            COUNT(DISTINCT CASE WHEN first_stream < DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN user_id END) AS returning_listeners
        FROM (
            SELECT st.user_id, MIN(st.streamed_at) AS first_stream
            FROM streams st
            JOIN songs s ON st.song_id = s.song_id
            JOIN song_artists sa ON s.song_id = sa.song_id
            WHERE sa.artist_id = %s AND st.user_id IS NOT NULL
            GROUP BY st.user_id
        ) listener_first
    """, (artist_id,))

    # ── Serialize all date fields ─────────────────────────────
    def serialize_dates(rows, *keys):
        for row in rows:
            for k in keys:
                if row.get(k):
                    row[k] = str(row[k])

    serialize_dates(daily_streams, 'stream_date')
    serialize_dates(recent_followers, 'followed_at')
    serialize_dates(follower_growth, 'month')

    # ── Compute derived stats ─────────────────────────────────
    total_listen_secs = listen_time.get('total_listen_seconds', 0) if listen_time else 0
    total_streams = listen_time.get('total_streams', 0) if listen_time else 0
    listen_hours = round(total_listen_secs / 3600, 1) if total_listen_secs else 0

    return jsonify({
        "stats": {
            "artist_name": stats.get('artist_name'),
            "artist_image": stats.get('artist_image'),
            "total_songs": stats.get('total_songs', 0),
            "total_plays": stats.get('total_plays', 0),
            "total_streams": total_streams,
            "unique_listeners": stats.get('unique_listeners', 0),
            "avg_plays_per_song": float(stats.get('avg_plays_per_song', 0)),
            "top_song_title": stats.get('top_song_title'),
            "top_song_cover": stats.get('top_song_cover'),
            "top_song_plays": stats.get('top_song_plays', 0),
            "follower_count": stats.get('follower_count', 0),
            "verified": bool(stats.get('verified')),
            "total_listen_hours": listen_hours,
            "avg_completion_pct": float(retention.get('avg_completion_pct', 0) or 0) if retention else 0
        },
        "daily_streams": daily_streams,
        "top_songs": top_songs,
        "hourly_activity": hourly_activity,
        "daily_activity": daily_activity,
        "gender_breakdown": gender_breakdown,
        "age_distribution": age_distribution,
        "superfan": {
            "username": superfan.get('username'),
            "avatar_url": superfan.get('avatar_url'),
            "stream_count": superfan.get('stream_count', 0)
        } if superfan else None,
        "quality_preferences": quality_preferences,
        "genre_distribution": genre_distribution,
        "language_distribution": language_distribution,
        "recent_followers": recent_followers,
        "follower_growth": follower_growth,
        "new_vs_returning": {
            "new_listeners": new_vs_returning.get('new_listeners', 0) if new_vs_returning else 0,
            "returning_listeners": new_vs_returning.get('returning_listeners', 0) if new_vs_returning else 0
        }
    }), 200


@stats_bp.route('/trending', methods=['GET'])
def get_trending():
    """Trending songs based on recent play activity"""
    # Inline trending query (replaces trending_songs_view for TiDB compatibility)
    trending = fetch_all("""
        SELECT
            s.song_id, s.title, s.audio_url, s.cover_image_url, s.duration, s.genre,
            s.play_count AS total_plays, s.artist_id,
            COUNT(st.stream_id) AS recent_plays
        FROM songs s
        LEFT JOIN streams st ON s.song_id = st.song_id
            AND st.streamed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY s.song_id
        HAVING recent_plays > 0
        ORDER BY recent_plays DESC
        LIMIT 20
    """)
    return jsonify({"songs": enrich_song_metadata(trending)}), 200


@stats_bp.route('/platform', methods=['GET'])
def get_platform_stats():
    """Admin-level platform overview"""
    stats = fetch_one("SELECT * FROM platform_stats_view")

    # Daily streams for last 30 days
    daily_streams = fetch_all("""
        SELECT DATE(streamed_at) AS stream_date, COUNT(*) AS daily_streams
        FROM streams
        WHERE streamed_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY stream_date
        ORDER BY stream_date ASC
    """)

    # Top 5 artists
    top_artists = fetch_all("""
        SELECT u.username AS artist_name, ap.artist_id, ap.verified,
               SUM(s.play_count) AS total_plays,
               COUNT(DISTINCT sa.song_id) AS song_count
        FROM artist_profiles ap
        JOIN users u ON ap.user_id = u.user_id
        JOIN song_artists sa ON ap.artist_id = sa.artist_id
        JOIN songs s ON sa.song_id = s.song_id
        GROUP BY ap.artist_id
        ORDER BY total_plays DESC
        LIMIT 5
    """)

    # User role distribution
    role_distribution = fetch_all("SELECT role, COUNT(*) AS count FROM users GROUP BY role")

    # Serialize dates
    for row in daily_streams:
        if row.get('stream_date'):
            row['stream_date'] = str(row['stream_date'])

    return jsonify({
        "stats": {
            "total_users": stats.get('total_users', 0) if stats else 0,
            "total_artists": stats.get('total_artists', 0) if stats else 0,
            "total_listeners": stats.get('total_listeners', 0) if stats else 0,
            "total_songs": stats.get('total_songs', 0) if stats else 0,
            "total_streams": stats.get('total_streams', 0) if stats else 0,
            "total_playlists": stats.get('total_playlists', 0) if stats else 0,
            "streams_today": stats.get('streams_today', 0) if stats else 0,
            "streams_this_week": stats.get('streams_this_week', 0) if stats else 0,
            "streams_this_month": stats.get('streams_this_month', 0) if stats else 0,
            "new_users_this_week": stats.get('new_users_this_week', 0) if stats else 0,
            "most_popular_song": stats.get('most_popular_song') if stats else None,
            "most_popular_song_plays": stats.get('most_popular_song_plays', 0) if stats else 0,
            "most_active_user": stats.get('most_active_user') if stats else None
        },
        "daily_streams": daily_streams,
        "top_artists": top_artists,
        "role_distribution": role_distribution
    }), 200


# ============================================
# Follow / Unfollow Endpoints
# ============================================

@stats_bp.route('/follow/<int:artist_id>', methods=['POST'])
def toggle_follow(artist_id):
    """Toggle follow/unfollow an artist"""
    data = request.json
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    existing = fetch_one(
        "SELECT * FROM follows WHERE follower_id = %s AND followed_artist_id = %s",
        (user_id, artist_id)
    )

    if existing:
        execute_query(
            "DELETE FROM follows WHERE follower_id = %s AND followed_artist_id = %s",
            (user_id, artist_id)
        )
        return jsonify({"following": False, "message": "Unfollowed artist"}), 200
    else:
        execute_query(
            "INSERT INTO follows (follower_id, followed_artist_id) VALUES (%s, %s)",
            (user_id, artist_id)
        )
        return jsonify({"following": True, "message": "Following artist"}), 201


@stats_bp.route('/following/<int:user_id>', methods=['GET'])
def get_following(user_id):
    """Get list of artists a user follows"""
    following = fetch_all("""
        SELECT ap.artist_id, u.username AS artist_name, u.avatar_url, ap.verified
        FROM follows f
        JOIN artist_profiles ap ON f.followed_artist_id = ap.artist_id
        JOIN users u ON ap.user_id = u.user_id
        WHERE f.follower_id = %s
        ORDER BY f.followed_at DESC
    """, (user_id,))
    return jsonify({"following": following}), 200


@stats_bp.route('/is_following/<int:artist_id>/<int:user_id>', methods=['GET'])
def check_following(artist_id, user_id):
    """Check if a user follows a specific artist"""
    result = fetch_one(
        "SELECT * FROM follows WHERE follower_id = %s AND followed_artist_id = %s",
        (user_id, artist_id)
    )
    return jsonify({"following": result is not None}), 200
