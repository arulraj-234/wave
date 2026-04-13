import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { User, Lock, Mail, Users, Mic, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import WaveLogo from '../components/Logo';
import Plasma from '../components/Plasma';
import { useToast } from '../context/ToastContext';

const Register = ({ setAuth }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'listener',
    gender: 'prefer_not_to_say'
  });
  
  const [dob, setDob] = useState('');
  const [dobError, setDobError] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // null, 'checking', 'available', 'taken'
  const [usernameFormatError, setUsernameFormatError] = useState('');
  const usernameTimerRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (role) => {
    setFormData({ ...formData, role });
  };

  // Debounced username availability check
  const checkUsername = useCallback((username) => {
    if (usernameTimerRef.current) clearTimeout(usernameTimerRef.current);
    if (!username || username.length < 3) {
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
  }, []);

  const handleUsernameChange = (e) => {
    const val = e.target.value.toLowerCase();
    
    if (val && !/^[a-z0-9_]+$/.test(val)) {
      setUsernameFormatError('Username can only contain letters, numbers, and underscores (no spaces)');
    } else {
      setUsernameFormatError('');
    }

    setFormData({ ...formData, username: val });
    
    if (val.length >= 3 && /^[a-z0-9_]+$/.test(val)) {
      checkUsername(val);
    } else {
      if (usernameTimerRef.current) clearTimeout(usernameTimerRef.current);
      setUsernameStatus(null);
    }
  };

  // DOB validation
  const validateDob = () => {
    if (!dob) return true; // optional
    const dobDate = new Date(dob);
    if (dobDate.getFullYear() < 1900) {
      setDobError('Year must be after 1900');
      return false;
    }
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (age < 13 || (age === 13 && monthDiff < 0) || (age === 13 && monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      setDobError('You must be at least 13 years old');
      return false;
    }
    setDobError('');
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (usernameStatus === 'taken') {
      setError('That username is taken. Please choose another.');
      return;
    }
    if (usernameFormatError) {
      setError('Please fix the username format issues.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.first_name.trim()) {
      setError('First name is required.');
      return;
    }
    if (!validateDob()) return;
    
    setIsLoading(true);
    setError('');
    
    let formattedDob = dob || null;

    try {
      const response = await api.post('/api/auth/register', { ...formData, dob: formattedDob });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        const role = response.data.user.role;
        if (role === 'admin') navigate('/admin', { replace: true });
        else if (role === 'artist') navigate('/artist', { replace: true });
        else navigate('/onboarding', { replace: true });

        setTimeout(() => { if (setAuth) setAuth(true); }, 0);
        toast.success('Account created!');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-brand-dark flex items-center justify-center pt-safe">
      <div className="absolute inset-0 z-0 hidden md:block">
        <Plasma color="#c0c0c0" speed={0.5} direction="forward" scale={1.2} opacity={1} mouseInteractive={false} />
      </div>
      <div className="absolute inset-0 z-0 md:hidden bg-gradient-to-br from-brand-dark via-brand-dark/90 to-brand-primary/10"></div>

      <div className="relative z-10 w-full max-w-md px-4 md:px-8 py-4 animate-slide-up">
        <div className="flex flex-col items-center mb-4 md:mb-8">
          <div className="scale-75 md:scale-100 transform transform-origin-bottom transition-transform">
             <WaveLogo size={42} className="mb-2 md:mb-3" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Wave</h1>
        </div>

        <div className="bg-brand-dark/80 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/[0.06] shadow-2xl">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Join Wave</h2>
              <p className="text-brand-muted mt-1 text-sm font-medium">
                {step === 1 ? 'Step 1: Account Details' : 'Step 2: Personal Info'}
              </p>
            </div>
            <div className="text-brand-muted font-bold text-sm bg-white/5 px-3 py-1 rounded-full border border-white/10">
              {step} / 2
            </div>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm font-medium animate-slide-up">
              {error}
            </div>
          )}

          <form onSubmit={step === 1 ? handleNext : handleRegister} className="space-y-4">
            {step === 1 ? (
              <div className="animate-slide-up space-y-4">
                <div>
                  <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2 block">I am a</label>
                  <div className="flex gap-2 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => setRole('listener')}
                      className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                        formData.role === 'listener' 
                          ? 'bg-white text-brand-dark shadow-lg shadow-white/10' 
                          : 'text-brand-muted hover:text-brand-primary hover:bg-white/[0.03]'
                      }`}
                    >
                      <Users className="w-4 h-4" /> Listener
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('artist')}
                      className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                        formData.role === 'artist' 
                          ? 'bg-white text-brand-dark shadow-lg shadow-white/10' 
                          : 'text-brand-muted hover:text-brand-primary hover:bg-white/[0.03]'
                      }`}
                    >
                      <Mic className="w-4 h-4" /> Artist
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2 block">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted w-4 h-4" />
                    <input 
                      name="username"
                      type="text" 
                      placeholder="Choose a username" 
                      className={`input-field pl-12 pr-10 ${usernameStatus === 'taken' ? 'border-red-500/50' : usernameStatus === 'available' ? 'border-emerald-500/50' : ''}`}
                      value={formData.username}
                      onChange={handleUsernameChange}
                      autoComplete="username"
                      required 
                    />
                    {usernameStatus === 'available' && <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />}
                    {usernameStatus === 'taken' && <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />}
                    {usernameStatus === 'checking' && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-brand-muted/30 border-t-brand-muted rounded-full animate-spin" />}
                  </div>
                  {usernameStatus === 'taken' && <p className="text-red-400 text-xs mt-1.5 font-medium">Username is already taken</p>}
                  {usernameFormatError && <p className="text-amber-400 text-xs mt-1.5 font-medium">{usernameFormatError}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted w-4 h-4" />
                    <input 
                      name="email"
                      type="email" 
                      placeholder="you@example.com" 
                      className="input-field pl-12"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted w-4 h-4" />
                    <input 
                      name="password"
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      className="input-field pl-12 pr-12"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      required 
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2 flex gap-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                          formData.password.length >= i * 3 
                            ? i <= 1 ? 'bg-red-400' : i <= 2 ? 'bg-amber-400' : i <= 3 ? 'bg-emerald-400' : 'bg-emerald-400'
                            : 'bg-white/10'
                        }`} />
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  className="w-full btn-primary py-3.5 mt-2 text-sm font-bold uppercase tracking-wider"
                >
                  Continue
                </button>
              </div>
            ) : (
              <div className="animate-slide-up space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2 block">First Name <span className="text-red-400">*</span></label>
                    <input 
                      name="first_name"
                      type="text" 
                      placeholder="First name" 
                      className="input-field"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2 block">Last Name</label>
                    <input 
                      name="last_name"
                      type="text" 
                      placeholder="Last (Optional)" 
                      className="input-field"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2 block">Date of Birth</label>
                  <input 
                    type="date"
                    className="input-field cursor-pointer bg-zinc-900 border border-white/10 text-white w-full uppercase"
                    value={dob}
                    onChange={(e) => { setDob(e.target.value); setDobError(''); }}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {dobError && <p className="text-red-400 text-xs mt-1.5 font-medium">{dobError}</p>}
                </div>

                <div>
                  <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2 block">Gender</label>
                  <select
                    name="gender"
                    className="input-field cursor-pointer appearance-none bg-zinc-900 border border-white/10"
                    onChange={handleChange}
                    value={formData.gender}
                  >
                    <option value="prefer_not_to_say" className="bg-zinc-900 text-white">Prefer Not To Say</option>
                    <option value="male" className="bg-zinc-900 text-white">Male</option>
                    <option value="female" className="bg-zinc-900 text-white">Female</option>
                    <option value="non-binary" className="bg-zinc-900 text-white">Non-Binary</option>
                    <option value="other" className="bg-zinc-900 text-white">Other</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3.5 border border-white/10 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-2/3 btn-primary py-3.5 text-sm font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Finishing...
                      </span>
                    ) : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
        
        <p className="text-center mt-6 text-brand-muted text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:text-white/80 transition-colors font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
