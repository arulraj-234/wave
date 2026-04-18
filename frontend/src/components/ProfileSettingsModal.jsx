import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { resolveUrl } from '../api';
import { X, Camera, User, Check, Loader2, LogOut, ChevronRight, BarChart3, Clock, Shield, Info, Edit2, CheckCircle, XCircle, Download, Headphones, Sparkles, Sliders } from 'lucide-react';
import api from '../api';
import { useToast } from '../context/ToastContext';

const ProfileSettingsModal = ({ isOpen, onClose, user, onUpdate }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'streaming', 'about'

  const [formData, setFormData] = useState({
    username: user?.username || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    avatar_url: user?.avatar_url || '',
    streaming_quality: user?.streaming_quality || 'auto'
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(resolveUrl(user?.avatar_url) || '');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [usernameFormatError, setUsernameFormatError] = useState('');
  const usernameTimerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [issueDescription, setIssueDescription] = useState('');
  const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);

  React.useEffect(() => {
    if (user && isOpen) {
      setFormData({
        username: user?.username || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        avatar_url: user?.avatar_url || '',
        streaming_quality: user?.streaming_quality || 'auto'
      });
      setPreviewUrl(resolveUrl(user?.avatar_url) || '');
      setSelectedFile(null);
    }
  }, [user, isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStatus('dirty');
    }
  };

  const checkUsername = useCallback((username) => {
    if (usernameTimerRef.current) clearTimeout(usernameTimerRef.current);
    if (!username || username.length < 3 || username === user?.username) {
      setUsernameStatus(null);
      return;
    }
    setUsernameStatus('checking');
    usernameTimerRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/api/auth/check-username/${encodeURIComponent(username)}`);
        setUsernameStatus(res.data.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus(null);
      }
    }, 500);
  }, [user]);

  const handleUsernameChange = (val) => {
    const rawVal = val.toLowerCase();
    
    if (rawVal && !/^[a-z0-9_]+$/.test(rawVal)) {
      setUsernameFormatError('Username can only contain letters, numbers, and underscores (no spaces)');
    } else {
      setUsernameFormatError('');
    }

    setFormData({ ...formData, username: rawVal });
    
    if (rawVal.length >= 3 && /^[a-z0-9_]+$/.test(rawVal)) {
      checkUsername(rawVal);
    } else {
      if (usernameTimerRef.current) clearTimeout(usernameTimerRef.current);
      setUsernameStatus(null);
    }
    
    setStatus('dirty');
  };

  const handleSaveQuality = async (quality) => {
    setFormData(prev => ({ ...prev, streaming_quality: quality }));
    try {
      const response = await api.post('/api/auth/profile', {
        user_id: user.id,
        streaming_quality: quality
      });
      if (response.data.success) {
        onUpdate(response.data.user);
        toast.success(`Quality set to ${quality}`);
      }
    } catch (err) {
      toast.error('Failed to update quality');
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (usernameStatus === 'taken' || usernameFormatError) {
      toast.error('Please fix username formatting or availability issues');
      return;
    }
    setIsLoading(true);
    setStatus(null);
    try {
      let finalAvatarUrl = formData.avatar_url;

      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('avatar', selectedFile);
        const uploadResponse = await api.post('/api/auth/upload-avatar', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (uploadResponse.data.success) {
          finalAvatarUrl = uploadResponse.data.avatar_url;
        }
      }

      const response = await api.post('/api/auth/profile', {
        user_id: user.id,
        username: formData.username,
        avatar_url: finalAvatarUrl,
        first_name: formData.first_name?.trim(),
        last_name: formData.last_name?.trim(),
        streaming_quality: formData.streaming_quality
      });

      if (response.data.success) {
        onUpdate(response.data.user);
        setStatus('success');
        toast.success('Settings saved!');
        setTimeout(() => setStatus(null), 2000);
      }
    } catch (error) {
      setStatus('error');
      toast.error(error.response?.data?.error || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportIssue = async () => {
    if (!issueDescription.trim()) return;
    setIsSubmittingIssue(true);
    try {
      await api.post('/api/issues/', {
        description: issueDescription,
        error_log: 'Manual report'
      });
      toast.success('Issue reported! Thank you.');
      setIssueDescription('');
      setShowIssueForm(false);
    } catch (err) {
      toast.error('Failed to send report');
    } finally {
      setIsSubmittingIssue(false);
    }
  };

  const isDirty = selectedFile || formData.username !== user?.username || 
                  formData.first_name !== user?.first_name || 
                  formData.last_name !== user?.last_name ||
                  formData.streaming_quality !== user?.streaming_quality;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 pb-safe">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="font-sans relative w-full h-[100dvh] md:max-w-4xl md:h-[700px] bg-brand-surface/95 md:bg-brand-surface border-t border-white/10 md:border md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden backdrop-blur-3xl"
          >
            {/* Mobile Animated Glowing Background Layer */}
            <div className="absolute inset-0 z-0 md:hidden pointer-events-none opacity-50">
              <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-brand-primary/20 blur-[80px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
              <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-500/20 blur-[80px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }} />
            </div>

            {/* Sidebar Navigation */}
            <div className="relative z-10 w-full md:w-64 bg-black/40 md:bg-black/20 border-b md:border-b-0 md:border-r border-white/5 flex flex-col p-4 md:p-6 shrink-0">
               <div className="flex items-center justify-between mb-4 md:mb-8">
                  <h2 className="text-xl md:text-2xl font-black text-white italic tracking-tighter">Settings</h2>
                  <button onClick={onClose} className="md:hidden text-white/60 hover:text-white bg-white/5 p-2 rounded-full"><X className="w-5 h-5" /></button>
               </div>
               
               <div className="flex md:flex-col overflow-x-auto hide-scrollbar md:space-y-1 gap-2 pb-2 md:pb-0 md:flex-1">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`shrink-0 flex items-center justify-center md:justify-start gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-full md:rounded-xl transition-all font-bold text-xs md:text-sm ${activeTab === 'profile' ? 'bg-brand-primary text-brand-dark' : 'bg-white/5 md:bg-transparent text-brand-muted hover:bg-white/10 hover:text-white'}`}
                  >
                    <User className="w-4 h-4" /> Profile
                  </button>
                  {user?.role !== 'artist' && (
                    <button 
                      onClick={() => setActiveTab('streaming')}
                      className={`shrink-0 flex items-center justify-center md:justify-start gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-full md:rounded-xl transition-all font-bold text-xs md:text-sm ${activeTab === 'streaming' ? 'bg-brand-primary text-brand-dark' : 'bg-white/5 md:bg-transparent text-brand-muted hover:bg-white/10 hover:text-white'}`}
                    >
                      <Headphones className="w-4 h-4" /> Streaming
                    </button>
                  )}
                  <button 
                    onClick={() => setActiveTab('about')}
                    className={`shrink-0 flex items-center justify-center md:justify-start gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-full md:rounded-xl transition-all font-bold text-xs md:text-sm ${activeTab === 'about' ? 'bg-brand-primary text-brand-dark' : 'bg-white/5 md:bg-transparent text-brand-muted hover:bg-white/10 hover:text-white'}`}
                  >
                    <Info className="w-4 h-4" /> About & Help
                  </button>
               </div>

               {isDirty && (
                 <motion.button
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   onClick={handleSave}
                   disabled={isLoading || usernameStatus === 'taken' || !!usernameFormatError}
                   className="hidden md:block mt-4 w-full py-3 bg-brand-primary text-brand-dark rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                 >
                   {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Changes'}
                 </motion.button>
               )}
            </div>

            {/* Content Area */}
            <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 pb-24 md:pb-10">
               {/* Tab: Profile */}
               {activeTab === 'profile' && (
                 <div className="space-y-8 max-w-lg">
                    <section>
                       <h3 className="text-sm font-black text-brand-primary uppercase tracking-widest mb-6">Profile Identity</h3>
                       <div className="flex items-center gap-6">
                          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                             <div className="w-24 h-24 rounded-2xl bg-brand-dark border-2 border-white/10 overflow-hidden flex items-center justify-center group-hover:border-brand-primary/40 transition-all">
                                {previewUrl ? <img src={previewUrl} alt="" className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-brand-muted" />}
                             </div>
                             <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                                <Camera className="w-6 h-6 text-white" />
                             </div>
                             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                          </div>
                          <div className="flex-1 space-y-4">
                             <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-brand-muted uppercase">Display Name</label>
                                <div className="flex gap-2">
                                   <input 
                                     type="text" 
                                     value={formData.first_name} 
                                     onChange={(e) => { setFormData({...formData, first_name: e.target.value}); setStatus('dirty'); }}
                                     placeholder="First Name"
                                     className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary/40"
                                   />
                                   <input 
                                     type="text" 
                                     value={formData.last_name} 
                                     onChange={(e) => { setFormData({...formData, last_name: e.target.value}); setStatus('dirty'); }}
                                     placeholder="Last Name"
                                     className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary/40"
                                   />
                                </div>
                             </div>
                          </div>
                       </div>
                    </section>

                    <section className="space-y-1.5">
                       <label className="text-[10px] font-bold text-brand-muted uppercase">Username</label>
                       <div className="relative">
                          <input 
                            type="text" 
                            value={formData.username} 
                            onChange={(e) => handleUsernameChange(e.target.value)}
                            className={`w-full bg-white/[0.03] border rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none transition-all ${usernameStatus === 'taken' ? 'border-red-500/50' : usernameStatus === 'available' ? 'border-emerald-500/50' : 'border-white/10 focus:border-brand-primary/40'}`}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                             {usernameStatus === 'available' && !usernameFormatError && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                             {(usernameStatus === 'taken' || usernameFormatError) && <XCircle className="w-4 h-4 text-red-400" />}
                             {usernameStatus === 'checking' && !usernameFormatError && <div className="w-4 h-4 border-2 border-brand-muted/30 border-t-brand-muted rounded-full animate-spin" />}
                          </div>
                       </div>
                       {usernameFormatError && <p className="text-[10px] text-amber-400 font-bold mt-1.5">{usernameFormatError}</p>}
                       <p className="text-[10px] text-brand-muted italic mt-1.5">Your unique handle on Wave. Changing this may affect shared links.</p>
                    </section>
                 </div>
               )}

               {/* Tab: Streaming */}
               {activeTab === 'streaming' && user?.role !== 'artist' && (
                 <div className="space-y-8 max-w-lg">
                    <section>
                       <h3 className="text-sm font-black text-brand-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Sliders className="w-4 h-4" /> Audio Quality
                       </h3>
                       <p className="text-xs text-brand-muted mb-6">Higher bitrates consume more data but sound incredible. "Extreme" uses 320kbps.</p>
                       
                       <div className="grid gap-3">
                          {[
                            { id: 'auto', label: 'Auto (Recommended)', desc: 'Balanced based on connection' },
                            { id: 'low', label: 'Data Saver (96kbps)', desc: 'Minimum data usage' },
                            { id: 'medium', label: 'Balanced (160kbps)', desc: 'Standard streaming quality' },
                            { id: 'high', label: 'High (256kbps)', desc: 'Premium clarity' },
                            { id: 'extreme', label: 'Extreme (320kbps+)', desc: 'Lossless-like experience' }
                          ].map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => { setFormData({...formData, streaming_quality: opt.id}); setStatus('dirty'); }}
                              className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${formData.streaming_quality === opt.id ? 'bg-brand-primary/10 border-brand-primary' : 'bg-white/[0.02] border-white/5 hover:border-white/20'}`}
                            >
                               <div>
                                  <p className={`text-sm font-bold ${formData.streaming_quality === opt.id ? 'text-brand-primary' : 'text-white'}`}>{opt.label}</p>
                                  <p className="text-[10px] text-brand-muted mt-0.5">{opt.desc}</p>
                               </div>
                               {formData.streaming_quality === opt.id && <Check className="w-5 h-5 text-brand-primary" />}
                            </button>
                          ))}
                       </div>
                    </section>
                 </div>
               )}

               {/* Tab: About */}
               {activeTab === 'about' && (
                 <div className="space-y-8 max-w-lg text-left">
                    <section className="space-y-4">
                       <h3 className="text-sm font-black text-brand-primary uppercase tracking-widest mb-6">App Info</h3>
                       <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
                          <div className="flex justify-between items-center">
                             <span className="text-xs font-bold text-white">Version</span>
                             <span className="text-xs font-medium text-brand-muted">2.2.0 (Build 943)</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-xs font-bold text-white">Environment</span>
                             <span className="text-xs font-medium text-brand-muted">Production (Cloud)</span>
                          </div>
                       </div>
                    </section>

                    <section className="space-y-4">
                       <h3 className="text-sm font-black text-brand-primary uppercase tracking-widest">Support</h3>
                       <button 
                         onClick={() => setShowIssueForm(!showIssueForm)}
                         className="w-full flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all"
                       >
                          <div className="flex items-center gap-3">
                             <Info className="w-5 h-5 text-blue-400" />
                             <span className="text-xs font-bold text-white">Report a Bug</span>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-brand-muted transition-transform ${showIssueForm ? 'rotate-90' : ''}`} />
                       </button>

                       <AnimatePresence>
                         {showIssueForm && (
                           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3">
                              <textarea 
                                value={issueDescription}
                                onChange={(e) => setIssueDescription(e.target.value)}
                                placeholder="Describe the problem..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary/40 min-h-[120px] resize-none"
                              />
                              <button 
                                onClick={handleReportIssue}
                                disabled={isSubmittingIssue || !issueDescription.trim()}
                                className="w-full py-3 bg-blue-500/20 text-blue-400 rounded-xl font-bold text-xs hover:bg-blue-500/30 transition-all"
                              >
                                 {isSubmittingIssue ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Submit Feedback'}
                              </button>
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </section>
                  </div>
               )}
              </div>
              
              {/* Sticky Save Button for Mobile */}
              {isDirty && (
                 <div className="md:hidden absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-brand-surface via-brand-surface to-transparent pt-12">
                   <motion.button
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     onClick={handleSave}
                     disabled={isLoading || usernameStatus === 'taken' || !!usernameFormatError}
                     className="w-full py-3.5 bg-brand-primary text-brand-dark rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
                   >
                     {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Changes'}
                   </motion.button>
                 </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileSettingsModal;

