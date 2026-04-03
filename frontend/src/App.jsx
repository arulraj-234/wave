import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect, Suspense, lazy } from 'react';
import api from './api';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Artist = lazy(() => import('./pages/Artist'));
const Admin = lazy(() => import('./pages/Admin'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
import { StatusBar, Style } from '@capacitor/status-bar';

const ProtectedRoute = ({ children, allowedRoles, isAuthenticated }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'artist') return <Navigate to="/artist" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  
  // Enforce Onboarding for listeners
  const currentPath = window.location.pathname;
  if (user.role === 'listener' && !user.onboarding_completed && currentPath !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  // Prevent onboarded users from going back to onboarding
  if (user.role === 'listener' && user.onboarding_completed && currentPath === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize Native Android Status bar
  useEffect(() => {
    const initCapacitor = async () => {
      try {
        await StatusBar.setOverlaysWebView({ overlay: true });
        await StatusBar.setStyle({ style: Style.Dark });
      } catch (e) {
        // Will throw on web/non-native, completely fine to ignore
      }
    };
    initCapacitor();
  }, []);

  // Validate session on initial load using localStorage token
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setIsInitializing(false);
        return;
      }
      try {
        const response = await api.get('/api/auth/me');
        if (response.data.success) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsInitializing(false);
      }
    };
    checkAuth();
  }, []);

  // Add an interceptor to globally catch 401s (expired session) and log out
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
           // We ignore 401s from the /api/auth/me route because we handle that during initialization
           if (!error.config.url.endsWith('/api/auth/me')) {
              setIsAuthenticated(false);
              localStorage.removeItem('user');
              localStorage.removeItem('token');
           }
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);


  if (isInitializing) {
    return <div className="min-h-screen bg-brand-dark flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" /></div>;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Suspense fallback={<div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center"><div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" /><p className="mt-4 text-gray-400 text-sm">Loading Wave...</p></div>}>
          <Routes>
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
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
