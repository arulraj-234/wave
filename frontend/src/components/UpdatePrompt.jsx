import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DownloadCloud, X } from 'lucide-react';
import pkg from '../../package.json';

const UpdatePrompt = () => {
  const [updateData, setUpdateData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only check for updates if we are running in the native Android App (Capacitor)
    const isCapacitor = window.Capacitor !== undefined;
    if (!isCapacitor) return;

    const checkForUpdates = async () => {
      try {
        // Fetch the remote version manifest from Vercel
        const response = await fetch('https://wavemusic-six.vercel.app/version.json', { cache: 'no-store' });
        if (!response.ok) return;
        
        const data = await response.json();
        
        // Compare versions (semver naive check)
        const currentVersion = pkg.version || '2.1.0';
        if (data.version && data.version > currentVersion) {
          setUpdateData(data);
          setIsVisible(true);
        }
      } catch (err) {
        console.error("Failed to check for OTA updates:", err);
      }
    };

    // Delay check slightly so it doesn't block critical app boot
    const timer = setTimeout(checkForUpdates, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || !updateData) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-safe pt-4 left-0 right-0 z-[100] px-4 flex justify-center pointer-events-none"
      >
        <div className="bg-brand-dark/95 backdrop-blur-xl border border-brand-primary/30 p-4 rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto shadow-brand-primary/10">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0">
                <DownloadCloud className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Update Available!</h3>
                <p className="text-xs text-brand-muted mt-0.5">Version {updateData.version} is ready to install.</p>
                {updateData.release_notes && (
                  <p className="text-[10px] text-white/50 mt-1.5 italic line-clamp-2">
                    "{updateData.release_notes}"
                  </p>
                )}
              </div>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-1 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setIsVisible(false)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold text-brand-muted hover:text-white hover:bg-white/5 transition-colors"
            >
              Later
            </button>
            <a
              href={updateData.download_url}
              download="wave.apk"
              onClick={() => setIsVisible(false)}
              className="flex-1 py-2 rounded-xl text-xs font-bold bg-brand-primary text-brand-dark hover:bg-brand-accent transition-colors text-center shadow-lg shadow-brand-primary/20"
            >
              Install Now 🚀
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdatePrompt;
