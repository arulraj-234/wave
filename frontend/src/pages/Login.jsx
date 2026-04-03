
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { Lock, Mail, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import WaveLogo from '../components/Logo';
import Plasma from '../components/Plasma';
import { useToast } from '../context/ToastContext';

const Login = ({ setAuth }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sessionConflict, setSessionConflict] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const attemptLogin = async (forceLogin = false) => {
    setIsLoading(true);
    setError('');
    setSessionConflict(false);
    try {
      const response = await api.post('/api/auth/login', {
        login_id: loginId,
        password,
        force_login: forceLogin
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      const role = response.data.user.role;
      if (role === 'admin') navigate('/admin', { replace: true });
      else if (role === 'artist') navigate('/artist', { replace: true });
      else navigate('/dashboard', { replace: true });

      setTimeout(() => setAuth(true), 0);
      toast.success('Welcome back!');

    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.error === 'session_conflict') {
        setSessionConflict(true);
        setError(errorData.message);
      } else {
        setError(errorData?.error || 'Login failed. Check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await attemptLogin(false);
  };

  const handleForceLogin = async () => {
    await attemptLogin(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-brand-dark flex items-center justify-center pt-safe">
      {/* Full-page Plasma WebGL background */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <Plasma color="#c0c0c0" speed={0.5} direction="forward" scale={1.2} opacity={1} mouseInteractive={false} />
      </div>
      {/* Static gradient fallback for mobile */}
      <div className="absolute inset-0 z-0 md:hidden bg-gradient-to-br from-brand-dark via-brand-dark/90 to-brand-primary/10"></div>

      {/* Centered form card */}
      <div className="relative z-10 w-full max-w-md px-4 md:px-8 py-4 animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6 md:mb-10">
          <div className="scale-75 md:scale-100 transform transform-origin-bottom transition-transform">
             <WaveLogo size={48} className="mb-2 md:mb-4" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Wave</h1>
          <p className="text-brand-muted mt-1 md:mt-2 font-medium text-xs md:text-sm">Your music. Your stats. Your story.</p>
        </div>

        {/* Glass card */}
        <div className="bg-brand-dark/80 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/[0.06]">
          <div className="mb-6">
            <h2 className="text-2xl font-black tracking-tight">Welcome back</h2>
            <p className="text-brand-muted mt-1 text-sm font-medium">Enter your credentials to continue listening.</p>
          </div>

          {error && (
            <div className={`${sessionConflict ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-red-500/10 border-red-500/20 text-red-300'} border px-4 py-3 rounded-xl mb-6 text-sm font-medium animate-slide-up`}>
              <div className="flex items-start gap-2">
                {sessionConflict && <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
                <span>{error}</span>
              </div>
              {sessionConflict && (
                <button
                  onClick={handleForceLogin}
                  disabled={isLoading}
                  className="mt-3 w-full py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg text-sm font-bold text-amber-200 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Logging in...' : 'Yes, log out other device & continue'}
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2 block">Email or Username</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted w-4 h-4" />
                <input
                  type="text"
                  placeholder="username or you@example.com"
                  className="input-field pl-12"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pl-12 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3.5 mt-2 text-sm font-bold uppercase tracking-wider disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-brand-muted text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-white hover:text-white/80 transition-colors font-semibold">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
