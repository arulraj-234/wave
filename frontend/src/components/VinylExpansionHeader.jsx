import React from 'react';

/* ============ Floating Vinyl Expansion Header ============ */
const VinylExpansionHeader = ({ currentSong, isPlaying, resolveUrl }) => {
  if (!currentSong) return null;

  return (
    <div className={`block relative w-full max-w-[1400px] mx-auto transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${currentSong ? 'h-[160px] md:h-[320px] opacity-100 mt-4 md:mt-6 mb-8 md:mb-10' : 'h-0 opacity-0 my-0 overflow-hidden'}`}>
      <div className="absolute inset-0 mx-4 md:mx-8 rounded-2xl md:rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center p-4 md:p-10 group">
        
        {/* Dynamic Background Blur */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen">
          <img src={resolveUrl(currentSong.cover_image_url)} alt="" className="w-full h-full object-cover blur-[80px] saturate-200" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent" />

        {/* Content Container */}
        <div className="relative z-10 flex items-center justify-between gap-4 md:gap-14 w-full h-full px-2 md:px-12">
          
          {/* Typography (Left Side) */}
          <div className="flex-1 min-w-0 pr-2 md:pr-8 transform transition-all duration-700 -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" style={{ opacity: 1, transform: 'translateX(0px)' }}>
             <h2 className="text-2xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-1 md:mb-3 truncate drop-shadow-2xl">
               {currentSong.title}
             </h2>
             <p className="text-sm md:text-xl text-white/60 font-medium truncate mb-2 md:mb-6">
               {currentSong.artist_name}
             </p>
          </div>

          {/* 3D Vinyl Player Assembly (Right Side) */}
          <div className="relative w-28 h-28 md:w-56 md:h-56 shrink-0 flex items-center justify-end">
            
            {/* The Record Wrapper (Handles Slide Out) */}
            <div className={`absolute right-0 w-28 h-28 md:w-56 md:h-56 transition-all duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isPlaying ? '-translate-x-12 md:-translate-x-32 opacity-100' : '-translate-x-2 md:-translate-x-4 opacity-20'}`}>
               
               {/* The Spinning Vinyl (Handles Rotation) */}
               <div 
                 className="w-full h-full rounded-full bg-[#0a0a0a] shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center justify-center border-[2px] border-[#1a1a1a] overflow-hidden relative"
                 style={{ animation: isPlaying ? 'spin 5s linear infinite' : 'none' }}
               >
                 {/* Grooves */}
                 <div className="absolute inset-[2px] md:inset-[4px] rounded-full border border-white/5" />
                 <div className="absolute inset-[5px] md:inset-[10px] rounded-full border border-white/[0.03]" />
                 <div className="absolute inset-[8px] md:inset-[16px] rounded-full border border-white/5" />
                 <div className="absolute inset-[12px] md:inset-[24px] rounded-full border border-white/[0.02]" />
                 <div className="absolute inset-[16px] md:inset-[32px] rounded-full border border-white/5" />
                 
                 {/* Center Label */}
                 <div className="w-10 h-10 md:w-[84px] md:h-[84px] rounded-full border-[2px] md:border-[3px] border-black overflow-hidden relative shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                   <img src={resolveUrl(currentSong.cover_image_url)} alt="" className="w-full h-full object-cover saturate-150" />
                   {/* Center hole */}
                   <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-brand-surface rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] border border-white/10" />
                 </div>

                 {/* Light reflection gradient overlay */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-white/[0.08] to-black/80 pointer-events-none mix-blend-overlay" />
               </div>
            </div>

            {/* The Album Sleeve (Static on Top, Right-Aligned) */}
            <div className="absolute right-0 w-28 h-28 md:w-56 md:h-56 rounded-xl overflow-hidden shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-10 border border-white/10 bg-brand-surface transform transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-2">
              <img src={resolveUrl(currentSong.cover_image_url)} alt={currentSong.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default VinylExpansionHeader;
