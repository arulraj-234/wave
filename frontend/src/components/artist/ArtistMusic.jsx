import React from 'react';
import { Music as MusicIcon, ListMusic, Play, Upload, TrendingUp } from 'lucide-react';
import { resolveUrl } from '../../api';

const ArtistMusic = ({ albums, songs, onCreateRelease }) => {
  // Sort songs by play count descending
  const sortedSongs = [...songs].sort((a, b) => (b.play_count || 0) - (a.play_count || 0));
  const totalPlays = sortedSongs.reduce((sum, s) => sum + (s.play_count || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Your Discography</h2>
          <p className="text-xs text-white/30 font-bold mt-1">
            {songs.length} tracks • {albums.length} albums • {totalPlays.toLocaleString()} total plays
          </p>
        </div>
        <button 
          onClick={onCreateRelease}
          className="btn-primary py-2.5 px-6 flex items-center gap-2 font-bold shadow-lg hover:scale-105 transition-transform"
        >
          <Upload className="w-4 h-4" />
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
           <h3 className="text-lg font-bold mb-4 text-white/60 tracking-tight hover:text-white transition-colors flex items-center gap-2">
             <TrendingUp className="w-5 h-5" /> All Tracks
             <span className="text-[10px] text-white/20 font-bold uppercase ml-2">Sorted by streams</span>
           </h3>
           <div className="space-y-2">
            {sortedSongs.map((song, index) => (
              <div 
                key={song.song_id} 
                className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.01] rounded-2xl hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  {/* Rank number */}
                  <span className={`w-6 text-center text-sm font-black tabular-nums hidden md:block ${index < 3 ? 'text-brand-primary' : 'text-white/15'}`}>
                    {index + 1}
                  </span>
                  <div className="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center overflow-hidden shadow-md relative group/play">
                    {song.cover_image_url ? (
                      <img src={resolveUrl(song.cover_image_url)} alt="cover" className="w-full h-full object-cover"/>
                    ) : (
                      <MusicIcon className="w-5 h-5 text-white/10" />
                    )}
                    {/* Play overlay */}
                    {song.audio_url && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/play:opacity-100 transition-opacity rounded-xl cursor-pointer">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
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
                      {song.artist_name && (
                        <span className="text-xs text-white/20 hidden md:inline">
                          {song.artist_name}
                        </span>
                      )}
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
                <button 
                  onClick={onCreateRelease}
                  className="mt-6 btn-primary py-2.5 px-6 flex items-center gap-2 font-bold"
                >
                  <Upload className="w-4 h-4" /> Upload Your First Song
                </button>
              </div>
            )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistMusic;
