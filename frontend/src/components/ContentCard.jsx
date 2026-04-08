import React, { useState } from 'react';
import { Music, Play, Pause } from 'lucide-react';

/* ============ Playable Card (for songs/playlists/albums) ============ */
const ContentCard = ({ image, title, subtitle, onClick, isRound = false, size = 'normal', isCurrentlyPlaying = false, isCurrentlyPaused = false }) => {
  const w = size === 'large' ? 'w-40 md:w-52 shrink-0' : 'w-36 md:w-44 shrink-0';
  const [imgError, setImgError] = useState(false);
  
  return (
    <div onClick={onClick} className={`${w} p-2 md:p-3 rounded-2xl bg-brand-surface hover:bg-white/[0.04] transition-all duration-300 group cursor-pointer border border-transparent hover:border-white/[0.05]`}>
      <div className={`aspect-square bg-brand-dark ${isRound ? 'rounded-full' : 'rounded-xl'} mb-2 md:mb-3 overflow-hidden relative shadow-md flex items-center justify-center`}>
        {image && !imgError ? (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            loading="lazy"
            onError={() => setImgError(true)} 
          />
        ) : (
          <Music className="w-10 h-10 text-brand-muted opacity-50" />
        )}
        {/* Playing indicator — only show when this specific song is playing */}
        {isCurrentlyPlaying && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300">
            <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Pause className="w-5 h-5 fill-current text-brand-dark" />
            </div>
          </div>
        )}
        {/* Hover play — only on non-playing cards */}
        {!isCurrentlyPlaying && (
          <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <Play className="w-6 h-6 fill-current text-brand-dark ml-1" />
            </div>
          </div>
        )}
      </div>
      <div className="font-semibold truncate text-xs md:text-sm text-brand-primary">{title}</div>
      {subtitle && <div className="text-[10px] md:text-xs text-brand-muted truncate mt-0.5">{subtitle}</div>}
    </div>
  );
};

export default ContentCard;
