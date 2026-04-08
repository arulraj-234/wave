import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { resolveUrl } from '../api';
import { X, Camera, User, Check, Loader2, LogOut, ChevronRight, BarChart3, Clock, Shield, Info, Edit2, CheckCircle, XCircle, Download } from 'lucide-react';
import api from '../api';
import { useToast } from '../context/ToastContext';

const ProfileSettingsModal = ({ isOpen, onClose, user, onUpdate }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    avatar_url: user?.avatar_url || ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(resolveUrl(user?.avatar_url) || '');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // null, 'checking', 'available', 'taken'
  const usernameTimerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [issueDescription, setIssueDescription] = useState('');
  const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);

  // Reset form when user prop changes
  React.useEffect(() => {
    if (user && isOpen) {
      setFormData({
        username: user?.username || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        avatar_url: user?.avatar_url || ''
      });
      setPreviewUrl(resolveUrl(user?.avatar_url) || '');
      setSelectedFile(null);
      setIsEditingName(false);
      setIsEditingUsername(false);
      setUsernameStatus(null);
      setStatus(null);
    }
  }, [user, isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Debounced username check
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
    const cleaned = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setFormData({ ...formData, username: cleaned });
    checkUsername(cleaned);
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleReportIssue = async (e) => {
    e.preventDefault();
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

  const handleSave = async (e) => {
    e.preventDefault();
    if (usernameStatus === 'taken') {
      toast.error('Username is taken');
      return;
    }
    if (!formData.first_name.trim()) {
      toast.error('First name is required');
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
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim()
      });

      if (response.data.success) {
        const updatedUser = response.data.user;
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        const newUser = { ...localUser, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(newUser));
        onUpdate(newUser);
        setStatus('success');
        toast.success('Profile updated!');
        setTimeout(() => {
          onClose();
          setStatus(null);
        }, 1000);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      setStatus('error');
      toast.error(error.response?.data?.error || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const displayName = formData.first_name ? `${formData.first_name} ${formData.last_name || ''}`.trim() : formData.username;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 pb-safe">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-full md:max-w-md bg-brand-surface border border-white/10 rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            {/* Header with avatar */}
            <div className="relative px-6 pt-8 pb-6 bg-gradient-to-b from-brand-primary/5 to-transparent">
              <button 
                onClick={onClose}
                className="absolute top-3 right-3 w-10 h-10 rounded-full hover:bg-white/10 text-brand-muted hover:text-white transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Avatar + Name */}
              <div className="flex flex-col items-center gap-3">
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-20 h-20 rounded-full bg-brand-dark border-[3px] border-white/10 overflow-hidden flex items-center justify-center shadow-2xl transition-all group-hover:border-brand-primary/40">
                    {previewUrl ? (
                      <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-brand-primary uppercase">
                        {(formData.first_name?.[0] || formData.username?.[0] || 'U')}
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
                
                <div className="text-center">
                  <h2 className="text-xl font-black text-brand-primary tracking-tight">{displayName}</h2>
                  <p className="text-xs text-brand-muted font-medium mt-0.5">@{formData.username}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="px-6 pb-6 space-y-5">
              {/* Name editing */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Name</label>
                  <button type="button" onClick={() => setIsEditingName(!isEditingName)} className="text-[10px] font-bold text-brand-muted hover:text-brand-primary transition-colors flex items-center gap-1">
                    <Edit2 className="w-3 h-3" /> {isEditingName ? 'Done' : 'Edit'}
                  </button>
                </div>
                {isEditingName ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-brand-primary focus:outline-none focus:border-brand-primary/40 transition-all font-bold"
                      placeholder="First name *"
                      required
                    />
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-brand-primary focus:outline-none focus:border-brand-primary/40 transition-all font-bold"
                      placeholder="Last name"
                    />
                  </div>
                ) : (
                  <div className="bg-white/[0.02] rounded-xl px-4 py-3 text-sm font-bold text-brand-primary border border-white/5">
                    {displayName || 'Tap Edit to set your name'}
                  </div>
                )}
              </div>

              {/* Username editing */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Username</label>
                  <button type="button" onClick={() => setIsEditingUsername(!isEditingUsername)} className="text-[10px] font-bold text-brand-muted hover:text-brand-primary transition-colors flex items-center gap-1">
                    <Edit2 className="w-3 h-3" /> {isEditingUsername ? 'Done' : 'Edit'}
                  </button>
                </div>
                {isEditingUsername ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      className={`w-full bg-white/[0.03] border rounded-xl px-4 py-2.5 pr-10 text-sm text-brand-primary focus:outline-none transition-all font-bold ${usernameStatus === 'taken' ? 'border-red-500/50' : usernameStatus === 'available' ? 'border-emerald-500/50' : 'border-white/10 focus:border-brand-primary/40'}`}
                      placeholder="username"
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameStatus === 'available' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                      {usernameStatus === 'taken' && <XCircle className="w-4 h-4 text-red-400" />}
                      {usernameStatus === 'checking' && <div className="w-4 h-4 border-2 border-brand-muted/30 border-t-brand-muted rounded-full animate-spin" />}
                    </div>
                    {usernameStatus === 'taken' && <p className="text-red-400 text-xs mt-1 font-medium">This username is taken</p>}
                  </div>
                ) : (
                  <div className="bg-white/[0.02] rounded-xl px-4 py-3 text-sm font-bold text-brand-primary border border-white/5">
                    @{formData.username}
                  </div>
                )}
              </div>

              <div className="h-px bg-white/5" />

              {/* Quick action links - industry standard */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => { onClose(); navigate('/dashboard/stats'); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/[0.04] transition-colors text-left"
                >
                  <BarChart3 className="w-5 h-5 text-brand-muted" />
                  <span className="flex-1 text-sm font-semibold text-brand-primary">Listening Stats</span>
                  <ChevronRight className="w-4 h-4 text-brand-muted" />
                </button>
                <button
                  type="button"
                  onClick={() => { onClose(); navigate('/dashboard/library'); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/[0.04] transition-colors text-left"
                >
                  <Clock className="w-5 h-5 text-brand-muted" />
                  <span className="flex-1 text-sm font-semibold text-brand-primary">Liked Songs & Library</span>
                  <ChevronRight className="w-4 h-4 text-brand-muted" />
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/[0.04] transition-colors text-left"
                >
                  <Shield className="w-5 h-5 text-brand-muted" />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-brand-primary">Privacy & Security</span>
                    <p className="text-[10px] text-brand-muted">Session management, data controls</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand-muted" />
                </button>

                <a
                  href="/wave.apk"
                  download="wave.apk"
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/[0.04] transition-colors text-left group"
                >
                  <Download className="w-5 h-5 text-brand-primary" />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-brand-primary">Download App</span>
                    <p className="text-[10px] text-brand-muted">Get the native Android experience</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand-muted group-hover:translate-x-1 transition-transform" />
                </a>
                <button
                  type="button"
                  onClick={() => setShowIssueForm(!showIssueForm)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/[0.04] transition-colors text-left"
                >
                  <Info className="w-5 h-5 text-brand-muted" />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-brand-primary">Report an Issue</span>
                    <p className="text-[10px] text-brand-muted">Help us fix bugs or request features</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-brand-muted transition-transform ${showIssueForm ? 'rotate-90' : ''}`} />
                </button>

                <AnimatePresence>
                  {showIssueForm && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden px-4"
                    >
                      <div className="py-2 space-y-2">
                        <textarea
                          value={issueDescription}
                          onChange={(e) => setIssueDescription(e.target.value)}
                          placeholder="Describe the issue you're facing..."
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-brand-primary focus:outline-none focus:border-brand-primary/40 min-h-[100px] resize-none"
                        />
                        <button
                          type="button"
                          disabled={isSubmittingIssue || !issueDescription.trim()}
                          onClick={handleReportIssue}
                          className="w-full py-2.5 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded-xl font-bold text-xs transition-all disabled:opacity-50"
                        >
                          {isSubmittingIssue ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Send Report'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl opacity-60">
                  <Info className="w-5 h-5 text-brand-muted" />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-brand-primary">Wave</span>
                    <p className="text-[10px] text-brand-muted">v2.1.0 · Made with love</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* Actions */}
              <div className="space-y-3">
                {(isEditingName || isEditingUsername || selectedFile) && (
                  <button
                    type="submit"
                    disabled={isLoading || usernameStatus === 'taken'}
                    className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
                      status === 'success' ? 'bg-green-500 text-white' : 
                      status === 'error' ? 'bg-red-500 text-white' : 
                      'bg-brand-primary text-brand-dark hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50'
                    }`}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                     status === 'success' ? <><Check className="w-5 h-5" /> Saved!</> : 
                     status === 'error' ? 'Failed to Save' : 'Save Changes'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide text-red-400 hover:bg-red-400/10 transition-all border border-red-400/20 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileSettingsModal;
