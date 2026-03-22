import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Check, ChevronRight, Music, Globe, Mic2, Sparkles } from 'lucide-react';
import WaveLogo from '../components/Logo';
import Plasma from '../components/Plasma';

const LANGUAGES = [
  'English', 'Hindi', 'Punjabi', 'Tamil', 'Telugu', 
  'Spanish', 'Korean', 'Japanese', 'French', 'Marathi', 'Bengali'
];

const GENRES = [
  'Pop', 'Hip Hop', 'Lo-Fi', 'Bollywood', 'EDM', 
  'Rock', 'R&B', 'Classical', 'Jazz', 'Indie', 
  'Phonk', 'K-Pop', 'Bhakti', 'Acoustic'
];

const POPULAR_ARTISTS = [
  'Arijit Singh', 'Taylor Swift', 'The Weeknd', 'Drake', 'BTS', 
  'Bad Bunny', 'Ed Sheeran', 'Shreya Ghoshal', 'Billie Eilish', 
  'AR Rahman', 'Post Malone', 'Dua Lipa', 'Karan Aujla', 
  'Diljit Dosanjh', 'Anirudh Ravichander', 'Travis Scott', 'Kendrick Lamar', 'Lana Del Rey'
];

const Onboarding = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);

  // Wait for user obj to load
  useEffect(() => {
    if (!user || user.role !== 'listener') {
      navigate('/login');
    }
  }, [user, navigate]);

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const isStepValid = () => {
    if (step === 1) return selectedLanguages.length >= 1;
    if (step === 2) return selectedGenres.length >= 3;
    if (step === 3) return selectedArtists.length >= 3;
    return false;
  };

  const handleNext = async () => {
    if (!isStepValid()) return;
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final Submit
      setIsSubmitting(true);
      try {
        await api.post('/api/auth/onboarding', {
          user_id: user.id || user.user_id, // Account for diff payload structures
          languages: selectedLanguages,
          genres: selectedGenres,
          artists: selectedArtists
        });
        
        // Update local storage user object
        const updatedUser = { ...user, onboarding_completed: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Use React Router for seamless transition
        navigate('/dashboard', { replace: true });
        
        // Force a window reload briefly to reset the App.jsx React Context state seamlessly
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } catch (err) {
        console.error("Onboarding submission failed", err);
        setIsSubmitting(false);
      }
    }
  };

  const getStepValidationText = () => {
    if (step === 1) return `Select at least 1 language (${Math.max(0, 1 - selectedLanguages.length)} more)`;
    if (step === 2) return `Select at least 3 genres (${Math.max(0, 3 - selectedGenres.length)} more)`;
    if (step === 3) return `Select at least 3 artists (${Math.max(0, 3 - selectedArtists.length)} more)`;
    return '';
  };

  // UI Constants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Plasma color="#c0c0c0" speed={0.4} scale={1.5} opacity={1} />
        <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-[50px] mix-blend-multiply" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <WaveLogo size={32} />
          <span className="text-2xl font-black tracking-tighter text-white">Wave</span>
        </div>
        
        {/* Step Indicators */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === step ? 'w-8 bg-brand-primary shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 
                i < step ? 'w-4 bg-brand-primary/50' : 'w-4 bg-white/10'
              }`} 
            />
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col items-center pt-8 pb-32 px-8 max-w-5xl mx-auto w-full">
        
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={step}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full flex-1 flex flex-col items-center"
          >
            <div className="text-center mb-12">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ delay: 0.2 }}
                className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-brand-primary/20 to-brand-accent/20 flex items-center justify-center mb-6 border border-white/10 shadow-2xl"
              >
                {step === 1 && <Globe className="w-10 h-10 text-brand-primary" />}
                {step === 2 && <Music className="w-10 h-10 text-brand-primary" />}
                {step === 3 && <Mic2 className="w-10 h-10 text-brand-primary" />}
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-white drop-shadow-xl">
                {step === 1 && "What do you listen to?"}
                {step === 2 && "Pick your vibe"}
                {step === 3 && "Who are your favorites?"}
              </h1>
              <p className="text-xl text-brand-muted font-medium">
                {step === 1 && "Let us know which languages you prefer."}
                {step === 2 && "Select the genres that match your frequency."}
                {step === 3 && "Tell us artists you love so we can tune your feed."}
              </p>
            </div>

            {/* Selection Grid */}
            <div className={`w-full grid gap-5 px-4 pb-8 ${step === 3 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
              
              {step === 1 && LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => toggleSelection(lang, selectedLanguages, setSelectedLanguages)}
                  className={`p-5 rounded-2xl flex items-center justify-between transition-all duration-300 transform hover:-translate-y-1 ${
                    selectedLanguages.includes(lang) 
                      ? 'bg-brand-primary/10 border-2 border-brand-primary text-brand-primary shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                      : 'bg-white/[0.03] border-2 border-white/5 text-white hover:bg-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <span className="font-bold text-lg">{lang}</span>
                  {selectedLanguages.includes(lang) && <Check className="w-6 h-6 flex-shrink-0 ml-3" />}
                </button>
              ))}

              {step === 2 && GENRES.map(genre => (
                <button
                  key={genre}
                  onClick={() => toggleSelection(genre, selectedGenres, setSelectedGenres)}
                  className={`p-5 rounded-2xl flex items-center justify-between transition-all duration-300 transform hover:-translate-y-1 ${
                    selectedGenres.includes(genre) 
                      ? 'bg-brand-primary/10 border-2 border-brand-primary text-brand-primary shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                      : 'bg-white/[0.03] border-2 border-white/5 text-white hover:bg-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <span className="font-bold text-lg">{genre}</span>
                  {selectedGenres.includes(genre) && <Check className="w-6 h-6 flex-shrink-0 ml-3" />}
                </button>
              ))}

              {step === 3 && POPULAR_ARTISTS.map(artist => (
                <button
                  key={artist}
                  onClick={() => toggleSelection(artist, selectedArtists, setSelectedArtists)}
                  className={`relative overflow-hidden p-6 h-32 rounded-3xl flex items-end transition-all duration-300 transform hover:scale-[1.05] border ${
                    selectedArtists.includes(artist) 
                      ? 'border-brand-primary shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
                      : 'border-white/5 text-white hover:border-white/30'
                  }`}
                >
                  {/* Dynamic Abstract Vibe Backgrounds per Artist based on string length */}
                  <div className={`absolute inset-0 opacity-40 bg-gradient-to-br ${
                    artist.length % 3 === 0 ? 'from-purple-500 to-indigo-900' :
                    artist.length % 3 === 1 ? 'from-emerald-500 to-teal-900' :
                    'from-rose-500 to-orange-900'
                  }`} />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
                  
                  {selectedArtists.includes(artist) && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-brand-primary text-brand-dark rounded-full flex items-center justify-center shadow-lg z-20 animate-slide-up">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  
                  <span className={`relative z-10 font-black text-xl leading-tight drop-shadow-md transition-colors ${selectedArtists.includes(artist) ? 'text-brand-primary' : 'text-white'}`}>
                    {artist}
                  </span>
                </button>
              ))}
            </div>

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer / Controls */}
      <footer className="relative z-10 p-8 border-t border-white/[0.05] bg-brand-dark/50 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="text-sm font-bold text-brand-muted uppercase tracking-widest flex items-center gap-2">
            {!isStepValid() && <Sparkles className="w-4 h-4 opacity-50" />}
            {getStepValidationText()}
          </div>
          
          <button
            onClick={handleNext}
            disabled={!isStepValid() || isSubmitting}
            className={`px-10 py-4 rounded-full font-black uppercase tracking-widest flex items-center gap-3 transition-all duration-300 ${
              isStepValid() && !isSubmitting
                ? 'bg-brand-primary text-brand-dark hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)]' 
                : 'bg-white/5 text-brand-muted cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin" />
                Tuning...
              </span>
            ) : (
              <>
                {step === 3 ? "Launch Wave" : "Continue"}
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Onboarding;
