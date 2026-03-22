import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, Play, Pause, Heart, Plus, ListPlus } from 'lucide-react';
import { PlayerContext } from '../context/PlayerContext';

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

  return (
    <div 
      className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer ${isActive ? 'bg-brand-primary/[0.06] border border-brand-primary/10' : 'hover:bg-white/[0.02] border border-transparent'}`}
      onClick={() => playSong(song)}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-12 h-12 bg-brand-dark rounded-lg overflow-hidden shadow-sm shrink-0 relative group/cover">
          {song.cover_image_url ? (
            <img src={resolveUrl(song.cover_image_url)} alt="cover" className="w-full h-full object-cover"/>
          ) : (
            <Music className="w-5 h-5 m-auto mt-3.5 text-brand-muted" />
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
        
        <button 
          onClick={(e) => { e.stopPropagation(); toggleLike(song.song_id); }}
          className={`p-2 rounded-full transition-all duration-200 ${isLiked ? 'text-brand-primary' : 'text-brand-muted opacity-0 group-hover:opacity-100'}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowPlaylistMenu(!showPlaylistMenu); }}
            className="p-2 rounded-full text-brand-muted opacity-0 group-hover:opacity-100 hover:text-brand-primary transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
          </button>

          {showPlaylistMenu && (
            <div 
              className="absolute bottom-full right-0 mb-2 w-48 bg-brand-surface border border-white/[0.05] shadow-2xl rounded-xl z-50 py-2 animate-in fade-in"
              onMouseLeave={() => setShowPlaylistMenu(false)}
            >
              {/* Add to Queue */}
              <button
                className="w-full text-left px-4 py-2 text-sm text-brand-primary/80 hover:bg-white/[0.03] hover:text-brand-primary transition-colors flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  addToQueue(song);
                  setShowPlaylistMenu(false);
                }}
              >
                <ListPlus className="w-3.5 h-3.5" />
                Add to Queue
              </button>
              <div className="border-t border-white/[0.04] my-1" />
              <div className="px-4 py-2 text-xs font-semibold text-brand-muted uppercase tracking-wider">Add to Playlist</div>
              {playlists.map(pl => (
                <button
                  key={pl.playlist_id}
                  className="w-full text-left px-4 py-2 text-sm text-brand-primary/80 hover:bg-white/[0.03] hover:text-brand-primary transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    addSongToPlaylist(pl.playlist_id, song.song_id);
                    setShowPlaylistMenu(false);
                  }}
                >
                  {pl.title}
                </button>
              ))}
              {playlists.length === 0 && (
                <div className="px-4 py-2 text-xs text-brand-muted italic">No playlists</div>
              )}
            </div>
          )}
        </div>
        
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
  );
};

export default SongCard;
