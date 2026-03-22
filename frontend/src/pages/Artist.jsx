import React, { useState, useEffect } from 'react';
import { Upload, BarChart2, ListMusic, Users } from 'lucide-react';
import api, { resolveUrl } from '../api';
import WaveLogo from '../components/Logo';
import ArtistOverview from '../components/artist/ArtistOverview';
import ArtistMusic from '../components/artist/ArtistMusic';
import CreateReleaseModal from '../components/artist/CreateReleaseModal';
import ProfileSettingsModal from '../components/ProfileSettingsModal';

const Artist = () => {
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
          </div>
        </div>
      </header>

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
                 <ArtistOverview stats={artistStats} totalPlays={totalPlays} />
               )}
               {activeTab === 'music' && (
                 <ArtistMusic albums={albums} songs={songs} onCreateRelease={() => setIsModalOpen(true)} />
               )}
               {activeTab === 'audience' && (
                 <div className="flex-1 flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-white/[0.01] rounded-full border border-dashed border-white/10 flex items-center justify-center mb-6">
                        <Users className="w-10 h-10 text-white/10" />
                    </div>
                    <h3 className="text-2xl font-black">Detailed Audience insights coming soon</h3>
                    <p className="text-white/40 max-w-md mx-auto mt-2 font-medium">We're collecting more data about your listeners. Keep releasing music to build your audience profile.</p>
                 </div>
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
