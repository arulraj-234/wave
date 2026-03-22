import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Artist from './pages/Artist';
import Admin from './pages/Admin';
import Search from './pages/Search';
import Onboarding from './pages/Onboarding';

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
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  return (
    <Router>
      <div className="min-h-screen flex flex-col">
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
      </div>
    </Router>
  );
}

export default App;
