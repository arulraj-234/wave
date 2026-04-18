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

  useEffect(() => {
    let active = true;
    const fetchLyrics = async () => {
      if (!currentSong?.song_id && !currentSong?.saavn_id) return;
      setLoading(true);
      setError(null);
      setLyrics([]);

      try {
        const id = currentSong.saavn_id ? `saavn_${currentSong.saavn_id}` : currentSong.song_id;
        const res = await api.get(`/songs/${id}/lyrics`);
        if (active && res.data?.success) {
          if (res.data.syncedLyrics) {
            setLyrics(parseLRC(res.data.syncedLyrics));
          } else if (res.data.plainLyrics) {
            // Fallback for unsynced
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

  // Sync active lyric with currentTime
  useEffect(() => {
    if (!lyrics.length || lyrics[0].isStatic) return;

    let newActiveIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
        // Find the last lyric that is before or exactly at current time
      if (currentTime >= lyrics[i].time) {
        newActiveIndex = i;
      } else {
        break; // Lyrics are sorted by time, so we can break early
      }
    }
    
    // Default to first line if we haven't reached the first timestamp yet but we are close
    if (newActiveIndex === -1 && currentTime < (lyrics[0]?.time || 0)) {
        newActiveIndex = 0;
    }

    if (newActiveIndex !== activeIndex && newActiveIndex !== -1) {
      setActiveIndex(newActiveIndex);
      
      // Auto-scroll
      if (scrollRef.current) {
        const lines = scrollRef.current.querySelectorAll('.lyric-line');
        if (lines[newActiveIndex]) {
          lines[newActiveIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    }
  }, [currentTime, lyrics, activeIndex]);

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-brand-dark/95 backdrop-blur-3xl"
      style={{
         background: `linear-gradient(to bottom, ${dominantColor}40, #0a0a0a 80%)`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 md:p-10 shrink-0">
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
        className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto px-6 md:px-12 pb-64 pt-20 md:pt-32 custom-scrollbar scroll-smooth relative"
      >
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-6">
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
            <p className="text-white/40 font-black tracking-widest uppercase text-sm">Syncing Lyrics</p>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
               <AlertCircle className="w-16 h-16 text-white/20 mb-4" />
               <p className="text-xl font-bold text-white/50">{error}</p>
          </div>
        ) : lyrics.length > 0 && lyrics[0].isStatic ? (
          <div className="whitespace-pre-line text-2xl md:text-3xl font-bold text-white/80 leading-relaxed text-center py-20 pb-40">
            {lyrics[0].text}
          </div>
        ) : (
          <div className="space-y-6 md:space-y-8 flex flex-col">
            {lyrics.map((line, i) => {
              const isActive = i === activeIndex;
              const isPassed = i < activeIndex;
              
              return (
                <div
                  key={i}
                  className={`lyric-line transform transition-all duration-700 ease-in-out cursor-pointer group will-change-transform ${
                    isActive
                      ? 'scale-105 md:scale-110 opacity-100 text-white drop-shadow-2xl'
                      : isPassed 
                          ? 'scale-100 md:scale-95 opacity-30 text-white/40 blur-[0.5px] md:blur-[1px]'
                          : 'scale-100 md:scale-95 opacity-50 text-white/60 blur-[1px] md:blur-[1.5px]'
                  }`}
                >
                  <p className="text-2xl md:text-5xl font-black leading-tight tracking-tight origin-left transition-colors duration-500">
                    {line.text}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

       {/* Bottom Fade Gradient for smooth scrolling transition */}
       <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
       
       <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
            width: 0px;
            background: transparent;
        }
       `}} />
    </motion.div>
  );
};

export default LyricsPanel;
