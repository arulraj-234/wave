import React, { useState } from 'react';
import { Music, Play } from 'lucide-react';

/* ============ Quick Pick Card (compact grid cards) ============ */
const QuickPickCard = ({ song, onClick, resolveUrl }) => {
  const [imgError, setImgError] = useState(false);
  return (
  <div onClick={onClick} className="flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.07] rounded-lg overflow-hidden cursor-pointer group transition-all duration-200 h-14 shadow-sm">
    <div className="w-14 h-14 shrink-0 bg-brand-dark relative flex items-center justify-center">
      {song.cover_image_url && !imgError ? (
        <img 
          src={resolveUrl(song.cover_image_url)} 
          alt="" 
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <Music className="w-5 h-5 text-brand-muted opacity-50" />
      )}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
        <Play className="w-5 h-5 fill-current text-white transform scale-75 group-hover:scale-100 transition-transform duration-300 ml-0.5" />
      </div>
    </div>
    <span className="text-xs font-bold text-brand-primary truncate pr-3 flex-1">{song.title}</span>
  </div>
  );
};

export default QuickPickCard;
