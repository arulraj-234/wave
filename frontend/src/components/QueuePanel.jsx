import React, { useContext, useRef, useState } from 'react';
import { X, Music, Play, GripVertical, Trash2, ListMusic } from 'lucide-react';
import { PlayerContext } from '../context/PlayerContext';

const QueuePanel = ({ isOpen, onClose }) => {
  const { currentSong, queue, removeFromQueue, clearQueue, playSong, resolveUrl, reorderQueue } = useContext(PlayerContext);
  
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Touch-based reordering for mobile
  const touchStartY = useRef(null);
  const touchItemIndex = useRef(null);

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    setDraggedIndex(index);
  };

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      reorderQueue(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggedIndex(null);
  };

  const handleTouchStart = (e, index) => {
    touchStartY.current = e.touches[0].clientY;
    touchItemIndex.current = index;
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current === null || touchItemIndex.current === null) return;
    const endY = e.changedTouches[0].clientY;
    const diff = endY - touchStartY.current;
    const idx = touchItemIndex.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0 && idx > 0) reorderQueue(idx, idx - 1);
      if (diff > 0 && idx < queue.length - 1) reorderQueue(idx, idx + 1);
    }
    touchStartY.current = null;
    touchItemIndex.current = null;
  };


  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" />
      
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[380px] bg-brand-dark border-l border-white/[0.06] z-[70] flex flex-col animate-slide-in-right shadow-2xl">
        <div className="p-5 border-b border-white/[0.04] flex items-center justify-between shrink-0 pt-safe">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-primary flex items-center gap-2.5">
            <ListMusic className="w-4 h-4 text-brand-muted" />
            Queue
          </h2>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white/[0.06] flex items-center justify-center transition-colors text-brand-muted hover:text-brand-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentSong && (
          <div className="p-5 border-b border-white/[0.04] shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-3 block">Now Playing</span>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-surface shrink-0 shadow-md">
                {currentSong.cover_image_url ? (
                  <img src={resolveUrl(currentSong.cover_image_url)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Music className="w-5 h-5 text-brand-muted" /></div>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold truncate text-brand-primary">{currentSong.title}</div>
                <div className="text-xs text-brand-muted truncate">{currentSong.artist_name}</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {queue.length > 0 ? (
            <>
              <div className="p-5 pb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                  Next up · {queue.length} {queue.length === 1 ? 'song' : 'songs'}
                </span>
                <button onClick={clearQueue} className="text-[10px] font-bold uppercase tracking-widest text-brand-muted hover:text-red-400 transition-colors">
                  Clear all
                </button>
              </div>
              <div className="px-3 pb-4 space-y-0.5">
                {queue.map((song, idx) => (
                  <div 
                    key={`q-${song.song_id || song.saavn_id}-${idx}`} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragEnter={(e) => handleDragEnter(e, idx)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    onTouchStart={(e) => handleTouchStart(e, idx)}
                    onTouchEnd={handleTouchEnd}
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-all group cursor-grab active:cursor-grabbing hover:bg-white/[0.05] ${draggedIndex === idx ? 'opacity-30' : 'opacity-100'}`}
                  >
                    <GripVertical className="w-4 h-4 text-brand-muted/30 group-hover:text-brand-muted/80 cursor-grab shrink-0" />

                    <div className="w-10 h-10 rounded-md overflow-hidden bg-brand-surface shrink-0">
                      {song.cover_image_url ? (
                        <img src={resolveUrl(song.cover_image_url)} alt="" className="w-full h-full object-cover pointer-events-none" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center pointer-events-none"><Music className="w-3.5 h-3.5 text-brand-muted" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="text-sm font-semibold truncate text-brand-primary">{song.title}</div>
                      <div className="text-xs text-brand-muted truncate">{song.artist_name}</div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); removeFromQueue(idx); }} className="w-10 h-10 rounded-full bg-white/5 md:bg-transparent md:opacity-0 group-hover:opacity-100 hover:bg-red-500/20 flex items-center justify-center transition-all shrink-0 active:scale-90">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <ListMusic className="w-12 h-12 text-brand-muted/20 mb-4" />
              <p className="text-sm font-bold text-brand-muted mb-1">Your queue is empty</p>
              <p className="text-xs text-brand-muted/60">Add songs to play next</p>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
};

export default QueuePanel;
