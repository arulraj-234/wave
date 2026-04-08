import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { Home, Search as SearchIcon, Music, Play, Pause, SkipForward, SkipBack, Heart, Clock, TrendingUp, Headphones, Disc3, Users, BarChart3, ChevronLeft, ChevronRight, Loader2, Sparkles, Library, Plus } from 'lucide-react';
import api from '../api';
import { PlayerContext } from '../context/PlayerContext';
import Search from './Search';
import Skeleton, { SongSkeleton, CardSkeleton } from '../components/Skeleton';
import ListenerStats from './ListenerStats';
import Sidebar from '../components/Sidebar';
import BottomPlayer from '../components/BottomPlayer';
import SongCard from '../components/SongCard';
import MagicBento, { ParticleCard } from '../components/MagicBento';
import WaveLogo from '../components/Logo';
import ProfileSettingsModal from '../components/ProfileSettingsModal';

import HorizontalCarousel from '../components/HorizontalCarousel';
import SectionHeader from '../components/SectionHeader';
import ContentCard from '../components/ContentCard';
import QuickPickCard from '../components/QuickPickCard';
import VinylExpansionHeader from '../components/VinylExpansionHeader';
import TopThreeHeader from '../components/TopThreeHeader';



const Dashboard = ({ defaultView = 'home' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [songs, setSongs] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedSongsData, setLikedSongsData] = useState([]);
  const [playlistInfo, setPlaylistInfo] = useState(null);
  const [artistProfileData, setArtistProfileData] = useState(null);
  const [listenerStats, setListenerStats] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // New home page state
  const [homeContent, setHomeContent] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [importingId, setImportingId] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  // JioSaavn artist/album/playlist detail state
  const [saavnArtist, setSaavnArtist] = useState(null);
  const [saavnAlbum, setSaavnAlbum] = useState(null);
  const [saavnPlaylist, setSaavnPlaylist] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    currentSong, isPlaying, progress, duration, volume,
    likedSongs, toggleLike, 
    playlists, createPlaylist, addSongToPlaylist,
    likedPlaylists, fetchLikedPlaylists, toggleLikePlaylist,
    playSong, togglePlay, seek, setVolume,
    playNext, playPrevious, resolveUrl
  } = useContext(PlayerContext);

  // Determine current view from URL
  let currentView = 'home';
  if (location.pathname === '/search') currentView = 'search';
  else if (location.pathname === '/dashboard/library') currentView = 'library';
  else if (location.pathname === '/dashboard/stats') currentView = 'stats';
  else if (location.pathname.startsWith('/dashboard/playlist/')) currentView = 'playlist';
  else if (location.pathname.startsWith('/dashboard/saavn-playlist/')) currentView = 'saavn-playlist';
  else if (location.pathname.startsWith('/dashboard/album/saavn_')) currentView = 'saavn-album';
  else if (location.pathname.startsWith('/dashboard/artist/saavn_')) currentView = 'saavn-artist';
  else if (location.pathname.startsWith('/dashboard/artist/')) currentView = 'artist-profile';

  // Cache ref: skip re-fetching home data when switching tabs
  const hasLoadedHome = useRef(false);

  useEffect(() => {
    const loadContent = async () => {
      if (currentView === 'home') {
        if (hasLoadedHome.current) {
          // Data already loaded, don't show loading state or re-fetch  
          return;
        }
        setIsLoading(true);
        await Promise.all([
          fetchRecentSongs(),
          fetchTrending(),
          fetchHomeContent(),
          fetchRecommendations(),
          fetchFollowedArtists(),
        ]);
        hasLoadedHome.current = true;
      } else if (currentView === 'library') {
        setIsLoading(true);
        await fetchLikedSongs();
      } else if (currentView === 'playlist' && location.pathname.split('/').pop()) {
        setIsLoading(true);
        await fetchPlaylistSongs(location.pathname.split('/').pop());
      } else if (currentView === 'artist-profile' && location.pathname.split('/').pop()) {
        setIsLoading(true);
        await fetchArtistProfile(location.pathname.split('/').pop());
      } else if (currentView === 'saavn-artist') {
        setIsLoading(true);
        const saavnId = location.pathname.split('saavn_')[1];
        if (saavnId) await fetchSaavnArtist(saavnId);
      } else if (currentView === 'saavn-album') {
        setIsLoading(true);
        const saavnId = location.pathname.split('saavn_')[1];
        if (saavnId) await fetchSaavnAlbum(saavnId);
      } else if (currentView === 'saavn-playlist') {
        setIsLoading(true);
        const saavnId = location.pathname.split('/').pop();
        if (saavnId) await fetchSaavnPlaylist(saavnId);
      }
      setIsLoading(false);
    };

    loadContent();
  }, [currentView, location.pathname]);

  const fetchRecentSongs = async () => {
    try {
      const response = await api.get(`/api/songs/recent/${user.id}`);
      setRecentSongs(response.data.songs);
    } catch (error) {
      console.error("Error fetching recent songs:", error);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await api.get('/api/stats/trending');
      setTrendingSongs(response.data.songs || []);
    } catch (error) {
      console.error("Error fetching trending:", error);
    }
  };

  const fetchHomeContent = async () => {
    try {
      const response = await api.get('/api/jiosaavn/home', { params: { user_id: user.id } });
      setHomeContent(response.data.content);
    } catch (error) {
      console.error("Error fetching home content:", error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await api.get(`/api/songs/recommendations/${user.id}`);
      setRecommendations(response.data.songs || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const fetchFollowedArtists = async () => {
    try {
      const response = await api.get(`/api/stats/following/${user.id}`);
      setFollowedArtists(response.data.following || []);
    } catch (error) {
      console.error("Error fetching followed artists:", error);
    }
  };

  const fetchSaavnArtist = async (id) => {
    try {
      const resp = await api.get(`/api/jiosaavn/artist/${id}`);
      setSaavnArtist(resp.data.artist);
    } catch (error) {
      console.error("Error fetching JioSaavn artist:", error);
    }
  };

  const fetchSaavnAlbum = async (id) => {
    try {
      const resp = await api.get(`/api/jiosaavn/album/${id}`);
      setSaavnAlbum(resp.data.album);
    } catch (error) {
      console.error("Error fetching JioSaavn album:", error);
    }
  };

  const fetchSaavnPlaylist = async (id) => {
    try {
      const resp = await api.get(`/api/jiosaavn/playlist/${id}`);
      setSaavnPlaylist(resp.data.playlist);
    } catch (error) {
      console.error("Error fetching JioSaavn playlist:", error);
    }
  };

  const fetchArtistProfile = async (artistId) => {
    try {
      const [profileRes, followRes] = await Promise.all([
        api.get(`/api/songs/artist/${artistId}`),
        user.id ? api.get(`/api/stats/is_following/${artistId}/${user.id}`) : Promise.resolve({ data: { following: false } })
      ]);
      setArtistProfileData(profileRes.data.profile);
      setIsFollowing(followRes.data.following);
    } catch (error) {
      console.error("Error fetching artist profile:", error);
    }
  };

  const handleToggleFollow = async (artistId) => {
    try {
      const response = await api.post(`/api/stats/follow/${artistId}`, { user_id: user.id });
      setIsFollowing(response.data.following);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const fetchLikedSongs = async () => {
    try {
      const response = await api.get(`/api/songs/liked/${user.id}`);
      setLikedSongsData(response.data.songs);
    } catch (error) {
      console.error("Error fetching liked songs:", error);
    }
  };

  const fetchPlaylistSongs = async (playlistId) => {
    try {
      const response = await api.get(`/api/playlists/${playlistId}`);
      setPlaylistInfo(response.data.playlist);
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
    }
  };

  const handleCreatePlaylist = () => {
    const title = prompt("Enter playlist name:");
    if (title) {
      createPlaylist(title);
    }
  };



  // Play a JioSaavn song (import-on-play)
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
        // Pass the entire songList so the queue is populated, allowing 'Next' to work
        playSong(playable, songList || [playable]);
      }
    } catch (err) {
      console.error("Import failed:", err);
    } finally {
      setImportingId(null);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Pull-to-refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [fetchError, setFetchError] = useState(null);
  const pullStartY = useRef(0);
  const scrollContainerRef = useRef(null);
  const PULL_THRESHOLD = 80;

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setFetchError(null);
    hasLoadedHome.current = false;
    try {
      await Promise.all([
        fetchRecentSongs(),
        fetchTrending(),
        fetchHomeContent(),
        fetchRecommendations(),
        fetchFollowedArtists(),
      ]);
      hasLoadedHome.current = true;
    } catch (err) {
      setFetchError('Failed to load content. Pull down to retry.');
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
    }
  }, []);

  const handlePullStart = useCallback((e) => {
    if (scrollContainerRef.current?.scrollTop === 0) {
      pullStartY.current = e.touches[0].clientY;
    }
  }, []);

  const handlePullMove = useCallback((e) => {
    if (!pullStartY.current || isRefreshing) return;
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    if (scrollTop > 0) { pullStartY.current = 0; setPullDistance(0); return; }
    const delta = e.touches[0].clientY - pullStartY.current;
    if (delta > 0) {
      setPullDistance(Math.min(delta * 0.5, PULL_THRESHOLD * 1.5));
    }
  }, [isRefreshing]);

  const handlePullEnd = useCallback(() => {
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      handleRefresh();
    } else {
      setPullDistance(0);
    }
    pullStartY.current = 0;
  }, [pullDistance, isRefreshing, handleRefresh]);


  return (
    <div className="flex h-screen bg-brand-dark overflow-hidden">
      <ProfileSettingsModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        user={currentUser}
        onUpdate={(updatedUser) => setCurrentUser(updatedUser)}
      />
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-brand-dark relative">
        {/* Top Navigation Bar */}
        <div className="min-h-[3.5rem] md:min-h-[4rem] py-2 md:py-3 pt-safe px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 bg-brand-dark/90 backdrop-blur-2xl border-b border-white/[0.03] transition-all duration-500 shadow-sm">
           {/* Left Logo (Visible mainly on Mobile since Sidebar is hidden) */}
           <div className="flex-1 flex items-center justify-start gap-2.5">
              <div className="flex items-center gap-2 cursor-pointer group md:hidden" onClick={() => navigate('/dashboard')}>
                 <WaveLogo size={20} className="shrink-0 group-hover:scale-105 transition-transform" />
              </div>
           </div>
           
           {/* Center Spacer */}
           <div className="flex-[2] hidden md:block"></div>

           {/* Right Section: Search & Profile */}
           <div className="flex-[3] md:flex-[2] flex justify-end items-center gap-3 md:gap-6">

              {/* Search Bar (Moved Next to Profile) */}
              {currentView !== 'search' && (
                <div className="relative w-full max-w-[200px] md:max-w-xs group transition-all duration-300">
                  <SearchIcon className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-brand-muted w-3.5 h-3.5 opacity-50 group-focus-within:text-brand-primary transition-colors" />
                  <input 
                    id="global-search-input"
                    name="global-search-input"
                    type="text" 
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                        setSearchQuery('');
                      }
                    }}
                    className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] rounded-full py-1.5 md:py-2 pl-9 md:pl-11 pr-3 md:pr-4 text-xs font-semibold text-brand-primary focus:outline-none focus:bg-white/[0.08] focus:border-brand-primary/20 placeholder-brand-muted/70 transition-all duration-300"
                  />
                </div>
              )}

              {/* Profile Icon */}
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setIsProfileModalOpen(true)}
              >
                <div className="w-9 h-9 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center overflow-hidden group-hover:border-brand-primary/40 transition-all bg-gradient-to-tr from-brand-primary/20 to-brand-accent/20 shadow-lg">
                  {currentUser.avatar_url ? (
                    <img src={resolveUrl(currentUser.avatar_url)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-black text-brand-primary uppercase">
                      {currentUser.username?.[0] || 'U'}
                    </span>
                  )}
                </div>
              </div>
           </div>
        </div>

        {/* ============================================ */}
        {/*              HOME VIEW                     */}
        {/* ============================================ */}
        {currentView === 'home' && (
          <div 
            ref={scrollContainerRef}
            onTouchStart={handlePullStart}
            onTouchMove={handlePullMove}
            onTouchEnd={handlePullEnd}
            className="flex-1 overflow-y-auto relative pb-32 md:pb-32 custom-scrollbar animate-fade-in"
          >
            {/* Pull-to-refresh indicator */}
            {(pullDistance > 0 || isRefreshing) && (
              <div 
                className="flex items-center justify-center transition-all duration-200 overflow-hidden"
                style={{ height: isRefreshing ? 48 : pullDistance }}
              >
                <div className={`w-6 h-6 border-[3px] border-brand-primary/20 border-t-brand-primary rounded-full ${isRefreshing ? 'animate-spin' : ''}`}
                  style={{ transform: !isRefreshing ? `rotate(${pullDistance * 3}deg)` : undefined, opacity: Math.min(pullDistance / PULL_THRESHOLD, 1) }}
                />
              </div>
            )}

            {/* Error state */}
            {fetchError && !isLoading && (
              <div className="mx-4 md:mx-8 mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                <div className="text-red-400 text-sm font-medium flex-1">{fetchError}</div>
                <button onClick={handleRefresh} className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 text-xs font-bold hover:bg-red-500/30 transition-colors">Retry</button>
              </div>
            )}



            {/* ── Dynamic Layout: Top 3 Trending vs Vinyl expansion (with Animaton) ── */}
            <div className="relative md:min-h-[300px] hidden md:block">
              <AnimatePresence mode="wait">
                {currentSong ? (
                  <motion.div
                    key="vinyl-header"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.05, y: -15 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <VinylExpansionHeader currentSong={currentSong} isPlaying={isPlaying} resolveUrl={resolveUrl} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="trending-header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <TopThreeHeader 
                      trendingSongs={trendingSongs?.length >= 3 ? trendingSongs : recommendations} 
                      resolveUrl={resolveUrl} 
                      onPlay={handleGlobalPlay} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8 md:space-y-10 mt-4 md:mt-0">

              {/* ── Apple Music Style Listen Now Header (Removed per user request) ── */}

              {/* ── Quick Picks ── */}
              <div className="animate-slide-up">
                {recentSongs.length > 0 && (
                  <>
                    <SectionHeader title="Quick Picks" icon={Clock} subtitle="Jump back in" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                      {recentSongs.slice(0, window.innerWidth < 768 ? 6 : 8).map(song => (
                        <QuickPickCard key={`qp-${song.song_id}`} song={song} onClick={() => playSong(song, recentSongs)} resolveUrl={resolveUrl} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* ── Featured Playlists (from JioSaavn) ── */}
              {(isLoading || homeContent?.featured_playlists?.length > 0) && (
                <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
                  <SectionHeader title="Featured Playlists" icon={Sparkles} subtitle="Curated playlists just for you" />
                  <HorizontalCarousel>
                    {isLoading ? (
                      [...Array(6)].map((_, i) => <div key={i} className="w-44 shrink-0"><CardSkeleton /></div>)
                    ) : (
                      homeContent?.featured_playlists?.map((pl) => (
                        <ContentCard
                          key={pl.id}
                          image={pl.cover_image_url}
                          title={pl.name}
                          subtitle={`${pl.song_count || ''} songs`}
                          onClick={() => navigate(`/dashboard/saavn-playlist/${pl.id}`)}
                        />
                      ))
                    )}
                  </HorizontalCarousel>
                </div>
              )}

              {/* ── Recently Played ── */}
              {(isLoading || recentSongs.length > 0) && (
                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <SectionHeader title="Recently Played" icon={Clock} />
                  <HorizontalCarousel>
                    {isLoading ? (
                      [...Array(5)].map((_, i) => <div key={i} className="w-44 shrink-0"><CardSkeleton /></div>)
                    ) : (
                      recentSongs.slice(0, 10).map(song => (
                        <ContentCard
                          key={`recent-${song.song_id}`}
                          image={resolveUrl(song.cover_image_url)}
                          title={song.title}
                          subtitle={song.artist_name}
                          onClick={() => playSong(song, recentSongs)}
                        />
                      ))
                    )}
                  </HorizontalCarousel>
                </div>
              )}

              {/* ── Trending Now (local DB) ── */}
              {(isLoading || trendingSongs.length > 0) && (
                <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
                  <SectionHeader title="Trending Now" icon={TrendingUp} subtitle="What everyone's listening to" />
                  <HorizontalCarousel>
                    {isLoading ? (
                      [...Array(5)].map((_, i) => <div key={i} className="w-44 shrink-0"><CardSkeleton /></div>)
                    ) : (
                      trendingSongs.slice(0, 10).map(song => (
                        <ContentCard
                          key={`trend-${song.song_id}`}
                          image={resolveUrl(song.cover_image_url)}
                          title={song.title}
                          subtitle={song.artist_name}
                          onClick={() => playSong(song, trendingSongs)}
                        />
                      ))
                    )}
                  </HorizontalCarousel>
                </div>
              )}

              {/* ── Made For You (Recommendations) ── */}
              {(isLoading || recommendations.length > 0) && (
                <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <SectionHeader title={`Made For ${currentUser.username}`} icon={Headphones} subtitle="Based on your listening taste" />
                  <HorizontalCarousel>
                    {isLoading ? (
                      [...Array(5)].map((_, i) => <div key={i} className="w-44 shrink-0"><CardSkeleton /></div>)
                    ) : (
                      recommendations.map((song, i) => (
                        <ContentCard
                          key={`rec-${song.saavn_id || song.song_id}-${i}`}
                          image={song.cover_image_url}
                          title={song.title}
                          subtitle={song.artist_name}
                          onClick={() => handleGlobalPlay(song)}
                        />
                      ))
                    )}
                  </HorizontalCarousel>
                </div>
              )}

              {/* ── New Releases (Albums from JioSaavn) ── */}
              {(isLoading || homeContent?.new_releases?.length > 0) && (
                <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
                  <SectionHeader title="New Releases" icon={Disc3} subtitle="Latest albums to explore" />
                  <HorizontalCarousel>
                    {isLoading ? (
                      [...Array(5)].map((_, i) => <div key={i} className="w-44 shrink-0"><CardSkeleton /></div>)
                    ) : (
                      homeContent?.new_releases?.map((album) => (
                        <ContentCard
                          key={`album-${album.id}`}
                          image={album.cover_image_url}
                          title={album.name}
                          subtitle={album.artist_name}
                          onClick={() => navigate(`/dashboard/album/saavn_${album.id}`)}
                        />
                      ))
                    )}
                  </HorizontalCarousel>
                </div>
              )}

              {/* ── Trending from JioSaavn ── */}
              {(isLoading || homeContent?.trending_songs?.length > 0) && (
                <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <SectionHeader title="Popular Right Now" icon={TrendingUp} subtitle="From millions of listeners" />
                  <HorizontalCarousel>
                    {isLoading ? (
                      [...Array(5)].map((_, i) => <div key={i} className="w-44 shrink-0"><CardSkeleton /></div>)
                    ) : (
                      homeContent?.trending_songs?.map((song) => (
                        <ContentCard
                          key={`pop-${song.saavn_id}`}
                          image={song.cover_image_url}
                          title={song.title}
                          subtitle={song.artist_name}
                          onClick={() => handleGlobalPlay(song)}
                        />
                      ))
                    )}
                  </HorizontalCarousel>
                </div>
              )}

              {/* ── Personalized Mixes ("Because you listen to X") ── */}
              {homeContent?.personalized_mixes?.map((mix, midx) => (
                <div key={`mix-${mix.key}`} className="animate-slide-up" style={{ animationDelay: `${0.35 + midx * 0.05}s` }}>
                  <SectionHeader 
                    title={mix.title} 
                    icon={mix.type === 'artist' ? Headphones : Sparkles} 
                    subtitle={mix.type === 'artist' ? 'Songs you might love' : 'Curated for your taste'} 
                  />
                  <HorizontalCarousel>
                    {mix.songs.map((song) => (
                      <ContentCard
                        key={`pmix-${song.saavn_id}`}
                        image={song.cover_image_url}
                        title={song.title}
                        subtitle={song.artist_name}
                        onClick={() => handleGlobalPlay(song)}
                      />
                    ))}
                  </HorizontalCarousel>
                </div>
              ))}

              {/* ── Your Top Artists ── */}
              {followedArtists.length > 0 && (
                <div className="animate-slide-up" style={{ animationDelay: '0.35s' }}>
                  <SectionHeader title="Your Artists" icon={Users} />
                  <HorizontalCarousel>
                    {followedArtists.map((artist) => (
                      <ContentCard
                        key={`fa-${artist.artist_id}`}
                        image={resolveUrl(artist.avatar_url)}
                        title={artist.artist_name}
                        subtitle="Artist"
                        isRound
                        onClick={() => navigate(`/dashboard/artist/${artist.artist_id}`)}
                      />
                    ))}
                  </HorizontalCarousel>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ============================================ */}
        {/*              STATS VIEW                     */}
        {/* ============================================ */}
        {currentView === 'stats' && (
          <ListenerStats />
        )}

        {/* ============================================ */}
        {/*              LIBRARY VIEW                   */}
        {/* ============================================ */}
        {currentView === 'library' && (
          <div className="flex-1 overflow-y-auto relative pb-[10rem] md:pb-32 animate-fade-in custom-scrollbar">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-black mb-8 md:mb-12 tracking-tight flex items-center gap-5 pt-4 text-white drop-shadow-lg">
                Your Library
              </h1>
              
              {/* My Playlists Grid */}
              {(playlists?.length > 0 || likedPlaylists?.length > 0) && (
                 <div className="mb-14 animate-slide-up">
                    <h2 className="text-xl md:text-2xl font-bold mb-6 tracking-tight text-brand-primary">Playlists</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                      
                      {/* Create New Playlist Card */}
                      <div onClick={handleCreatePlaylist} className="cursor-pointer group flex flex-col">
                        <div className="aspect-square bg-white/[0.02] border border-white/5 border-dashed rounded-2xl shadow-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-white/[0.05] group-hover:border-white/20 transition-all">
                           <Plus className="w-8 h-8 md:w-12 md:h-12 text-white/30 group-hover:scale-110 transition-transform" />
                        </div>
                        <h3 className="font-bold text-sm md:text-lg truncate mb-0.5 md:mb-1 text-white">Create New</h3>
                        <p className="text-xs md:text-sm font-medium text-brand-muted shrink-0">Local Playlist</p>
                      </div>

                      {/* User's Created Playlists */}
                      {playlists?.map((pl) => (
                        <div key={`local-${pl.playlist_id}`} onClick={() => navigate(`/dashboard/playlist/${pl.playlist_id}`)} className="cursor-pointer group flex flex-col">
                          <div className="aspect-square bg-gradient-to-tr from-brand-accent/20 to-brand-primary/10 rounded-2xl shadow-xl flex items-center justify-center mb-3 md:mb-4 border border-white/5 group-hover:border-white/20 group-hover:scale-105 transition-all">
                             <Music className="w-10 h-10 md:w-16 md:h-16 text-white/20 drop-shadow-md" />
                          </div>
                          <h3 className="font-bold text-sm md:text-lg truncate mb-0.5 md:mb-1 text-white">{pl.title}</h3>
                          <p className="text-xs md:text-sm font-medium text-brand-muted shrink-0">By {user.username || 'You'}</p>
                        </div>
                      ))}

                      {/* Saved JioSaavn Playlists */}
                      {likedPlaylists?.map((pl) => (
                        <div key={`saavn-${pl.saavn_playlist_id}`} onClick={() => navigate(`/dashboard/saavn-playlist/${pl.saavn_playlist_id}`)} className="cursor-pointer group flex flex-col">
                          <div className="aspect-square bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-2xl shadow-xl flex items-center justify-center mb-3 md:mb-4 border border-white/5 group-hover:border-white/20 group-hover:scale-105 transition-all relative overflow-hidden">
                             {/* If we had images stored we'd put it here, falling back to icon */}
                             <Library className="w-10 h-10 md:w-16 md:h-16 text-indigo-400/40 drop-shadow-md" />
                          </div>
                          <h3 className="font-bold text-sm md:text-lg truncate mb-0.5 md:mb-1 text-white">{pl.title}</h3>
                          <p className="text-xs md:text-sm font-medium text-brand-muted shrink-0">Saved Playlist</p>
                        </div>
                      ))}
                    </div>
                 </div>
              )}

              {/* Liked Songs List */}
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-xl md:text-2xl font-bold mb-6 tracking-tight text-brand-primary flex items-center gap-3">
                   <Heart className="w-6 h-6 text-brand-accent-hot fill-current" />
                   Liked Tracks
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {isLoading ? (
                    [...Array(6)].map((_, i) => <SongSkeleton key={i} />)
                  ) : (
                    likedSongsData?.map((song) => (
                      <SongCard key={song.song_id} song={song} />
                    ))
                  )}
                  
                  {!isLoading && (!likedSongsData || likedSongsData.length === 0) && (
                    <div className="col-span-full py-20 text-center rounded-2xl border-dashed border-white/[0.05] bg-brand-surface mt-4">
                      <Heart className="w-12 h-12 mx-auto mb-6 text-brand-muted opacity-50" />
                      <p className="text-xl font-medium text-brand-primary">Your library is quiet...</p>
                      <p className="text-sm text-brand-muted mt-2 mb-8">Start liking songs to build your personal collection.</p>
                      <button onClick={() => navigate('/search')} className="btn-primary inline-flex items-center gap-2">
                         <SearchIcon className="w-4 h-4" />
                         Discover Tracks
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/*        LOCAL PLAYLIST VIEW                   */}
        {/* ============================================ */}
        {currentView === 'playlist' && (
          <div className="flex-1 overflow-y-auto relative pb-[10rem] md:pb-32 animate-fade-in custom-scrollbar">
             {isLoading ? (
               <div className="p-4 md:p-8 pt-10 md:pt-20">
                  <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-12">
                     <Skeleton className="w-40 h-40 md:w-48 md:h-48 rounded-2xl" />
                     <div className="space-y-4 w-full flex flex-col items-center md:items-start">
                        <Skeleton className="w-20 h-4" />
                        <Skeleton className="w-64 h-8 md:h-12" />
                        <Skeleton className="w-full max-w-[20rem] md:w-96 h-4 md:h-6" />
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
                    {[...Array(6)].map((_, i) => <SongSkeleton key={i} />)}
                  </div>
               </div>
             ) : playlistInfo && (
               <>
                <div className="absolute top-0 w-full h-[24rem] md:h-[32rem] bg-gradient-to-b from-brand-accent/20 to-transparent pointer-events-none" />
                <div className="p-4 md:p-8 relative z-10">
                  <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8 md:mb-12 animate-slide-up text-center md:text-left">
                    <div className="w-48 h-48 md:w-56 md:h-56 glass-surface rounded-2xl shadow-2xl flex items-center justify-center group overflow-hidden shrink-0 mt-4 md:mt-0">
                       <Music className="w-20 h-20 md:w-24 md:h-24 text-white/10 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="pb-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent mb-2 md:mb-3 block">Playlist</span>
                      <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-2 md:mb-4">{playlistInfo.title}</h1>
                      <p className="text-white/50 text-sm md:text-lg font-medium max-w-2xl leading-relaxed px-4 md:px-0">{playlistInfo.description || "A curated collection of your favorite tracks on Wave."}</p>
                      <div className="flex items-center justify-center md:justify-start gap-3 mt-4 md:mt-6 text-xs md:text-sm font-bold">
                        <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-[10px] text-brand-dark">{user.username?.charAt(0)}</div>
                        <span className="text-white/90">{user.username}</span>
                        <span className="text-white/20">•</span>
                        <span className="text-white/40">{playlistInfo.songs?.length || 0} songs</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {playlistInfo.songs?.map((song) => (
                      <SongCard key={song.song_id} song={song} />
                    ))}
                    
                    {(playlistInfo.songs?.length === 0) && (
                      <div className="col-span-full py-32 text-center glass-panel border-white/5 bg-white/[0.01]">
                        <Music className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        <p className="text-lg font-bold text-white/40">This playlist is empty.</p>
                        <Link to="/search" className="text-brand-primary hover:underline font-bold text-sm mt-4 inline-block">Find songs to add</Link>
                      </div>
                    )}
                  </div>
                </div>
               </>
             )}
          </div>
        )}

        {/* ============================================ */}
        {/*        LOCAL ARTIST PROFILE VIEW             */}
        {/* ============================================ */}
        {currentView === 'artist-profile' && (
          <div className="flex-1 overflow-y-auto relative pb-[10rem] md:pb-32 animate-fade-in custom-scrollbar">
            {isLoading ? (
               <div className="animate-pulse">
                  <div className="h-64 md:h-80 bg-white/5 w-full" />
                  <div className="p-4 md:p-8">
                     <div className="flex justify-center md:justify-start gap-4 mb-8 md:mb-10 mt-[-2rem] md:mt-0 relative z-10">
                        <Skeleton variant="circle" className="h-14 w-14" />
                        <Skeleton className="w-32 h-14 rounded-full" />
                     </div>
                     <Skeleton className="w-48 h-8 mb-6 md:mb-8 mx-auto md:mx-0" />
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
                        {[...Array(6)].map((_, i) => <SongSkeleton key={i} />)}
                     </div>
                  </div>
               </div>
            ) : artistProfileData && (
              <>
                {/* Artist Banner */}
                <div className="relative h-[20rem] md:h-[28rem] w-full">
                   <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/30 to-brand-dark z-0" />
                   {artistProfileData.banner_url ? (
                      <img src={artistProfileData.banner_url} alt="banner" className="w-full h-full object-cover relative z-[-1]" />
                   ) : artistProfileData.songs?.[0]?.cover_image_url ? (
                      <img src={resolveUrl(artistProfileData.songs[0].cover_image_url)} alt="fallback-banner" className="w-full h-full object-cover relative z-[-1] opacity-50 blur-md saturate-150" />
                   ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-brand-accent/20 to-brand-primary/10 relative z-[-1]" />
                   )}
                   
                   <div className="absolute bottom-0 left-0 p-4 md:p-12 w-full bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent z-10 transition-all duration-700">
                      <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 text-center md:text-left translate-y-8 md:translate-y-0">
                         {artistProfileData.avatar_url || artistProfileData.songs?.[0]?.cover_image_url ? (
                            <img src={artistProfileData.avatar_url || resolveUrl(artistProfileData.songs[0].cover_image_url)} alt="avatar" className="w-32 h-32 md:w-48 md:h-48 rounded-full shadow-2xl ring-4 ring-white/10 object-cover shrink-0 animate-slide-up" />
                         ) : null}
                         <div>
                            <h1 className="text-4xl md:text-8xl font-black tracking-tighter mb-2 md:mb-4 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-slide-up" style={{ animationDelay: '0.05s' }}>{artistProfileData.username}</h1>
                            <p className="text-sm md:text-lg text-white/70 max-w-3xl font-medium leading-relaxed drop-shadow-md animate-slide-up px-4 md:px-0" style={{ animationDelay: '0.1s' }}>{artistProfileData.bio || "Artist"}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-4 md:p-8 relative z-10 mt-10 md:mt-0">
                  <div className="flex items-center justify-center md:justify-start gap-6 md:gap-8 mb-10 md:mb-14 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                     <button className="w-14 h-14 bg-brand-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-brand-dark">
                        <Play className="w-7 h-7 fill-current ml-1" />
                     </button>
                     <button 
                       onClick={() => handleToggleFollow(artistProfileData.artist_id)}
                       className={`px-8 py-3 rounded-full border font-bold transition-all uppercase tracking-widest text-[10px] ${isFollowing ? 'border-brand-primary/30 bg-brand-primary/10 text-brand-primary' : 'border-white/10 hover:bg-white/5'}`}
                     >
                       {isFollowing ? 'Following' : 'Follow'}
                     </button>
                  </div>

                  <div className="space-y-4 md:space-y-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <h2 className="text-lg md:text-xl font-bold flex items-center gap-3 tracking-tight">
                       Discography
                       <div className="h-px flex-1 bg-white/5" />
                       <span className="text-white/20 font-bold text-[10px] md:text-xs tracking-widest uppercase">{artistProfileData.songs?.length || 0} tracks</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                      {artistProfileData.songs?.map((song) => (
                        <SongCard key={song.song_id} song={{...song, artist_name: artistProfileData.username, artist_id: artistProfileData.artist_id}} />
                      ))}
                      
                      {(!artistProfileData.songs || artistProfileData.songs.length === 0) && (
                        <div className="col-span-full py-32 text-center glass-panel border-white/5 bg-white/[0.01]">
                          <Music className="w-16 h-16 mx-auto mb-4 opacity-10" />
                          <p className="text-xl font-bold text-white/30">Quiet stage...</p>
                          <p className="text-sm text-white/20 mt-2">This artist hasn't published any tracks yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/*      JIOSAAVN ARTIST PROFILE VIEW            */}
        {/* ============================================ */}
        {currentView === 'saavn-artist' && (
          <div className="flex-1 overflow-y-auto relative pb-[10rem] md:pb-32 animate-fade-in custom-scrollbar">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-64 md:h-80 bg-white/5 w-full" />
                <div className="p-4 md:p-8">
                  <Skeleton className="w-48 md:w-64 h-8 md:h-10 mb-4 md:mb-6" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
                    {[...Array(6)].map((_, i) => <SongSkeleton key={i} />)}
                  </div>
                </div>
              </div>
            ) : saavnArtist && (
              <>
                {/* Artist Hero */}
                <div className="relative h-[20rem] md:h-[24rem] w-full">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] to-brand-dark z-0" />
                  {saavnArtist.image && (
                    <img src={saavnArtist.image} alt="" className="w-full h-full object-cover relative z-[-1] opacity-40 blur-sm scale-110" />
                  )}
                  <div className="absolute bottom-0 left-0 p-4 md:p-12 w-full bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent z-10 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 text-center md:text-left translate-y-6 md:translate-y-0">
                    {saavnArtist.image && (
                      <img src={saavnArtist.image} alt={saavnArtist.name} className="w-32 h-32 md:w-48 md:h-48 rounded-full shadow-2xl ring-4 ring-white/10 object-cover shrink-0" />
                    )}
                    <div>
                      {saavnArtist.is_verified && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 md:mb-3">
                          ✓ Verified Artist
                        </span>
                      )}
                      <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-1 md:mb-2">{saavnArtist.name}</h1>
                      {saavnArtist.fan_count > 0 && (
                        <p className="text-xs md:text-sm text-brand-muted font-medium">{Number(saavnArtist.fan_count).toLocaleString()} followers</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-8 mt-8 md:mt-0">
                  {/* Top Songs */}
                  {saavnArtist.top_songs?.length > 0 && (
                    <div className="mb-12 animate-slide-up">
                      <h2 className="text-xl font-bold mb-5 text-brand-primary">Popular</h2>
                      <div className="space-y-1">
                        {saavnArtist.top_songs.map((song, idx) => (
                          <div
                            key={song.saavn_id || idx}
                            onClick={() => handleGlobalPlay(song, saavnArtist.top_songs)}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.04] transition-all group cursor-pointer"
                          >
                            <span className="w-6 text-center text-sm font-bold text-brand-muted tabular-nums">{idx + 1}</span>
                            <div className="w-11 h-11 rounded-md overflow-hidden shrink-0 bg-brand-dark relative">
                              <img src={song.cover_image_url} alt="" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                {importingId === song.saavn_id ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Play className="w-4 h-4 text-white fill-current" />}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-brand-primary truncate">{song.title}</div>
                              <div className="text-xs text-brand-muted truncate">{song.album_name}</div>
                            </div>
                            <span className="text-xs text-brand-muted font-medium tabular-nums">{formatTime(song.duration)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Albums */}
                  {saavnArtist.top_albums?.length > 0 && (
                    <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                      <SectionHeader title="Albums" />
                      <HorizontalCarousel>
                        {saavnArtist.top_albums.map((album) => (
                          <ContentCard
                            key={album.id}
                            image={album.cover_image_url}
                            title={album.name}
                            subtitle={album.year}
                            onClick={() => navigate(`/dashboard/album/saavn_${album.id}`)}
                          />
                        ))}
                      </HorizontalCarousel>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/*        JIOSAAVN ALBUM VIEW                  */}
        {/* ============================================ */}
        {currentView === 'saavn-album' && (
          <div className="flex-1 overflow-y-auto relative pb-[10rem] md:pb-32 animate-fade-in custom-scrollbar">
            {isLoading ? (
              <div className="p-4 md:p-8 pt-10 md:pt-20 animate-pulse">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8 md:mb-12">
                  <Skeleton className="w-48 h-48 md:w-52 md:h-52 rounded-2xl" />
                  <div className="space-y-4 w-full flex flex-col items-center md:items-start">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-64 h-8 md:h-10" />
                    <Skeleton className="w-40 h-4 md:h-5" />
                  </div>
                </div>
              </div>
            ) : saavnAlbum && (
              <>
                <div className="absolute top-0 w-full h-[24rem] md:h-[30rem] bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
                <div className="p-4 md:p-8 relative z-10">
                  <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8 md:mb-10 animate-slide-up text-center md:text-left">
                    <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl shadow-2xl overflow-hidden shrink-0 mt-4 md:mt-0">
                      {saavnAlbum.cover_image_url ? (
                        <img src={saavnAlbum.cover_image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-brand-surface flex items-center justify-center"><Disc3 className="w-16 h-16 md:w-20 md:h-20 text-white/10" /></div>
                      )}
                    </div>
                    <div className="pb-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-muted mb-2 md:mb-3 block">Album</span>
                      <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 md:mb-3">{saavnAlbum.name}</h1>
                      <p className="text-sm md:text-lg text-brand-muted font-medium">{saavnAlbum.artist_name}</p>
                      <div className="flex items-center justify-center md:justify-start gap-3 mt-3 md:mt-4 text-[10px] md:text-xs font-bold text-brand-muted">
                        {saavnAlbum.year && <span>{saavnAlbum.year}</span>}
                        <span>•</span>
                        <span>{saavnAlbum.song_count || saavnAlbum.songs?.length || 0} songs</span>
                      </div>
                    </div>
                  </div>

                  {/* Song list */}
                  <div className="space-y-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {saavnAlbum.songs?.map((song, idx) => (
                      <div
                        key={song.saavn_id || idx}
                        onClick={() => handleGlobalPlay(song, saavnAlbum.songs)}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.04] transition-all group cursor-pointer"
                      >
                        <span className="w-6 text-center text-sm font-bold text-brand-muted tabular-nums">{idx + 1}</span>
                        <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-brand-dark relative">
                          <img src={song.cover_image_url} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            {importingId === song.saavn_id ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Play className="w-4 h-4 text-white fill-current" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-brand-primary truncate">{song.title}</div>
                          <div className="text-xs text-brand-muted truncate">{song.artist_name}</div>
                        </div>
                        <span className="text-xs text-brand-muted font-medium tabular-nums">{formatTime(song.duration)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/*       JIOSAAVN PLAYLIST VIEW                 */}
        {/* ============================================ */}
        {currentView === 'saavn-playlist' && (
          <div className="flex-1 overflow-y-auto relative pb-[10rem] md:pb-32 animate-fade-in custom-scrollbar">
            {isLoading ? (
              <div className="p-4 md:p-8 pt-10 md:pt-20 animate-pulse">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8 md:mb-12">
                  <Skeleton className="w-48 h-48 md:w-52 md:h-52 rounded-2xl" />
                  <div className="space-y-4 w-full flex flex-col items-center md:items-start">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-64 h-8 md:h-10" />
                    <Skeleton className="w-full max-w-[20rem] md:w-96 h-4 md:h-5" />
                  </div>
                </div>
              </div>
            ) : saavnPlaylist && (
              <>
                <div className="absolute top-0 w-full h-[24rem] md:h-[30rem] bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
                <div className="p-4 md:p-8 relative z-10">
                  <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8 md:mb-10 animate-slide-up text-center md:text-left">
                    <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl shadow-2xl overflow-hidden shrink-0 mt-4 md:mt-0">
                      {saavnPlaylist.cover_image_url ? (
                        <img src={saavnPlaylist.cover_image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-brand-surface flex items-center justify-center"><Music className="w-16 h-16 md:w-20 md:h-20 text-white/10" /></div>
                      )}
                    </div>
                    <div className="pb-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-muted mb-2 md:mb-3 block">Playlist</span>
                      <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 md:mb-3">{saavnPlaylist.name}</h1>
                      {saavnPlaylist.description && <p className="text-xs md:text-base text-brand-muted font-medium max-w-2xl px-4 md:px-0">{saavnPlaylist.description}</p>}
                      <div className="flex items-center justify-center md:justify-start gap-3 mt-3 md:mt-4 text-[10px] md:text-xs font-bold text-brand-muted">
                        <span>{saavnPlaylist.song_count || saavnPlaylist.songs?.length || 0} songs</span>
                        {saavnPlaylist.fan_count > 0 && (
                          <>
                            <span>•</span>
                            <span>{Number(saavnPlaylist.fan_count).toLocaleString()} likes</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Play All button */}
                  <div className="mb-6 md:mb-8 flex items-center justify-center md:justify-start gap-4 animate-slide-up" style={{ animationDelay: '0.05s' }}>
                    <button 
                      onClick={() => saavnPlaylist.songs?.[0] && handleGlobalPlay(saavnPlaylist.songs[0], saavnPlaylist.songs)}
                      className="w-12 h-12 md:w-14 md:h-14 bg-brand-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-brand-dark"
                      title="Play All"
                    >
                      <Play className="w-6 h-6 md:w-7 md:h-7 fill-current ml-1" />
                    </button>

                    <button
                      onClick={() => toggleLikePlaylist(saavnPlaylist)}
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
                      title={likedPlaylists?.some(p => p.saavn_playlist_id === saavnPlaylist.id) ? "Remove from Library" : "Save to Library"}
                    >
                      <Heart className={`w-6 h-6 transition-colors ${likedPlaylists?.some(p => p.saavn_playlist_id === saavnPlaylist.id) ? 'fill-brand-accent text-brand-accent' : 'text-brand-muted hover:text-white'}`} />
                    </button>
                  </div>

                  {/* Song list */}
                  <div className="space-y-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {saavnPlaylist.songs?.map((song, idx) => (
                      <div
                        key={song.saavn_id || idx}
                        onClick={() => handleGlobalPlay(song, saavnPlaylist.songs)}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.04] transition-all group cursor-pointer"
                      >
                        <span className="w-6 text-center text-sm font-bold text-brand-muted tabular-nums">{idx + 1}</span>
                        <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-brand-dark relative">
                          <img src={song.cover_image_url} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            {importingId === song.saavn_id ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Play className="w-4 h-4 text-white fill-current" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-brand-primary truncate">{song.title}</div>
                          <div className="text-xs text-brand-muted truncate">{song.artist_name}</div>
                        </div>
                        <span className="text-xs text-brand-muted font-medium tabular-nums">{formatTime(song.duration)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {currentView === 'search' && (
          <Search />
        )}

      {/* Profile Settings Modal */}
      <ProfileSettingsModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        user={currentUser}
        onUpdate={(updatedUser) => setCurrentUser(updatedUser)}
      />

      <BottomPlayer />
    </div>
  </div>
);
};

export default Dashboard;
