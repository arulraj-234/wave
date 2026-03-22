import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search as SearchIcon, Music, Play, Pause, Heart, Plus, Database, Loader2, Disc3, Headphones } from 'lucide-react';
import api from '../api';

import { PlayerContext } from '../context/PlayerContext';
import Skeleton, { SongSkeleton } from '../components/Skeleton';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localResults, setLocalResults] = useState([]);
  const [globalResults, setGlobalResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [importingId, setImportingId] = useState(null); 
  const { currentSong, isPlaying, likedSongs, toggleLike, playlists, addSongToPlaylist, playSong, resolveUrl } = useContext(PlayerContext);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'song', 'artist', 'album', 'playlist'

  const genres = [
    { name: 'Bollywood', color: 'bg-gradient-to-br from-orange-400 to-orange-600', icon: Music },
    { name: 'Pop', color: 'bg-gradient-to-br from-pink-500 to-pink-700', icon: Music },
    { name: 'Hip Hop', color: 'bg-gradient-to-br from-blue-500 to-blue-700', icon: Disc3 },
    { name: 'Electronic', color: 'bg-gradient-to-br from-purple-500 to-purple-700', icon: Headphones },
    { name: 'Romantic', color: 'bg-gradient-to-br from-red-400 to-red-600', icon: Heart },
    { name: 'Lofi', color: 'bg-gradient-to-br from-indigo-600 to-indigo-800', icon: Music },
    { name: 'Punjabi', color: 'bg-gradient-to-br from-green-500 to-green-700', icon: Music },
    { name: 'English', color: 'bg-gradient-to-br from-yellow-500 to-yellow-700', icon: Music }
  ];

  const performSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    try {
      // 1. Search Local
      const localResp = await api.get(`/api/songs/search`, { 
        params: { q: searchTerm, type: activeTab } 
      });
      
      // 2. Search Extended API
      const globalResp = await api.get(`/api/jiosaavn/search`, { 
        params: { query: searchTerm, type: activeTab } 
      });
      let locals = localResp.data.results || [];
      let globals = globalResp.data.results || [];

      // Unified Deduplication Logic
      if (activeTab === 'all') {
         if (locals.songs && globals.songs) {
            const localSaavnIds = new Set(locals.songs.map(s => s.saavn_id).filter(Boolean));
            globals.songs = globals.songs.filter(s => !localSaavnIds.has(s.saavn_id));
         }
         if (locals.artists && globals.artists) {
            const localSaavnIds = new Set(locals.artists.map(a => a.saavn_id || a.id).filter(Boolean));
            globals.artists = globals.artists.filter(a => !localSaavnIds.has(a.id));
         }
         if (locals.albums && globals.albums) {
            const localSaavnIds = new Set(locals.albums.map(a => a.saavn_id || a.id).filter(Boolean));
            globals.albums = globals.albums.filter(a => !localSaavnIds.has(a.id));
         }
         if (locals.playlists && globals.playlists) {
            const localSaavnIds = new Set(locals.playlists.map(p => p.saavn_playlist_id || p.id).filter(Boolean));
            globals.playlists = globals.playlists.filter(p => !localSaavnIds.has(p.id));
         }
      } else {
         const localSaavnIds = new Set(locals.map(item => item.saavn_id || item.id || item.saavn_playlist_id).filter(Boolean));
         globals = globals.filter(item => !localSaavnIds.has(item.saavn_id || item.id));
      }

      setLocalResults(locals);
      setGlobalResults(globals);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch();
      } else {
        setLocalResults([]);
        setGlobalResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, activeTab]);

  const handleGlobalPlay = async (saavnSong, songList = null) => {
    setImportingId(saavnSong.saavn_id);
    try {
      const res = await api.post('/api/jiosaavn/import', saavnSong);
      if (res.data.success) {
        const imported = res.data.song;
        const playable = {
          song_id: imported.song_id,
          saavn_id: saavnSong.saavn_id,
          title: imported.title,
          audio_url: imported.audio_url,
          cover_image_url: imported.cover_image_url,
          duration: imported.duration,
          artist_id: imported.artist_id,
          artist_name: imported.artist_name,
          artists: imported.artists,
        };
        playSong(playable, songList || [playable]);
      }
    } catch (err) {
      console.error("Import failed:", err);
    } finally {
      setImportingId(null);
    }
  };

  const renderSongsSection = (songs, title) => {
    if (!songs || songs.length === 0) return null;
    return (
      <div className="animate-slide-up">
        <h2 className="text-xl font-bold mb-4 tracking-tight text-white/90">{title}</h2>
        <div className="grid grid-cols-1 gap-1">
          {songs.map((song, idx) => {
            const isActive = currentSong?.song_id === song.song_id || (song.audio_url && currentSong?.audio_url === song.audio_url);
            const isImporting = importingId === song.saavn_id;
            return (
              <div 
                key={song.song_id || song.saavn_id || idx} 
                className={`flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.05] transition-all group border border-transparent hover:border-white/[0.02] ${isActive ? 'bg-white/[0.08]' : ''}`}
              >
                <div className="relative w-12 h-12 shrink-0 cursor-pointer rounded-md overflow-hidden" onClick={() => song.source === 'jiosaavn' ? handleGlobalPlay(song, songs) : playSong(song, songs)}>
                  <img src={song.source === 'local' ? resolveUrl(song.cover_image_url) : song.cover_image_url} alt="" className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {isImporting ? <Loader2 className="w-5 h-5 text-brand-primary animate-spin" /> : (isActive && isPlaying ? <Pause className="w-5 h-5 text-white fill-current" /> : <Play className="w-5 h-5 text-white fill-current" />)}
                  </div>
                </div>
                <div className="flex-1 min-w-0" onClick={() => song.source === 'jiosaavn' ? handleGlobalPlay(song, songs) : playSong(song, songs)}>
                  <div className={`font-semibold truncate text-sm ${isActive ? 'text-brand-primary' : 'text-white'}`}>{song.title}</div>
                  <div className="text-xs text-brand-muted truncate font-medium">{song.artist_name}</div>
                </div>
                {/* Removed Global badge to white-label results */}
                <div className="text-xs text-brand-muted font-medium w-10 text-right tabular-nums">{formatTime(song.duration)}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderArtistsSection = (artists, title) => {
    if (!artists || artists.length === 0) return null;
    return (
      <div className="animate-slide-up">
        <h2 className="text-xl font-bold mb-4 tracking-tight text-white/90">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {artists.map((artist, idx) => {
            const artistLink = artist.source === 'local' 
              ? `/dashboard/artist/${artist.id}` 
              : `/dashboard/artist/saavn_${artist.id}`;
            return (
              <Link 
                to={artistLink} 
                key={artist.id || idx}
                className="group bg-white/[0.02] hover:bg-white/[0.04] p-4 rounded-xl transition-all border border-white/[0.02] hover:border-white/[0.05]"
              >
                <div className="aspect-square rounded-full overflow-hidden mb-4 shadow-lg ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-500 bg-brand-surface">
                  {artist.image ? (
                    <img src={artist.source === 'local' ? resolveUrl(artist.image) : artist.image} alt={artist.name} className="w-full h-full object-cover" />
                  ) : (
                    <Music className="w-1/2 h-1/2 m-auto text-brand-muted opacity-30 h-full" />
                  )}
                </div>
                <div className="font-bold text-sm truncate text-center text-white/90 group-hover:text-brand-primary transition-colors">{artist.name}</div>
                <div className="text-[10px] text-brand-muted text-center mt-1 font-bold uppercase tracking-widest">Artist</div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAlbumsSection = (albums, title) => {
    if (!albums || albums.length === 0) return null;
    return (
      <div className="animate-slide-up">
        <h2 className="text-xl font-bold mb-4 tracking-tight text-white/90">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {albums.map((album, idx) => (
            <Link to={`/dashboard/album/saavn_${album.id}`} key={album.id || idx} className="group bg-white/[0.02] hover:bg-white/[0.04] p-4 rounded-xl transition-all border border-white/[0.02] hover:border-white/[0.05] cursor-pointer">
              <div className="aspect-square rounded-lg overflow-hidden mb-4 shadow-xl ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-500 bg-brand-surface">
                <img src={album.cover_image_url} alt={album.name} className="w-full h-full object-cover" />
              </div>
              <div className="font-bold text-sm truncate text-white">{album.name}</div>
              <div className="text-xs text-brand-muted truncate mt-1">{album.artist_name}</div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  const renderPlaylistsSection = (playlists, title) => {
    if (!playlists || playlists.length === 0) return null;
    return (
      <div className="animate-slide-up">
        <h2 className="text-xl font-bold mb-4 tracking-tight text-white/90">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {playlists.map((playlist, idx) => (
            <div key={playlist.id || idx} className="group bg-white/[0.02] hover:bg-white/[0.04] p-4 rounded-xl transition-all border border-white/[0.02] hover:border-white/[0.05] cursor-pointer">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-brand-surface to-brand-dark flex items-center justify-center mb-4 shadow-xl ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
                <Plus className="w-10 h-10 text-brand-muted/30" />
                {playlist.cover_image_url && <img src={playlist.cover_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />}
              </div>
              <div className="font-bold text-sm truncate text-white">{playlist.name}</div>
              <div className="text-xs text-brand-muted truncate mt-1">{playlist.song_count || 0} songs</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || seconds === 0 || seconds === '0') return "";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const hasResults = activeTab === 'all' 
    ? (localResults?.songs?.length > 0 || localResults?.artists?.length > 0 || globalResults?.songs?.length > 0 || globalResults?.artists?.length > 0)
    : (localResults?.length > 0 || globalResults?.length > 0);

  return (
    <div className="flex-1 overflow-y-auto bg-brand-dark p-8 pb-32 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-8 animate-slide-up">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-muted w-6 h-6" />
          <input 
            id="search-page-input"
            name="search-page-input"
            type="text" 
            placeholder="Search millions of songs..." 
            className="w-full bg-brand-surface border border-white/[0.02] rounded-full py-5 pl-16 pr-8 text-xl font-medium focus:ring-2 focus:ring-brand-accent/30 focus:bg-white/[0.03] outline-none transition-all shadow-sm placeholder-brand-muted text-brand-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        {/* Category Tabs */}
        {searchTerm && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'all', label: 'All', icon: SearchIcon },
              { id: 'song', label: 'Songs', icon: Music },
              { id: 'artist', label: 'Artists', icon: Disc3 },
              { id: 'album', label: 'Albums', icon: Database },
              { id: 'playlist', label: 'Playlists', icon: Plus },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-primary text-brand-dark shadow-lg scale-105' : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'}`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Searching State */}
        {isSearching && (
          <div className="space-y-4 animate-fade-in">
             <h2 className="text-xl font-bold mb-4">Searching...</h2>
             {[...Array(5)].map((_, i) => <SongSkeleton key={i} />)}
          </div>
        )}

        {/* No Results */}
        {!isSearching && searchTerm && !hasResults && (
          <div className="text-center py-32 rounded-2xl border-dashed border-white/[0.05] bg-brand-surface animate-fade-in">
            <SearchIcon className="w-20 h-20 mx-auto mb-6 text-brand-muted opacity-50" />
            <h3 className="text-2xl font-bold mb-3 text-brand-primary">No results found for "{searchTerm}"</h3>
            <p className="text-brand-muted max-w-md mx-auto">We couldn't find any songs matching your search across millions of tracks. Try adjusting your query.</p>
          </div>
        )}

        {/* Results Sections */}
        {!isSearching && searchTerm && (
          <div className="space-y-12">
            {activeTab === 'all' ? (
              <>
                {/* Unified Mix for "All" tab */}
                {renderSongsSection([...(localResults.songs || []), ...(globalResults.songs || [])].slice(0, 10), "Top Songs")}
                {renderArtistsSection([...(localResults.artists || []), ...(globalResults.artists || [])].slice(0, 8), "Artists")}
                {renderAlbumsSection(globalResults.albums || [], "Albums")}
                {renderPlaylistsSection([...(localResults.playlists || []), ...(globalResults.playlists || [])].slice(0, 8), "Playlists")}
              </>
            ) : activeTab === 'song' ? (
                renderSongsSection([...(Array.isArray(localResults) ? localResults : []), ...(Array.isArray(globalResults) ? globalResults : [])], "Songs")
            ) : activeTab === 'artist' ? (
                renderArtistsSection([...(Array.isArray(localResults) ? localResults : []), ...(Array.isArray(globalResults) ? globalResults : [])], "Artists")
            ) : activeTab === 'album' ? (
                renderAlbumsSection(Array.isArray(globalResults) ? globalResults : [], "Albums")
            ) : activeTab === 'playlist' ? (
                renderPlaylistsSection([...(Array.isArray(localResults) ? localResults : []), ...(Array.isArray(globalResults) ? globalResults : [])], "Playlists")
            ) : null}
          </div>
        )}

        {/* Browse Genres (empty state) */}
        {!searchTerm && (
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-bold mb-6 tracking-tight text-brand-primary">Browse all</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {genres.map(genre => (
                 <div 
                  key={genre.name}
                  onClick={() => setSearchTerm(genre.name)}
                  className={`aspect-square rounded-xl p-5 flex flex-col justify-between ${genre.color} hover:brightness-110 active:scale-95 transition-all cursor-pointer group relative overflow-hidden shadow-lg`}
                 >
                   <div className="text-xl font-black text-white relative z-10 tracking-tight leading-tight">{genre.name}</div>
                   
                   {/* Tilted Graphic (Spotify Style) */}
                   <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-white/10 rounded-lg group-hover:scale-110 transition-transform duration-500 rotate-[25deg] shadow-xl overflow-hidden flex items-center justify-center">
                      <genre.icon className="w-12 h-12 text-white/40 -rotate-[25deg]" />
                   </div>
                 </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
