"""
cache.py — Lightweight TTL-based in-memory cache.

No Redis dependency. Uses a simple dict with expiry timestamps.
Suitable for single-process Flask deployments (Render, Gunicorn with 1 worker).
"""

import time
import threading

_store = {}
_lock = threading.Lock()


def get(key):
    """Retrieve a cached value. Returns None if missing or expired."""
    with _lock:
        entry = _store.get(key)
        if entry is None:
            return None
        if time.time() > entry['expires_at']:
            del _store[key]
            return None
        return entry['value']


def set(key, value, ttl_seconds=900):
    """Store a value with a TTL (default 15 minutes)."""
    with _lock:
        _store[key] = {
            'value': value,
            'expires_at': time.time() + ttl_seconds
        }


def invalidate(key):
    """Remove a specific key from cache."""
    with _lock:
        _store.pop(key, None)


def invalidate_prefix(prefix):
    """Remove all keys starting with a given prefix."""
    with _lock:
        keys_to_remove = [k for k in _store if k.startswith(prefix)]
        for k in keys_to_remove:
            del _store[k]


def clear_all():
    """Flush the entire cache."""
    with _lock:
        _store.clear()


def stats():
    """Return cache statistics for monitoring."""
    with _lock:
        now = time.time()
        total = len(_store)
        expired = sum(1 for v in _store.values() if now > v['expires_at'])
        return {
            'total_keys': total,
            'expired_keys': expired,
            'active_keys': total - expired
        }
