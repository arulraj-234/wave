import React, { useContext, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Music, Play, Pause, Heart, Plus, ListPlus } from 'lucide-react';
import { PlayerContext } from '../context/PlayerContext';
import { useToast } from '../context/ToastContext';
import SongContextMenu, { useLongPress } from './SongContextMenu';

const SongCard = ({ song }) => {
  const { 
    currentSong, isPlaying, 
    likedSongs, toggleLike, 
    playlists, addSongToPlaylist, addToQueue,
    playSong, resolveUrl
  } = useContext(PlayerContext);

  const isActive = currentSong?.song_id === song.song_id;
  const isLiked = likedSongs.has(song.song_id);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState(false);
  const toast = useToast();

  const handleLongPress = useCallback(() => {
    setContextMenu(true);
  }, []);

  const longPressHandlers = useLongPress(handleLongPress, 500);

  const handleLike = (e) => {
    e.stopPropagation();
    toggleLike(song.song_id);
    toast.success(isLiked ? 'Removed from liked songs' : 'Added to liked songs');
  };

  const handleAddToQueue = (e) => {
    e.stopPropagation();
    addToQueue(song);
    toast.success('Added to queue');
    setShowPlaylistMenu(false);
  };

  return (
    <>
      <div 
        className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer ${isActive ? 'bg-brand-primary/[0.06] border border-brand-primary/10' : 'hover:bg-white/[0.02] border border-transparent'}`}
        onClick={() => playSong(song)}
        {...longPressHandlers}
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-12 h-12 bg-brand-dark rounded-lg overflow-hidden shadow-sm shrink-0 relative">
            {song.cover_image_url ? (
              <img src={resolveUrl(song.cover_image_url)} alt="cover" className="w-full h-full object-cover"/>
            ) : (
              <Music className="w-5 h-5 m-auto mt-3.5 text-brand-muted" />
            )}
            {/* Playing indicator on cover */}
            {isActive && isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="flex gap-[2px] items-end h-3">
                  <div className="w-[3px] bg-brand-primary rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0ms' }} />
                  <div className="w-[3px] bg-brand-primary rounded-full animate-pulse" style={{ height: '100%', animationDelay: '200ms' }} />
                  <div className="w-[3px] bg-brand-primary rounded-full animate-pulse" style={{ height: '40%', animationDelay: '400ms' }} />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className={`text-sm font-semibold truncate ${isActive ? 'text-brand-primary' : 'text-brand-primary/90'}`}>
              {song.title}
            </span>
            <Link 
              to={`/dashboard/artist/${song.artist_id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-brand-muted truncate hover:text-brand-primary transition-colors"
            >
              {song.artist_name}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-4">
          <span className="text-xs text-brand-muted/60 font-medium mr-3 hidden sm:inline">
            {song.play_count || 0} plays
          </span>
          
          {/* Like button — min 44px touch target */}
          <button 
            onClick={handleLike}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${isLiked ? 'text-brand-primary' : 'text-brand-muted opacity-0 group-hover:opacity-100'}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          <button 
            onClick={handleAddToQueue}
            title="Add to Queue"
            className="w-10 h-10 flex items-center justify-center rounded-full text-brand-muted hover:text-brand-primary opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
          </button>
          
          {/* Play/Pause button — 44px touch target */}
          <div className={`transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} onClick={() => playSong(song)}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-brand-primary text-brand-dark' : 'bg-brand-surface text-brand-primary border border-white/[0.05]'}`}>
              {isActive && isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-1" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Long-press context menu */}
      <SongContextMenu 
        isOpen={contextMenu} 
        onClose={() => setContextMenu(false)} 
        song={song} 
      />
    </>
  );
};

export default SongCard;
