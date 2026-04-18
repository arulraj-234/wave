import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mic2, AlertCircle } from 'lucide-react';
import api from '../api';

const parseLRC = (lrcString) => {
  if (!lrcString) return [];
  const lines = lrcString.split('\n');
  const parsed = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  lines.forEach((line) => {
    const match = line.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const ms = parseInt(match[3], 10) / (match[3].length === 2 ? 100 : 1000);
      const timeInSec = minutes * 60 + seconds + ms;
      const text = line.replace(timeRegex, '').trim();
      if (text) {
        parsed.push({ time: timeInSec, text });
      }
    }
  });

  return parsed;
};

const LyricsPanel = ({ currentSong, currentTime, dominantColor, onClose }) => {
  const [lyrics, setLyrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const { playSong } = React.useContext(require('../context/PlayerContext').PlayerContext);
  const lineRefs = useRef([]);

  useEffect(() => {
    let active = true;
    const fetchLyrics = async () => {
      if (!currentSong?.song_id && !currentSong?.saavn_id) return;
      setLoading(true);
      setError(null);
      setLyrics([]);

      try {
        const id = currentSong.saavn_id ? `saavn_${currentSong.saavn_id}` : currentSong.song_id;
        const res = await api.get(`/api/songs/${id}/lyrics`);
        if (active && res.data?.success) {
          if (res.data.syncedLyrics) {
            setLyrics(parseLRC(res.data.syncedLyrics));
          } else if (res.data.plainLyrics) {
            setLyrics([{ time: 0, text: res.data.plainLyrics, isStatic: true }]);
          } else if (res.data.instrumental) {
            setLyrics([{ time: 0, text: '• Instrumental •', isStatic: true }]);
          } else {
            setError("No lyrics available for this song.");
          }
        } else if (active) {
            setError("No lyrics available for this song.");
        }
      } catch (err_ignored) {
        if (active) setError("Failed to load lyrics.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchLyrics();
    return () => { active = false; };
  }, [currentSong]);

  // Handle tap to seek
  const handleLineClick = (lineTime) => {
    if (lineTime === undefined || loading) return;
    // We need to access audioRef from context or just trigger a seek event
    // Ideally, PlayerContext should expose a seekTo(time) function.
    // Let's check PlayerContext.
  };

  useEffect(() => {
    if (!lyrics.length || lyrics[0].isStatic) return;

    let newActiveIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        newActiveIndex = i;
      } else {
        break;
      }
    }
    
    if (newActiveIndex === -1 && currentTime < (lyrics[0]?.time || 0)) {
        newActiveIndex = 0;
    }

    if (newActiveIndex !== activeIndex && newActiveIndex !== -1) {
      setActiveIndex(newActiveIndex);
      
      // PRECISE CENTERING ENGINE 
      if (scrollRef.current && lineRefs.current[newActiveIndex]) {
        const container = scrollRef.current;
        const activeLine = lineRefs.current[newActiveIndex];
        
        const containerHeight = container.offsetHeight;
        const lineTop = activeLine.offsetTop;
        const lineHeight = activeLine.offsetHeight;
        
        // Calculate the scrollTop needed to center the line
        const targetScroll = lineTop - (containerHeight / 2) + (lineHeight / 2);
        
        container.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
    }
  }, [currentTime, lyrics, activeIndex]);

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 150 }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-brand-dark/95 backdrop-blur-3xl"
      style={{
         background: `linear-gradient(to bottom, ${dominantColor}50, #0a0a0a 90%)`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 md:p-10 shrink-0 z-10 bg-gradient-to-b from-black/20 to-transparent">
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/5 shadow-2xl shrink-0">
                <Mic2 className="w-5 h-5 md:w-6 md:h-6 text-brand-primary" />
            </div>
            <div className="min-w-0">
                <h2 className="text-lg md:text-2xl font-black text-white drop-shadow-md tracking-tight leading-tight truncate">
                    {currentSong?.title || "Lyrics"}
                </h2>
                <p className="text-white/60 font-medium text-xs md:text-base truncate">
                    {currentSong?.artist_name}
                </p>
            </div>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center transition-all border border-white/10"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {/* Lyrics Container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto px-6 md:px-12 pb-[60vh] pt-[30vh] custom-scrollbar scroll-smooth relative"
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            >
              <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                      <motion.div 
                          key={i} 
                          className="w-3 h-3 rounded-full bg-brand-primary"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                      />
                  ))}
              </div>
              <p className="text-white/40 font-black tracking-widest uppercase text-xs">Syncing Lyrics</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
            >
                 <AlertCircle className="w-14 h-14 text-white/20 mb-4" />
                 <p className="text-xl font-bold text-white/50">{error}</p>
            </motion.div>
          ) : lyrics.length > 0 && lyrics[0].isStatic ? (
            <div className="whitespace-pre-line text-2xl md:text-3xl font-bold text-white/80 leading-relaxed text-center py-20">
              {lyrics[0].text}
            </div>
          ) : (
            <div className="space-y-6 md:space-y-10 flex flex-col items-start">
              {lyrics.map((line, i) => {
                const isActive = i === activeIndex;
                const isPassed = i < activeIndex;
                
                return (
                  <motion.div
                    key={i}
                    ref={el => lineRefs.current[i] = el}
                    initial={false}
                    animate={{
                      scale: isActive ? 1.05 : 1,
                      opacity: isActive ? 1 : isPassed ? 0.3 : 0.5,
                      filter: isActive ? 'blur(0px)' : isPassed ? 'blur(1px)' : 'blur(2px)',
                      x: isActive ? 10 : 0
                    }}
                    transition={{ type: 'spring', duration: 0.6, bounce: 0.3 }}
                    className={`lyric-line cursor-pointer group will-change-transform w-full text-left`}
                  >
                    <p className={`text-3xl md:text-6xl font-black leading-tight tracking-tight transition-colors duration-700 ${isActive ? 'text-white' : 'text-white/20'}`}>
                      {line.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

       {/* Floating Background Glow */}
       <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -left-1/4 w-[100%] h-[100%] rounded-full"
            style={{ background: `radial-gradient(circle, ${dominantColor} 0%, transparent 70%)`, filter: 'blur(100px)' }}
          />
       </div>

       <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
            width: 0px;
            background: transparent;
        }
        .lyric-line {
            transition: color 0.7s ease;
        }
       `}} />
    </motion.div>
  );
};

export default LyricsPanel;
