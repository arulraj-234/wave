import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Play, Pause, SkipForward, SkipBack, Heart, Volume2, VolumeX, Maximize2, ChevronDown, Shuffle, Repeat, Repeat1, ListMusic, Timer, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerContext } from '../context/PlayerContext';
import TiltedCard from './TiltedCard';
import QueuePanel from './QueuePanel';
import ElasticSlider from './ElasticSlider';

const useDominantColor = (imageUrl) => {
  const [color, setColor] = useState('#121212');

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = 64;
        canvas.height = 64;
        ctx.drawImage(img, 0, 0, 64, 64);

        const imageData = ctx.getImageData(0, 0, 64, 64).data;
        let r = 0, g = 0, b = 0, count = 0;

        for (let i = 0; i < imageData.length; i += 16) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
          count++;
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        // Darken for standard Spotify aesthetic
        r = Math.floor(r * 0.4);
        g = Math.floor(g * 0.4);
        b = Math.floor(b * 0.4);

        setColor(`rgb(${r}, ${g}, ${b})`);
      } catch (e) {
        setColor('#121212');
      }
    };
  }, [imageUrl]);

  return color;
};

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const BottomPlayer = () => {
  const {
    currentSong, isPlaying, progress, duration, volume,
    likedSongs, toggleLike,
    togglePlay, seek, setVolume,
    playNext, playPrevious, resolveUrl,
    shuffleMode, repeatMode, toggleShuffle, toggleRepeat,
    queue, sleepTimer, setSleepTimer, cancelSleepTimer,
    isFullScreenPlayer, setIsFullScreenPlayer,
    isSidebarCollapsed
  } = useContext(PlayerContext);

  const [showQueue, setShowQueue] = useState(false);
  const [showSleepMenu, setShowSleepMenu] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const location = useLocation();

  const idleTimerRef = useRef(null);

  const resetIdleTimer = () => {
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (isFullScreenPlayer) {
      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true);
      }, 3000);
    }
  };

  useEffect(() => {
    if (isFullScreenPlayer) {
      resetIdleTimer();
      window.addEventListener('mousemove', resetIdleTimer);
      window.addEventListener('keydown', resetIdleTimer);
    } else {
      setIsIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    }

    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isFullScreenPlayer]);

  const dominantColor = useDominantColor(currentSong?.cover_image_url ? resolveUrl(currentSong.cover_image_url) : null);

  // Auto-minimize full screen player when navigating
  useEffect(() => {
    if (isFullScreenPlayer) {
      setIsFullScreenPlayer(false);
    }
  }, [location.pathname]);

  const formatTimerDisplay = (seconds) => {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!currentSong) return null;

  const sidebarOffset = isFullScreenPlayer ? 'left-0' : (isSidebarCollapsed ? 'left-0 md:left-20' : 'left-0 md:left-64');

  return (
    <>


      {/* Queue Panel */}
      <QueuePanel isOpen={showQueue} onClose={() => setShowQueue(false)} />

      {/* Full Screen Player Overlay */}
      <AnimatePresence>
        {isFullScreenPlayer && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 w-full h-full pb-24 z-[45] flex items-center justify-center shadow-2xl overflow-hidden cursor-none"
            style={{ 
              background: `linear-gradient(to bottom, ${dominantColor} 0%, #121212 100%)`,
              cursor: isIdle ? 'none' : 'default'
            }}
          >
            {/* Internal Dimming Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent z-0 opacity-80" />

            {/* Top Controls (Auto-hide) */}
            <AnimatePresence>
              {!isIdle && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-8 right-8 flex gap-3 z-50"
                >
                  <button 
                    onClick={() => {
                      if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch(err => console.error("Error attempting to enable full-screen mode:", err));
                      } else if (document.exitFullscreen) {
                        document.exitFullscreen();
                      }
                    }}
                    className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-brand-muted hover:text-white transition-colors shadow-lg backdrop-blur-md"
                    title="Toggle True Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5 cursor-pointer" />
                  </button>
                  <button 
                    onClick={() => setIsFullScreenPlayer(false)}
                    className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-brand-muted hover:text-white transition-colors shadow-lg backdrop-blur-md"
                    title="Minimize"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="w-full max-w-[500px] aspect-square relative z-10 transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:scale-[1.02]">
              <TiltedCard
                imageSrc={resolveUrl(currentSong.cover_image_url) || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070'}
                altText={currentSong.title}
                captionText=""
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                scaleOnHover={1.03}
                rotateAmplitude={5}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={false}
              />
            </div>

            {/* Rest Mode Footer (Song Title) */}
            <AnimatePresence>
              {isIdle && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-16 left-0 w-full text-center z-20"
                >
                  <h2 className="text-4xl font-black tracking-tighter text-white/90 drop-shadow-2xl px-8">
                    {currentSong.title}
                  </h2>
                  <p className="text-xl font-bold text-white/40 mt-2 tracking-tight">
                    {currentSong.artist_name}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Modify Bottom Control Bar to hide when in Fullscreen + Idle */}
      <AnimatePresence>
        {(!isFullScreenPlayer || !isIdle) && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`fixed bottom-[4rem] md:bottom-0 ${sidebarOffset} right-0 h-[3.5rem] md:h-24 bg-brand-surface/95 md:bg-brand-surface/90 backdrop-blur-xl border-t border-white/[0.02] z-50 flex items-center px-3 md:px-8 mx-2 md:mx-0 rounded-xl md:rounded-none mb-1 md:mb-0 transition-all duration-300`}
            style={{ 
              opacity: (isFullScreenPlayer && isIdle) ? 0 : 1, 
              pointerEvents: (isFullScreenPlayer && isIdle) ? 'none' : 'auto' 
            }}
            onClick={(e) => {
              // On mobile, tapping the bottom player (except controls) expands to fullscreen
              if (window.innerWidth < 768 && !e.target.closest('button')) {
                setIsFullScreenPlayer(true);
              }
            }}
          >
            {/* Song Info */}
            <div className="flex items-center gap-3 md:gap-4 w-full md:w-1/3 overflow-hidden cursor-pointer md:cursor-default">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-brand-dark rounded-md shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                {currentSong.cover_image_url ? 
                  <img src={resolveUrl(currentSong.cover_image_url)} className="w-full h-full object-cover"/> : 
                  <Music className="w-6 h-6 text-brand-muted" />
                }
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-semibold text-brand-primary truncate">{currentSong.title}</div>
                <div className="flex items-center gap-1 text-[10px] md:text-xs text-brand-muted truncate mt-0.5">
                  {currentSong.artists && currentSong.artists.length > 0 ? (
                    currentSong.artists.map((artist, idx) => (
                      <React.Fragment key={artist.id}>
                        <Link 
                          to={`/dashboard/artist/${artist.id}`}
                          className="hover:text-brand-primary transition-colors whitespace-nowrap"
                        >
                          {artist.name}
                        </Link>
                        {idx < currentSong.artists.length - 1 && <span className="text-white/20">,</span>}
                      </React.Fragment>
                    ))
                  ) : (
                    <Link 
                      to={`/dashboard/artist/${currentSong.artist_id}`}
                      className="hover:text-brand-primary transition-colors"
                    >
                      {currentSong.artist_name}
                    </Link>
                  )}
                </div>
              </div>
              
              <button 
                onClick={() => toggleLike(currentSong.song_id)}
                title={likedSongs.has(currentSong.song_id) ? "Remove from Liked Songs" : "Add to Liked Songs"}
                className={`ml-1 md:ml-2 p-1.5 md:p-2 rounded-full transition-colors ${likedSongs.has(currentSong.song_id) ? 'text-brand-primary' : 'text-brand-muted hover:text-brand-primary'}`}
              >
                <Heart className={`w-4 h-4 md:w-5 md:h-5 ${likedSongs.has(currentSong.song_id) ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            {/* Controls (Desktop) & Mobile Play/Pause */}
            <div className="flex-none md:flex-1 flex items-center justify-end md:justify-center md:flex-col gap-2.5 ml-auto pl-2 shrink-0">
              <div className="flex items-center gap-2 md:gap-4">
                <button onClick={toggleShuffle} title={shuffleMode ? "Disable Shuffle" : "Enable Shuffle"} className={`hidden md:block transition-colors ${shuffleMode ? 'text-brand-primary' : 'text-brand-muted hover:text-brand-primary'}`}>
                  <Shuffle className="w-4 h-4" />
                </button>
                <button onClick={playPrevious} title="Previous" className="hidden md:block text-brand-muted hover:text-brand-primary transition-colors">
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                  title={isPlaying ? "Pause" : "Play"}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-brand-primary text-brand-dark flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm"
                >
                  {isPlaying ? <Pause className="w-4 h-4 md:w-5 md:h-5 fill-current" /> : <Play className="w-4 h-4 md:w-5 md:h-5 fill-current ml-1" />}
                </button>

                <button onClick={playNext} title="Next" className="hidden md:block text-brand-muted hover:text-brand-primary transition-colors">
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>
                <button onClick={toggleRepeat} title={repeatMode === 'one' ? "Repeat One" : repeatMode === 'all' ? "Disable Repeat" : "Enable Repeat"} className={`hidden md:block transition-colors ${repeatMode !== 'off' ? 'text-brand-primary' : 'text-brand-muted hover:text-brand-primary'}`}>
                  {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Progress Bar (Desktop only) */}
              <div className="hidden md:flex w-full max-w-md items-center gap-3 text-xs text-brand-muted font-medium">
                <span>{formatTime((progress / 100) * duration)}</span>
                <div className="flex-1 flex items-center px-2 group">
                  <ElasticSlider
                    defaultValue={progress}
                    maxValue={100}
                    onChange={(val) => seek(val)}
                    className="w-full !p-0"
                    leftIcon={null}
                    rightIcon={null}
                  />
                </div>
                <span>{formatTime(duration || currentSong.duration)}</span>
              </div>
            </div>
            
            {/* Volume, Queue, Timer & Fullscreen */}
            <div className="hidden md:flex w-1/3 justify-end items-center gap-2">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                title={volume === 0 ? "Unmute" : "Mute"}
                className="text-brand-muted hover:text-brand-primary transition-colors"
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <div className="w-24 flex items-center pr-2 group">
                <ElasticSlider
                  defaultValue={Math.round(volume * 100)}
                  maxValue={100}
                  onChange={(val) => setVolume(val / 100)}
                  className="w-full !p-0"
                  leftIcon={null}
                  rightIcon={null}
                />
              </div>

              {/* Queue Button */}
              <button
                onClick={(e) => { e.stopPropagation(); setShowQueue(!showQueue); }}
                className={`relative p-2 rounded-full transition-colors ${showQueue ? 'text-brand-primary bg-white/[0.06]' : 'text-brand-muted hover:text-brand-primary'}`}
                title="Queue"
              >
                <ListMusic className="w-4 h-4 md:w-4 md:h-4" />
              </button>

              {/* Sleep Timer Button (Desktop Only) */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setShowSleepMenu(!showSleepMenu)}
                  className={`p-2 rounded-full transition-colors relative ${sleepTimer ? 'text-sky-400' : 'text-brand-muted hover:text-brand-primary'}`}
                  title="Sleep Timer"
                >
                  <Moon className="w-4 h-4" />
                  {sleepTimer && (
                    <span className="absolute -top-1.5 -right-2 text-[9px] font-black text-sky-400 whitespace-nowrap">
                      {formatTimerDisplay(sleepTimer)}
                    </span>
                  )}
                </button>
                {showSleepMenu && (
                  <div className="absolute bottom-full right-0 mb-3 w-44 bg-brand-surface border border-white/[0.06] rounded-xl shadow-2xl p-2 z-[60] animate-fade-in">
                    <div className="text-[10px] font-bold text-brand-muted uppercase tracking-widest px-3 py-2">Sleep Timer</div>
                    {[5, 15, 30, 45, 60, 90].map(mins => (
                      <button
                        key={mins}
                        onClick={() => { setSleepTimer(mins); setShowSleepMenu(false); }}
                        className="w-full text-left px-3 py-2 text-sm font-medium text-brand-primary hover:bg-white/[0.04] rounded-lg transition-colors"
                      >
                        {mins} minutes
                      </button>
                    ))}
                    {sleepTimer && (
                      <button
                        onClick={() => { cancelSleepTimer(); setShowSleepMenu(false); }}
                        className="w-full text-left px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border-t border-white/[0.04] mt-1"
                      >
                        Cancel timer
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsFullScreenPlayer(!isFullScreenPlayer)}
                title={isFullScreenPlayer ? "Minimize Player" : "Expand Player"}
                className="hidden md:block text-brand-muted hover:text-brand-primary transition-colors ml-1"
              >
                {isFullScreenPlayer ? <ChevronDown className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Progress Bar absolute bottom edge */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-brand-primary/20 md:hidden w-full rounded-b-xl overflow-hidden">
               <div className="h-full bg-brand-primary transition-all duration-200" style={{ width: `${(progress / 100) * 100}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomPlayer;
