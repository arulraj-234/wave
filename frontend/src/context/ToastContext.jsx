import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS = {
  success: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
  error: 'bg-red-500/15 border-red-500/30 text-red-300',
  info: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
  warning: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
};

let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    if (timersRef.current[id]) clearTimeout(timersRef.current[id]);
    delete timersRef.current[id];
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(({ message, type = 'info', duration = 3000 }) => {
    const id = ++toastIdCounter;
    setToasts(prev => [...prev.slice(-4), { id, message, type }]); // Max 5 toasts
    timersRef.current[id] = setTimeout(() => removeToast(id), duration);
    return id;
  }, [removeToast]);

  // Convenience methods
  const success = useCallback((message, duration) => toast({ message, type: 'success', duration }), [toast]);
  const error = useCallback((message, duration) => toast({ message, type: 'error', duration }), [toast]);
  const info = useCallback((message, duration) => toast({ message, type: 'info', duration }), [toast]);
  const warning = useCallback((message, duration) => toast({ message, type: 'warning', duration }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      {/* Toast Container — fixed bottom center */}
      <div className="fixed bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 z-[200] flex flex-col-reverse gap-2 items-center w-full max-w-sm px-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = ICONS[t.type] || Info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={`pointer-events-auto w-full px-4 py-3 rounded-xl border backdrop-blur-xl flex items-center gap-3 shadow-2xl cursor-pointer ${COLORS[t.type]}`}
                onClick={() => removeToast(t.id)}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-sm font-semibold flex-1">{t.message}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
