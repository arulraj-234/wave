import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { resolveUrl } from '../api';
import { X, Camera, User, Check, Loader2, LogOut } from 'lucide-react';
import api from '../api';

const ProfileSettingsModal = ({ isOpen, onClose, user, onUpdate }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    avatar_url: user?.avatar_url || ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(resolveUrl(user?.avatar_url) || '');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);
    try {
      let finalAvatarUrl = formData.avatar_url;

      // Upload file if selected
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
        first_name: user?.first_name || '', // preserve existing data even if not edited
        last_name: user?.last_name || ''
      });

      if (response.data.success) {
        const updatedUser = response.data.user;
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        const newUser = { ...localUser, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(newUser));
        
        onUpdate(newUser);
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus(null);
        }, 1500);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-4 pb-safe">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-brand-surface border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 md:top-6 right-4 md:right-6 p-1.5 md:p-2 rounded-full hover:bg-white/10 text-brand-muted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 md:mb-8 pr-10">
              <h2 className="text-xl md:text-2xl font-black text-brand-primary tracking-tight">Profile</h2>
              <p className="text-xs md:text-sm text-brand-muted mt-1 font-medium">Manage your account settings</p>
            </div>

            <form onSubmit={handleSave} className="space-y-5 md:space-y-6">
              {/* Avatar Click-to-Upload */}
              <div className="flex flex-col items-center gap-4 mb-4">
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand-dark border-[3px] md:border-4 border-white/5 overflow-hidden flex items-center justify-center shadow-2xl transition-all group-hover:border-brand-primary/40 group-hover:scale-[1.02]">
                    {previewUrl ? (
                      <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 md:w-10 md:h-10 text-brand-muted opacity-40" />
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Camera className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
                <div className="text-center mt-2">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-brand-primary/60">Click to change photo</span>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-brand-muted mb-1.5 md:mb-2 ml-1">Username</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 md:py-3 text-sm text-brand-primary focus:outline-none focus:border-brand-primary/40 transition-all font-bold placeholder:text-white/10"
                  placeholder="Your username"
                />
              </div>

              <div className="pt-2 md:pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 md:py-3.5 rounded-xl font-black text-xs md:text-sm tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
                    status === 'success' ? 'bg-green-500 text-white' : 
                    status === 'error' ? 'bg-red-500 text-white' : 
                    'bg-brand-primary text-brand-dark hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                   status === 'success' ? <><Check className="w-5 h-5" /> Saved!</> : 
                   status === 'error' ? 'Failed to Save' : 'Save Changes'}
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide text-red-400 hover:bg-red-400/10 transition-all border border-red-400/20 flex items-center justify-center gap-2 mt-4"
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
