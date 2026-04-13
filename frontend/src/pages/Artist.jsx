import React, { useState, useEffect } from 'react';
import { Upload, BarChart2, ListMusic, Users, LogOut, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api, { resolveUrl } from '../api';
import WaveLogo from '../components/Logo';
import ArtistOverview from '../components/artist/ArtistOverview';
import ArtistMusic from '../components/artist/ArtistMusic';
import ArtistAudience from '../components/artist/ArtistAudience';
import CreateReleaseModal from '../components/artist/CreateReleaseModal';
import ProfileSettingsModal from '../components/ProfileSettingsModal';

const Artist = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artistStats, setArtistStats] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  useEffect(() => {
    fetchArtistData();
  }, []);

  const fetchArtistData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch songs and profile
      const userRes = await api.get(`/api/songs/artist/by-user/${currentUser.id}`);
      const profile = userRes.data.profile;
      const artistId = userRes.data.artist_id;
      
      setSongs(profile.songs || []);
      
      // 2. Fetch stats and albums if artist exists
      if (artistId) {
        const [statsRes, albumsRes] = await Promise.all([
          api.get(`/api/stats/artist/${artistId}`),
          api.get(`/api/albums/artist/${currentUser.id}`)
        ]);
        
        setArtistStats(statsRes.data);
        setAlbums(albumsRes.data.albums || []);
      }
    } catch (error) {
      console.error("Error fetching artist data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {}
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/#/login';
    window.location.reload();
  };

  const totalPlays = songs.reduce((sum, song) => sum + (song.play_count || 0), 0);
  
  const tabs = [
    { id: 'overview', icon: BarChart2, label: 'Overview' },
    { id: 'music', icon: ListMusic, label: 'Music' },
    { id: 'audience', icon: Users, label: 'Audience' },
  ];

  return (
    <div className="flex flex-col h-screen bg-brand-dark overflow-hidden">
      {/* Top Navbar */}
      <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-brand-dark/80 backdrop-blur-xl shrink-0 z-40">
        <div className="flex items-center gap-4">
          <WaveLogo size={32} />
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              Wave <span className="text-white/40">for</span> Artists
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-brand-primary text-brand-dark shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
             {/* Listener mode shortcut (for admin/dual-role) */}
             {currentUser?.role === 'admin' && (
               <button
                 onClick={() => navigate('/admin')}
                 className="p-2 rounded-full text-white/30 hover:text-white hover:bg-white/5 transition-all"
                 title="Admin Panel"
               >
                 <LayoutDashboard className="w-5 h-5" />
               </button>
             )}
             
             {/* Avatar / Profile */}
             <div 
               className="w-9 h-9 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center overflow-hidden cursor-pointer hover:border-brand-primary/40 transition-all bg-gradient-to-tr from-brand-primary/20 to-brand-accent/20 shadow-lg"
               onClick={() => setIsProfileModalOpen(true)}
             >
                {currentUser?.avatar_url ? (
                  <img src={resolveUrl(currentUser.avatar_url)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-black text-brand-primary uppercase">
                    {currentUser?.username ? currentUser.username.charAt(0) : 'A'}
                  </span>
                )}
             </div>

             {/* Logout */}
             <button
               onClick={handleLogout}
               className="p-2 rounded-full text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
               title="Logout"
             >
               <LogOut className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center gap-1 px-4 py-2 bg-brand-dark border-b border-white/5 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-primary text-brand-dark' : 'text-white/40'}`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
         <div className="w-full max-w-7xl mx-auto p-8 pb-32">
           
           {/* Dynamic Greeting */}
           <div className="mb-12 animate-fade-in flex items-end justify-between">
              <div>
                 <p className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-2">Artist Portal</p>
                 <h2 className="text-5xl font-black tracking-tight">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}.</h2>
              </div>
           </div>

           {isLoading ? (
             <div className="w-full flex items-center justify-center p-20">
               <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
             </div>
           ) : (
             <div className="transition-all duration-300">
               {activeTab === 'overview' && (
                 <ArtistOverview stats={artistStats} totalPlays={totalPlays} songs={songs} />
               )}
               {activeTab === 'music' && (
                 <ArtistMusic albums={albums} songs={songs} onCreateRelease={() => setIsModalOpen(true)} />
               )}
               {activeTab === 'audience' && (
                 <ArtistAudience stats={artistStats} />
               )}
             </div>
           )}

         </div>
      </div>

      <ProfileSettingsModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        user={currentUser}
        onUpdate={(updatedUser) => setCurrentUser(updatedUser)}
      />

      {/* Release Modal */}
      <CreateReleaseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onComplete={() => {
          setIsModalOpen(false);
          fetchArtistData();
          setActiveTab('music');
        }}
      />
    </div>
  );
};

export default Artist;
