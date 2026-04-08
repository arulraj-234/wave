import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Settings, BarChart3, LogOut, ChevronRight, Music, Shield, Info, Download } from 'lucide-react';
import { resolveUrl } from '../api';

const UserMenu = ({ isOpen, onClose, user, onOpenSettings, onLogout, navigate }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute right-0 top-full mt-2 w-72 bg-brand-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden"
      >
        {/* User Profile Header */}
        <div className="p-5 border-b border-white/5 bg-gradient-to-b from-brand-primary/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center overflow-hidden shadow-inner">
              {user.avatar_url ? (
                <img src={resolveUrl(user.avatar_url)} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-black text-brand-primary uppercase">
                  {user.username?.[0] || 'U'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-black text-brand-primary truncate leading-tight">
                {user.first_name ? `${user.first_name} ${user.last_name || ''}` : user.username}
              </h3>
              <p className="text-[10px] text-brand-muted font-bold tracking-wider uppercase mt-0.5">@{user.username}</p>
            </div>
          </div>
        </div>

        {/* Menu Actions */}
        <div className="p-2 space-y-0.5">
          <button
            onClick={() => { onClose(); onOpenSettings(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <Settings className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white">Settings</p>
              <p className="text-[9px] text-brand-muted">Profile, Quality, Privacy</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-brand-muted opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0" />
          </button>


          <div className="h-px bg-white/5 mx-2 my-1" />

          {/* Secondary Actions */}
          <button
            onClick={() => { window.open('/wave.apk', '_blank'); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group text-left"
          >
             <Download className="w-4 h-4 text-brand-muted group-hover:text-brand-primary" />
             <span className="text-[11px] font-semibold text-brand-muted group-hover:text-brand-primary">Download App</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors group text-left"
          >
            <LogOut className="w-4 h-4 text-red-400/60 group-hover:text-red-400" />
            <span className="text-[11px] font-semibold text-red-400/60 group-hover:text-red-400">Sign Out</span>
          </button>
        </div>

        {/* Branding Footer */}
        <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
           <span className="text-[9px] font-black uppercase tracking-widest text-brand-muted/40">Wave Music</span>
           <span className="text-[9px] font-bold text-brand-muted/30">v2.2.0</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserMenu;
