import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import api from './api';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Artist = lazy(() => import('./pages/Artist'));
const Admin = lazy(() => import('./pages/Admin'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
import { StatusBar, Style } from '@capacitor/status-bar';
import ErrorBoundary from './components/ErrorBoundary';
import UpdatePrompt from './components/UpdatePrompt';
const ProtectedRoute = ({ children, allowedRoles, isAuthenticated }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'artist') return <Navigate to="/artist" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  
  const currentPath = window.location.hash?.replace('#', '') || '/';
  if (user.role === 'listener' && !user.onboarding_completed && !currentPath.includes('/onboarding')) {
    return <Navigate to="/onboarding" replace />;
  }
  
  if (user.role === 'listener' && user.onboarding_completed && currentPath.includes('/onboarding')) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Animated route wrapper
const AnimatedRoutes = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  return (
    <AnimatePresence>
      <motion.div
        key={location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/search') ? 'dashboard' : location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="flex-1 flex flex-col"
      >
        <Routes location={location}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
          <Route path="/register" element={<Register setAuth={setIsAuthenticated} />} />
          <Route 
            path="/dashboard/*" 
            element={<ProtectedRoute allowedRoles={['listener']} isAuthenticated={isAuthenticated}><Dashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/onboarding" 
            element={<ProtectedRoute allowedRoles={['listener']} isAuthenticated={isAuthenticated}><Onboarding /></ProtectedRoute>} 
          />
          <Route 
            path="/search" 
            element={<ProtectedRoute allowedRoles={['listener']} isAuthenticated={isAuthenticated}><Dashboard defaultView="search" /></ProtectedRoute>} 
          />
          <Route 
            path="/artist" 
            element={<ProtectedRoute allowedRoles={['artist', 'admin']} isAuthenticated={isAuthenticated}><Artist /></ProtectedRoute>} 
          />
          <Route 
            path="/admin" 
            element={<ProtectedRoute allowedRoles={['admin']} isAuthenticated={isAuthenticated}><Admin /></ProtectedRoute>} 
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isWaking, setIsWaking] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Initialize Native Android Status bar — don't overlay so status bar has its own space
  useEffect(() => {
    const initCapacitor = async () => {
      try {
        await StatusBar.setOverlaysWebView({ overlay: true });
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#00000000' });
      } catch (e) {
        // Will throw on web/non-native
      }
    };
    initCapacitor();
  }, []);

  // Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Validate session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const wakeTimeout = setTimeout(() => setIsWaking(true), 2000);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setIsInitializing(false);
        clearTimeout(wakeTimeout);
        return;
      }
      try {
        const response = await api.get('/api/auth/me');
        if (response.data.success) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Only explicitly remove the token if the server explicitly rejected the token (401/403)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        } else {
          // It's a network error or 5xx (server cold-starting on Render).
          // Optimistically stay authenticated so the user isn't kicked to the login screen.
          if (localStorage.getItem('user')) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      } finally {
        clearTimeout(wakeTimeout);
        setIsInitializing(false);
      }
    };
    checkAuth();
  }, []);

  // Global 401 interceptor — any 401 (including stale session) triggers logout
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  // Session heartbeat — periodically keep the Render instance awake
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(async () => {
      try {
        await api.get('/api/health');
      } catch {}
    }, 600000); // every 10 minutes
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
        {isWaking && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-col items-center text-center px-4"
          >
            <p className="text-brand-primary font-bold text-lg mb-1">Waking up server...</p>
            <p className="text-brand-muted text-sm max-w-xs">Connecting to free-tier cloud instance. This may take up to 30 seconds.</p>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <UpdatePrompt />
        <div className="min-h-screen flex flex-col">
          {/* Offline banner */}
          {isOffline && (
            <div className="bg-amber-500/90 text-black text-xs font-bold text-center py-2 px-4 z-[300] shrink-0">
              You're offline — some features may not work
            </div>
          )}
          <Suspense fallback={<div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center"><div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" /><p className="mt-4 text-gray-400 text-sm">Loading Wave...</p></div>}>
            <AnimatedRoutes isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
