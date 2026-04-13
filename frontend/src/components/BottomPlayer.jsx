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
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  // Compact bar swipe refs
  const compactTouchStartX = useRef(0);
  const compactTouchStartY = useRef(0);

  const resetIdleTimer = () => {
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (isFullScreenPlayer && window.innerWidth >= 768) {
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

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const deltaY = touchStartY.current - touchEndY.current;
    const deltaX = touchStartX.current - touchEndX.current;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Only trigger if dominant axis is clear
    if (absDeltaX > absDeltaY && absDeltaX > 60) {
      // Horizontal swipe on fullscreen cover art
      if (deltaX > 0) {
        playNext(); // swiped left → next
      } else {
        playPrevious(); // swiped right → previous
      }
    } else if (deltaY < -50 && touchEndY.current !== 0) {
      // Swiped down → minimize
      setIsFullScreenPlayer(false);
    }
    touchStartY.current = 0;
    touchEndY.current = 0;
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Compact bar swipe handlers
  const handleCompactTouchStart = (e) => {
    compactTouchStartX.current = e.touches[0].clientX;
    compactTouchStartY.current = e.touches[0].clientY;
  };

  const handleCompactTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = compactTouchStartX.current - endX;
    const deltaY = Math.abs(compactTouchStartY.current - endY);
    const absDeltaX = Math.abs(deltaX);

    if (absDeltaX > deltaY && absDeltaX > 60) {
      e.preventDefault();
      if (deltaX > 0) {
        playNext();
      } else {
        playPrevious();
      }
    }
  };

  if (!currentSong) return null;

  const sidebarOffset = isFullScreenPlayer ? 'left-0' : (isSidebarCollapsed ? 'left-0 md:left-20' : 'left-0 md:left-64');

  return (
    <>
      <QueuePanel isOpen={showQueue} onClose={() => setShowQueue(false)} />

      {/* Full Screen Player Overlay */}
      <AnimatePresence>
        {isFullScreenPlayer && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 w-full h-full pb-safe z-[45] flex flex-col md:items-center md:justify-center overflow-y-auto md:overflow-hidden cursor-default md:cursor-none"
            style={{ 
              background: `linear-gradient(to bottom, ${dominantColor} 0%, #121212 100%)`,
              cursor: (isIdle && window.innerWidth >= 768) ? 'none' : 'default'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Dimming gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent z-0 opacity-100" />

            {/* Desktop Fullscreen View */}
            <div className="hidden md:flex flex-col w-full h-full items-center justify-center relative z-10 p-12">
              <AnimatePresence>
                {!isIdle && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-12 right-12 flex gap-4 z-50"
                  >
                    <button 
                      onClick={() => {
                        if (!document.fullscreenElement) {
                          document.documentElement.requestFullscreen().catch(err => console.error("Fullscreen error:", err));
                        } else if (document.exitFullscreen) {
                          document.exitFullscreen();
                        }
                      }}
                      className="p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-brand-muted hover:text-white transition-all shadow-lg backdrop-blur-xl border border-white/[0.05]"
                      title="Toggle True Fullscreen"
                    >
                      <Maximize2 className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => setIsFullScreenPlayer(false)}
                      className="p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-brand-muted hover:text-white transition-all shadow-lg backdrop-blur-xl border border-white/[0.05]"
                      title="Minimize"
                    >
                      <ChevronDown className="w-6 h-6" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
                       <div className="flex-1 flex flex-col items-center justify-center w-full max-w-7xl pt-12 md:pb-12">
                {/* Hero Artwork - Stays visible in both states, maybe subtle scaling */}
                <motion.div 
                  layout
                  className="w-full max-w-[400px] lg:max-w-[460px] aspect-square relative transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]"
                >
                  <TiltedCard
                    imageSrc={resolveUrl(currentSong.cover_image_url) || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070'}
                    altText={currentSong.title}
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
                </motion.div>

                {/* Desktop Track Info - ONLY visible when IDLE (Spotify Style) */}
                <AnimatePresence mode="wait">
                  {isIdle && (
                    <motion.div 
                      key="idle-info"
                      initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-16 text-center pointer-events-none"
                    >
                      <h1 className="text-3xl lg:text-4xl font-extrabold text-white/90 tracking-tight mb-2">
                        {currentSong.title}
                      </h1>
                      <p className="text-xl lg:text-2xl font-medium text-white/40 tracking-normal">
                        {currentSong.artist_name}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Fullscreen View (Spotify Style) */}
            <div className="md:hidden flex flex-col w-full h-full relative z-10 px-6 pt-safe pb-8">
              {/* Top Header */}
              <div className="flex items-center justify-between shrink-0 mb-8 mt-4">
                <button onClick={() => setIsFullScreenPlayer(false)} className="p-2 text-white" title="Minimize">
                  <ChevronDown className="w-8 h-8" />
                </button>
                <div className="text-xs font-bold uppercase tracking-widest text-white/80">
                  Now Playing
                </div>
                <div className="w-8" /> {/* Spacer for centering */}
              </div>

              {/* Cover Art */}
              <div className="w-full aspect-square bg-brand-surface rounded-xl shadow-2xl overflow-hidden mb-8 shrink-0 flex items-center justify-center">
                {currentSong.cover_image_url ? (
                  <img src={resolveUrl(currentSong.cover_image_url)} alt="Cover Art" className="w-full h-full object-cover" />
                ) : (
                  <Music className="w-24 h-24 text-brand-muted" />
                )}
              </div>

              {/* Track Info & Like */}
              <div className="flex items-center justify-between mb-8 shrink-0">
                <div className="flex-1 min-w-0 pr-4">
                  <h1 className="text-2xl font-bold text-white truncate mb-1">{currentSong.title}</h1>
                  <p className="text-brand-muted font-medium text-lg truncate">{currentSong.artist_name}</p>
                </div>
                <button 
                  onClick={() => toggleLike(currentSong.song_id)}
                  title={likedSongs.has(currentSong.song_id) ? "Unlike" : "Like"}
                  className={`p-2 transition-colors ${likedSongs.has(currentSong.song_id) ? 'text-brand-primary' : 'text-brand-muted'}`}
                >
                  <Heart className={`w-7 h-7 ${likedSongs.has(currentSong.song_id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Mobile Progress Bar (using ElasticSlider) */}
              <div className="mb-6 shrink-0 text-brand-muted text-[11px] font-medium tracking-wide">
                <ElasticSlider
                  defaultValue={progress}
                  maxValue={100}
                  onChange={(val) => seek(val)}
                  className="w-full !p-0 mb-2"
                  leftIcon={null}
                  rightIcon={null}
                />
                <div className="flex justify-between w-full mt-2">
                  <span>{formatTime((progress / 100) * duration)}</span>
                  <span>{formatTime(duration || currentSong.duration)}</span>
                </div>
              </div>

               {/* Playback Controls */}
              <div className="flex items-center justify-between mb-6 shrink-0">
                <button onClick={toggleShuffle} className={`p-3 ${shuffleMode ? 'text-brand-primary' : 'text-brand-muted'}`} title="Shuffle">
                  <Shuffle className="w-6 h-6" />
                </button>
                <button onClick={playPrevious} className="p-3 text-white" title="Previous">
                  <SkipBack className="w-10 h-10 fill-current" />
                </button>
                <button 
                  onClick={togglePlay}
                  title={isPlaying ? "Pause" : "Play"}
                  className="w-20 h-20 rounded-full bg-brand-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                >
                  {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1.5" />}
                </button>
                <button onClick={playNext} className="p-3 text-white" title="Next">
                  <SkipForward className="w-10 h-10 fill-current" />
                </button>
                <button onClick={toggleRepeat} className={`p-3 ${repeatMode !== 'off' ? 'text-brand-primary' : 'text-brand-muted'}`} title="Repeat">
                  {repeatMode === 'one' ? <Repeat1 className="w-6 h-6" /> : <Repeat className="w-6 h-6" />}
                </button>
              </div>

               {/* Extra Bottom Actions (Queue) */}
              <div className="flex items-center justify-between mt-auto">
                <button className="p-2 text-brand-muted" title="Volume">
                  <Volume2 className="w-5 h-5 invisible" /> {/* Placeholder for balance */}
                </button>
                <button 
                  onClick={() => setShowQueue(!showQueue)}
                  title="Queue"
                  className={`p-2 transition-colors ${showQueue ? 'text-brand-primary' : 'text-brand-muted hover:text-white'}`}
                >
                  <ListMusic className="w-6 h-6" />
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bottom Control Bar (Compact Toolbar) - always visible unless mobile fullscreen */}
      <AnimatePresence>
        {(!isFullScreenPlayer || window.innerWidth >= 768) && (
          <motion.div 
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 200 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`fixed bottom-[4rem] md:bottom-0 ${sidebarOffset} right-0 h-[4.5rem] md:h-24 bg-brand-surface/95 md:bg-brand-surface/90 backdrop-blur-xl border-t border-white/[0.02] ${isFullScreenPlayer ? 'z-[50]' : 'z-[40]'} flex items-center px-4 md:px-8 mx-2 md:mx-0 rounded-xl md:rounded-none mb-1 md:mb-0 transition-all duration-300 shadow-xl md:shadow-none pb-safe`}
            onTouchStart={handleCompactTouchStart}
            onTouchEnd={handleCompactTouchEnd}
            style={{ 
              display: (isFullScreenPlayer && window.innerWidth < 768) ? 'none' : 'flex',
              opacity: (isFullScreenPlayer && isIdle && window.innerWidth >= 768) ? 0 : 1, 
              pointerEvents: (isFullScreenPlayer && isIdle && window.innerWidth >= 768) ? 'none' : 'auto' 
            }}
            onClick={(e) => {
              if (window.innerWidth < 768 && !e.target.closest('button')) {
                setIsFullScreenPlayer(true);
              }
            }}
          >
            {/* Song Info */}
            <div className="flex items-center gap-3 w-full md:w-1/3 overflow-hidden cursor-pointer md:cursor-default">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-brand-dark rounded-md shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                {currentSong.cover_image_url ? 
                  <img src={resolveUrl(currentSong.cover_image_url)} className="w-full h-full object-cover"/> : 
                  <Music className="w-6 h-6 text-brand-muted" />
                }
              </div>
              <div className="overflow-hidden min-w-0 pr-1">
                <div className="text-sm font-semibold text-white truncate">{currentSong.title}</div>
                <div className="flex items-center gap-1 text-[10px] md:text-xs text-brand-muted truncate mt-0.5">
                  {currentSong.artists && currentSong.artists.length > 0 ? (
                    currentSong.artists.map((artist, idx) => (
                      <React.Fragment key={artist.id}>
                        <span className="hover:text-white transition-colors">{artist.name}</span>
                        {idx < currentSong.artists.length - 1 && <span className="text-white/20">,</span>}
                      </React.Fragment>
                    ))
                  ) : (
                    <span className="hover:text-white transition-colors">{currentSong.artist_name}</span>
                  )}
                </div>
              </div>
              
               <button 
                onClick={(e) => { e.stopPropagation(); toggleLike(currentSong.song_id); }}
                title={likedSongs.has(currentSong.song_id) ? "Unlike" : "Like"}
                className={`ml-auto md:ml-2 p-1.5 md:p-2 rounded-full transition-colors ${likedSongs.has(currentSong.song_id) ? 'text-brand-primary' : 'text-white/60 hover:text-white'}`}
              >
                <Heart className={`w-5 h-5 md:w-5 md:h-5 ${likedSongs.has(currentSong.song_id) ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            {/* Controls (Desktop) & Mobile Play/Pause */}
            <div className="flex-none md:flex-1 flex items-center justify-end md:justify-center md:flex-col gap-2.5 ml-2 pl-2 shrink-0 md:ml-0 md:pl-0">
               <div className="flex items-center gap-3 md:gap-4">
                <button onClick={toggleShuffle} className={`hidden md:block transition-colors ${shuffleMode ? 'text-brand-primary' : 'text-brand-muted hover:text-white'}`} title="Shuffle">
                  <Shuffle className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); playPrevious(); }} className="hidden md:block text-brand-muted hover:text-white transition-colors" title="Previous">
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                  title={isPlaying ? "Pause" : "Play"}
                  className="w-10 h-10 md:w-10 md:h-10 rounded-full bg-brand-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                >
                  {isPlaying ? <Pause className="w-4 h-4 md:w-5 md:h-5 fill-current" /> : <Play className="w-4 h-4 md:w-5 md:h-5 fill-current ml-1" />}
                </button>

                 <button onClick={(e) => { e.stopPropagation(); playNext(); }} className="hidden md:block text-brand-muted hover:text-white transition-colors" title="Next">
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>
                <button onClick={toggleRepeat} className={`hidden md:block transition-colors ${repeatMode !== 'off' ? 'text-brand-primary' : 'text-brand-muted hover:text-white'}`} title="Repeat">
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
            
             {/* Volume, Queue, Timer & Fullscreen (Desktop only mostly) */}
            <div className="hidden md:flex w-1/3 justify-end items-center gap-2">
              <button onClick={() => setVolume(volume > 0 ? 0 : 0.7)} className="text-brand-muted hover:text-white transition-colors" title="Mute/Unmute">
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

               <button
                onClick={(e) => { e.stopPropagation(); setShowQueue(!showQueue); }}
                title="Queue"
                className={`relative p-2 rounded-full transition-colors ${showQueue ? 'text-brand-primary bg-white/[0.06]' : 'text-brand-muted hover:text-white'}`}
              >
                <ListMusic className="w-4 h-4" />
              </button>

              <div className="relative">
                 <button
                  onClick={() => setShowSleepMenu(!showSleepMenu)}
                  title="Sleep Timer"
                  className={`p-2 rounded-full transition-colors relative ${sleepTimer ? 'text-sky-400' : 'text-brand-muted hover:text-white'}`}
                >
                  <Moon className="w-4 h-4" />
                  {sleepTimer && (
                    <span className="absolute -top-1.5 -right-2 text-[9px] font-black text-sky-400">
                      {formatTimerDisplay(sleepTimer)}
                    </span>
                  )}
                </button>
                {showSleepMenu && (
                  <div className="absolute bottom-full right-0 mb-3 w-44 bg-brand-surface border border-white/[0.06] rounded-xl shadow-2xl p-2 z-[60]">
                    <div className="text-[10px] font-bold text-brand-muted uppercase tracking-widest px-3 py-2">Sleep Timer</div>
                    {[5, 15, 30, 45, 60, 90].map(mins => (
                      <button
                        key={mins}
                        onClick={() => { setSleepTimer(mins); setShowSleepMenu(false); }}
                        className="w-full text-left px-3 py-2 text-sm font-medium text-white hover:bg-white/[0.08] rounded-lg transition-colors"
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
                title={isFullScreenPlayer ? "Minimize" : "Fullscreen"}
                className="text-brand-muted hover:text-white transition-colors ml-1 p-2"
              >
                {isFullScreenPlayer ? <ChevronDown className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Progress Bar (absolute bottom edge of compact bar) */}
            <div className="absolute bottom-0 left-0 h-[2.5px] bg-white/10 md:hidden w-full rounded-b-xl overflow-hidden shadow-inner">
               <div className="h-full bg-brand-primary shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-300 ease-linear" style={{ width: `${(progress / 100) * 100}%` }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomPlayer;
