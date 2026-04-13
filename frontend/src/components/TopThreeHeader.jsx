import React from 'react';
import { Play } from 'lucide-react';

/* ============ Top Three Trending Header ============ */
const TopThreeHeader = ({ trendingSongs, resolveUrl, onPlay }) => {
  if (!trendingSongs || trendingSongs.length === 0) {
    return (
      <div className="hidden md:block pt-6 pb-10 px-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[280px]">
          {[...Array(3)].map((_, i) => (
            <div key={`skeleton-top-three-${i}`} className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  const topThree = trendingSongs.slice(0, 3);

  return (
    <div className="hidden md:block animate-fade-in pt-6 pb-10 px-8 max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[280px]">
        {topThree.slice(0, 3).map((song, i) => (
          <div 
            key={`top-three-song-${song.saavn_id || song.song_id || i}-${i}`}
            onClick={() => onPlay(song)}
            className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-2xl border border-white/5 bg-brand-surface"
          >
            <img 
              src={resolveUrl(song.cover_image_url)} 
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              alt=""
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
            
            {/* Minimal Content Overlay */}
            <div className="absolute bottom-0 left-0 p-6 z-10 w-full transform transition-transform duration-500 group-hover:-translate-y-1">
              <div className="flex items-center gap-1.5 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-primary">Listen Now</span>
              </div>
              <h2 className="text-xl font-black text-white leading-tight truncate drop-shadow-lg mb-0.5">{song.title}</h2>
              <p className="text-white/50 text-xs font-bold truncate">{song.artist_name}</p>
            </div>

            {/* Hover Play Button */}
            <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-xl">
               <Play className="w-5 h-5 fill-current text-brand-dark ml-0.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopThreeHeader;
