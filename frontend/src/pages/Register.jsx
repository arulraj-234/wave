import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { User, Lock, Mail, Users, Mic, Eye, EyeOff } from 'lucide-react';
import WaveLogo from '../components/Logo';
import Plasma from '../components/Plasma';

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
  
  // Custom DOB State
  const [dobMonth, setDobMonth] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobYear, setDobYear] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (role) => {
    setFormData({ ...formData, role });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in required fields.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Format DOB if all fields are provided
    let formattedDob = null;
    if (dobYear && dobMonth && dobDay) {
      formattedDob = `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`;
    }

    try {
      const response = await api.post('/api/auth/register', { ...formData, dob: formattedDob });
      
      // Auto-login via HttpOnly cookie set by backend
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.removeItem('token'); // Clear legacy

        const role = response.data.user.role;
        if (role === 'admin') navigate('/admin', { replace: true });
        else if (role === 'artist') navigate('/artist', { replace: true });
        else navigate('/onboarding', { replace: true }); // listener

        setTimeout(() => { if (setAuth) setAuth(true); }, 0);
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
    <div className="min-h-screen relative overflow-hidden bg-brand-dark flex items-center justify-center">
      {/* Full-page Plasma WebGL background */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <Plasma color="#c0c0c0" speed={0.5} direction="forward" scale={1.2} opacity={1} mouseInteractive={false} />
      </div>
      {/* Static gradient fallback for mobile to prevent glitching/slowdowns */}
      <div className="absolute inset-0 z-0 md:hidden bg-gradient-to-br from-brand-dark via-brand-dark/90 to-brand-primary/10"></div>

      <div className="relative z-10 w-full max-w-md px-8 py-8 animate-slide-up">
        <div className="flex flex-col items-center mb-8">
          <WaveLogo size={42} className="mb-3" />
          <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Wave</h1>
        </div>

        <div className="bg-brand-dark/80 backdrop-blur-lg rounded-2xl p-8 border border-white/[0.06] shadow-2xl">
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
                      className="input-field pl-12"
                      value={formData.username}
                      onChange={handleChange}
                      required 
                    />
                  </div>
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
                    <label className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2 block">First Name</label>
                    <input 
                      name="first_name"
                      type="text" 
                      placeholder="First (Optional)" 
                      className="input-field"
                      value={formData.first_name}
                      onChange={handleChange}
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
                  <div className="flex gap-2">
                    <select 
                      className="input-field cursor-pointer flex-[2] bg-zinc-900 border border-white/10"
                      value={dobMonth}
                      onChange={(e) => setDobMonth(e.target.value)}
                    >
                      <option value="" disabled className="bg-zinc-900 text-white">Month</option>
                      <option value="1" className="bg-zinc-900 text-white">January</option>
                      <option value="2" className="bg-zinc-900 text-white">February</option>
                      <option value="3" className="bg-zinc-900 text-white">March</option>
                      <option value="4" className="bg-zinc-900 text-white">April</option>
                      <option value="5" className="bg-zinc-900 text-white">May</option>
                      <option value="6" className="bg-zinc-900 text-white">June</option>
                      <option value="7" className="bg-zinc-900 text-white">July</option>
                      <option value="8" className="bg-zinc-900 text-white">August</option>
                      <option value="9" className="bg-zinc-900 text-white">September</option>
                      <option value="10" className="bg-zinc-900 text-white">October</option>
                      <option value="11" className="bg-zinc-900 text-white">November</option>
                      <option value="12" className="bg-zinc-900 text-white">December</option>
                    </select>
                    <input 
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="2"
                      placeholder="DD" 
                      className="input-field flex-1 text-center"
                      value={dobDay}
                      onChange={(e) => setDobDay(e.target.value)}
                    />
                    <input 
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="4"
                      placeholder="YYYY" 
                      className="input-field flex-[1.2] text-center"
                      value={dobYear}
                      onChange={(e) => setDobYear(e.target.value)}
                    />
                  </div>
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
