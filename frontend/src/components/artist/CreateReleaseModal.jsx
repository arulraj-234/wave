import React, { useState } from 'react';
import { Upload, X, Music, Disc3, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import api from '../../api';

const CreateReleaseModal = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [releaseType, setReleaseType] = useState('single'); // 'single' or 'album'
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Form Data
  const [details, setDetails] = useState({ title: '', genre: '', cover: null });
  const [tracks, setTracks] = useState([]); // array of files
  
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!isOpen) return null;

  const handleNext = () => setStep(step + 1);
  const handleBack = () => { setErrorMsg(''); setStep(step - 1); };

  const handlePublish = async () => {
    setErrorMsg('');
    setIsPublishing(true);
    
    try {
      let albumId = null;
      
      // Step A: If Album, create Album first
      if (releaseType === 'album') {
        const albumData = new FormData();
        albumData.append('title', details.title);
        albumData.append('user_id', currentUser.id);
        if (details.cover) albumData.append('cover_image_file', details.cover);
        
        const albumRes = await api.post('/api/albums', albumData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
        albumId = albumRes.data.album.album_id;
      }
      
      // Step B: Upload tracks
      for (let i = 0; i < tracks.length; i++) {
        const file = tracks[i];
        const trackData = new FormData();
        trackData.append('audio_file', file);
        trackData.append('user_id', currentUser.id);
        
        // If single, attach title/genre/cover from details
        if (releaseType === 'single') {
          if (details.title) trackData.append('title', details.title);
          if (details.genre) trackData.append('genre', details.genre);
          if (details.cover) trackData.append('cover_image_file', details.cover);
        } else {
           // For album, we don't apply the album title to each track
           if (albumId) trackData.append('album_id', albumId);
           if (details.genre) trackData.append('genre', details.genre);
        }

        await api.post('/api/songs', trackData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
      }
      
      onComplete();
      
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Publish failed. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const resetAndClose = () => {
    setStep(1); setReleaseType('single'); setDetails({ title: '', genre: '', cover: null }); setTracks([]); setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-brand-surface border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold tracking-tight">Create Release</h2>
          <button onClick={resetAndClose} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X className="w-5 h-5 text-white/50" /></button>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-sm font-medium">
              {errorMsg}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-black mb-2 tracking-tight">What are you releasing?</h3>
              <p className="text-white/40 text-sm mb-6">Choose the format of your new music.</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setReleaseType('single')}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${releaseType === 'single' ? 'bg-brand-primary/10 border-brand-primary' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                >
                  <Music className={`w-12 h-12 ${releaseType === 'single' ? 'text-brand-primary' : 'text-white/40'}`} />
                  <div className="font-bold text-lg">Single</div>
                </button>
                <button 
                  onClick={() => setReleaseType('album')}
                  className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${releaseType === 'album' ? 'bg-brand-primary/10 border-brand-primary' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                >
                  <Disc3 className={`w-12 h-12 ${releaseType === 'album' ? 'text-brand-primary' : 'text-white/40'}`} />
                  <div className="font-bold text-lg">Album / EP</div>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h3 className="text-2xl font-black mb-6 tracking-tight">Release Details</h3>
              
              <div className="flex gap-6">
                 <div className="w-40 flex-shrink-0">
                    <label className="block w-full aspect-square border-2 border-dashed border-white/20 rounded-xl hover:bg-white/5 hover:border-brand-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group">
                       <input type="file" accept="image/*" className="hidden" onChange={(e) => setDetails({...details, cover: e.target.files[0]})} />
                       {details.cover ? (
                          <img src={URL.createObjectURL(details.cover)} alt="Cover" className="w-full h-full object-cover" />
                       ) : (
                          <div className="text-center p-4">
                             <Upload className="w-6 h-6 text-white/30 mx-auto mb-2 group-hover:text-brand-primary" />
                             <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Cover Art</span>
                          </div>
                       )}
                    </label>
                 </div>
                 
                 <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">{releaseType === 'single' ? "Track Title" : "Album Title"}</label>
                      <input 
                        type="text" 
                        placeholder={releaseType === 'single' ? "Leave blank to auto-detect" : "Album Title"}
                        className="w-full mt-1 bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-sm focus:ring-2 outline-none font-medium"
                        value={details.title}
                        onChange={(e) => setDetails({...details, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest ml-1">Genre</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Electronic"
                        className="w-full mt-1 bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-sm focus:ring-2 outline-none font-medium"
                        value={details.genre}
                        onChange={(e) => setDetails({...details, genre: e.target.value})}
                      />
                    </div>
                 </div>
              </div>
            </div>
          )}

          {step === 3 && (
             <div className="space-y-6 animate-in slide-in-from-right-4">
              <h3 className="text-2xl font-black mb-2 tracking-tight">Upload Tracks</h3>
              <p className="text-white/40 text-sm mb-6">{releaseType === 'single' ? 'Select 1 audio file.' : 'Select all audio files for the album.'}</p>
              
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl py-12 px-6 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-primary/40 transition-all cursor-pointer group">
                  <input 
                    type="file" 
                    accept="audio/*" 
                    multiple={releaseType === 'album'} 
                    className="hidden" 
                    onChange={(e) => setTracks(Array.from(e.target.files))} 
                  />
                  <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4 text-brand-primary group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold">{tracks.length > 0 ? `${tracks.length} file(s) selected` : "Choose Audios Files"}</span>
              </label>
              
              {tracks.length > 0 && (
                <div className="space-y-2 mt-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {tracks.map((t, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg text-sm font-medium">
                       <CheckCircle2 className="w-4 h-4 text-brand-success" />
                       <span className="truncate">{t.name}</span>
                    </div>
                  ))}
                </div>
              )}
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex items-center justify-between bg-black/20">
           {step > 1 ? (
             <button onClick={handleBack} disabled={isPublishing} className="px-5 py-2.5 rounded-xl font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30">Back</button>
           ) : <div />}
           
           {step < 3 ? (
             <button onClick={handleNext} className="btn-primary px-8 py-2.5 flex items-center gap-2 font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform">Next <ChevronRight className="w-4 h-4"/></button>
           ) : (
             <button 
               onClick={handlePublish} 
               disabled={isPublishing || tracks.length === 0}
               className="btn-primary px-8 py-2.5 flex items-center gap-2 font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
             >
               {isPublishing ? (
                 <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publishing...</>
               ) : (
                 <><Upload className="w-4 h-4"/> Publish Release</>
               )}
             </button>
           )}
        </div>

      </div>
    </div>
  );
};

export default CreateReleaseModal;
