import React, { useState, useRef, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ListPlus, Heart, Share2, UserPlus, Radio, X } from 'lucide-react';
import { PlayerContext } from '../context/PlayerContext';
import { useToast } from '../context/ToastContext';

const SongContextMenu = ({ isOpen, onClose, song, position }) => {
  const { addToQueue, toggleLike, likedSongs, playlists, addSongToPlaylist } = useContext(PlayerContext);
  const toast = useToast();
  const [showPlaylists, setShowPlaylists] = useState(false);

  if (!isOpen || !song) return null;

  const isLiked = likedSongs.has(song.song_id);

  const actions = [
    {
      icon: ListPlus,
      label: 'Add to Queue',
      onClick: () => { addToQueue(song); toast.success('Added to queue'); onClose(); }
    },
    {
      icon: Heart,
      label: isLiked ? 'Remove from Liked' : 'Like Song',
      onClick: () => { toggleLike(song.song_id || song.saavn_id); toast.success(isLiked ? 'Removed from liked songs' : 'Added to liked songs'); onClose(); },
      className: isLiked ? 'text-red-400' : ''
    },
    {
      icon: ListPlus,
      label: 'Add to Playlist',
      onClick: () => setShowPlaylists(true)
    },
    {
      icon: Share2,
      label: 'Share Song',
      onClick: async () => {
        try {
          if (navigator.share) {
            await navigator.share({ title: song.title, text: `Listen to ${song.title} by ${song.artist_name} on Wave`, url: window.location.href });
          } else {
            await navigator.clipboard.writeText(`🎵 ${song.title} - ${song.artist_name}`);
            toast.success('Copied to clipboard');
          }
        } catch { }
        onClose();
      }
    }
  ];

  return (
    <>
      <div className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="fixed bottom-0 left-0 right-0 z-[160] bg-brand-surface border-t border-white/10 rounded-t-3xl px-4 pt-4 pb-safe shadow-2xl"
      >
        {/* Song info header */}
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-dark shrink-0">
            {song.cover_image_url ? (
              <>
                {/* ⚡ Bolt: Added loading="lazy" for performance optimization to defer off-screen image loading */}
                <img src={song.cover_image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-muted"><Radio className="w-5 h-5" /></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm truncate text-brand-primary">{song.title}</div>
            <div className="text-xs text-brand-muted truncate">{song.artist_name}</div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-brand-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        {!showPlaylists ? (
          <div className="space-y-1 mb-4">
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/[0.04] transition-colors ${action.className || 'text-brand-primary'}`}
              >
                <action.icon className="w-5 h-5 text-brand-muted" />
                <span className="text-sm font-semibold">{action.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-1 mb-4">
            <button onClick={() => setShowPlaylists(false)} className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-2 px-4 flex items-center gap-1 hover:text-brand-primary">
              ← Back
            </button>
            {playlists?.length > 0 ? playlists.map(pl => (
              <button
                key={pl.playlist_id}
                onClick={() => {
                  addSongToPlaylist(pl.playlist_id, song.song_id || song.saavn_id);
                  toast.success(`Added to "${pl.title}"`);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.04] transition-colors text-brand-primary text-sm font-semibold"
              >
                <ListPlus className="w-4 h-4 text-brand-muted" />
                {pl.title}
              </button>
            )) : (
              <p className="text-center text-brand-muted text-sm py-4">No playlists yet</p>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
};

// Hook for long-press detection
export const useLongPress = (onLongPress, delay = 500) => {
  const timerRef = useRef(null);
  const isLongPressRef = useRef(false);

  const start = useCallback((e) => {
    isLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress(e);
    }, delay);
  }, [onLongPress, delay]);

  const stop = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return {
    onTouchStart: start,
    onTouchEnd: stop,
    onTouchMove: stop,
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
  };
};

export default SongContextMenu;
