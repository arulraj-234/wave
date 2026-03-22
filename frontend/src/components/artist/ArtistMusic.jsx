import React from 'react';
import { Music as MusicIcon, ListMusic, Play } from 'lucide-react';
import { resolveUrl } from '../../api';

const ArtistMusic = ({ albums, songs, onCreateRelease }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black tracking-tight">Your Discography</h2>
        <button 
          onClick={onCreateRelease}
          className="btn-primary py-2 px-6 flex items-center gap-2 font-bold shadow-lg"
        >
          Create Release
        </button>
      </div>

      <div className="space-y-12">
        {/* Albums Section */}
        {albums.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-4 text-white/60 tracking-tight flex items-center gap-2 hover:text-white transition-colors">
              <ListMusic className="w-5 h-5"/> Albums & EPs
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {albums.map((album, index) => (
                <div 
                  key={album.album_id} 
                  className="p-4 bg-brand-surface rounded-2xl hover:bg-white/[0.04] transition-all group cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="aspect-square bg-brand-dark rounded-xl mb-4 overflow-hidden relative shadow-md group-hover:scale-[1.02] transition-transform duration-300">
                    {album.cover_image_url ? (
                      <img src={resolveUrl(album.cover_image_url)} alt="cover" className="w-full h-full object-cover"/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10"><MusicIcon className="w-12 h-12" /></div>
                    )}
                  </div>
                  <h4 className="font-bold text-sm truncate">{album.title}</h4>
                  <p className="text-xs text-white/40 mt-1">{album.track_count} tracks • {new Date(album.release_date).getFullYear()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Singles Section */}
        <div>
           <h3 className="text-lg font-bold mb-4 text-white/60 tracking-tight hover:text-white transition-colors">All Tracks</h3>
           <div className="space-y-2">
            {songs.map((song, index) => (
              <div 
                key={song.song_id} 
                className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.01] rounded-2xl hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center overflow-hidden shadow-md">
                    {song.cover_image_url ? (
                      <img src={resolveUrl(song.cover_image_url)} alt="cover" className="w-full h-full object-cover"/>
                    ) : (
                      <MusicIcon className="w-5 h-5 text-white/10" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-base leading-tight group-hover:text-brand-primary transition-colors">{song.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-white/30 font-bold tabular-nums">
                        {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                      </span>
                      <span className="text-xs text-brand-success/70 font-bold uppercase tracking-wider bg-brand-success/10 px-2 rounded-sm">
                        {song.genre || 'Single'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                    <div className="text-lg font-black text-white tabular-nums group-hover:scale-110 transition-transform origin-right">
                      {song.play_count?.toLocaleString() || 0}
                    </div>
                    <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Streams</div>
                </div>
              </div>
            ))}
            
            {songs.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-white/[0.01] rounded-full border border-dashed border-white/10 flex items-center justify-center mb-4">
                    <MusicIcon className="w-8 h-8 opacity-10" />
                </div>
                <h3 className="text-lg font-bold text-white/50">No music released yet</h3>
                <p className="text-sm text-white/30 mt-1 max-w-sm">Use the "Create Release" button above to publish your first track.</p>
              </div>
            )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistMusic;
