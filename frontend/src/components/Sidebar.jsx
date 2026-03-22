import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Search as SearchIcon, Library, LogOut, Music, Plus, Shield as ShieldIcon, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { PlayerContext } from '../context/PlayerContext';
import WaveLogo from './Logo';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { playlists, createPlaylist, likedPlaylists, isSidebarCollapsed, setIsSidebarCollapsed, isFullScreenPlayer } = useContext(PlayerContext);

  // Determine current view from URL
  let currentView = 'home';
  if (location.pathname === '/search') currentView = 'search';
  else if (location.pathname === '/dashboard/library') currentView = 'library';
  else if (location.pathname === '/dashboard/stats') currentView = 'stats';

  const handleCreatePlaylist = () => {
    const title = prompt("Enter playlist name:");
    if (title) createPlaylist(title);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (isFullScreenPlayer) return null;

  return (
    <div className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} hidden md:flex flex-col bg-brand-dark pt-6 pb-2 shrink-0 z-50 border-r border-white/[0.04] transition-all duration-300`}>
      <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center mx-0' : 'justify-between px-8'} mb-10 relative h-8`}>
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-3 cursor-pointer animate-fade-in" onClick={() => navigate('/dashboard')}>
            <WaveLogo size={22} className="shrink-0" />
            <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">Wave</span>
          </div>
        )}
        
        {/* Toggle Collapse Button */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-brand-muted hover:text-white hover:bg-white/10 transition-colors shrink-0 ${isSidebarCollapsed ? '' : 'absolute right-4'}`}
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? <WaveLogo size={16} /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 custom-scrollbar overflow-y-auto overflow-x-hidden">
        <Link 
          to="/dashboard" 
          className={`nav-link ${currentView === 'home' ? 'nav-link-active' : 'nav-link-inactive'} ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
          title={isSidebarCollapsed ? "Home" : ""}
        >
          <Home className="w-5 h-5 shrink-0" />
          {!isSidebarCollapsed && <span className="truncate">Home</span>}
        </Link>
        <Link 
          to="/search" 
          className={`nav-link ${currentView === 'search' ? 'nav-link-active' : 'nav-link-inactive'} ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
          title={isSidebarCollapsed ? "Search" : ""}
        >
          <SearchIcon className="w-5 h-5 shrink-0" />
          {!isSidebarCollapsed && <span className="truncate">Search</span>}
        </Link>
        <Link 
          to="/dashboard/library" 
          className={`nav-link ${currentView === 'library' ? 'nav-link-active' : 'nav-link-inactive'} ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
          title={isSidebarCollapsed ? "Your Library" : ""}
        >
          <Library className="w-5 h-5 shrink-0" />
          {!isSidebarCollapsed && <span className="truncate">Your Library</span>}
        </Link>
        <Link 
          to="/dashboard/stats" 
          className={`nav-link ${currentView === 'stats' ? 'nav-link-active' : 'nav-link-inactive'} ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
          title={isSidebarCollapsed ? "Your Stats" : ""}
        >
          <BarChart3 className="w-5 h-5 shrink-0" />
          {!isSidebarCollapsed && <span className="truncate">Your Stats</span>}
        </Link>

        {/* Unified Playlists Section */}
        <div className="pt-6 px-2 space-y-1">
          {playlists?.map(pl => (
            <Link 
              key={`local-${pl.playlist_id}`}
              to={`/dashboard/playlist/${pl.playlist_id}`}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors overflow-hidden group ${location.pathname === `/dashboard/playlist/${pl.playlist_id}` ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
              title={pl.title}
            >
              <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-brand-accent/20 to-brand-primary/10 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-white/20 transition-colors">
                <Music className="w-4 h-4 text-white/50" />
              </div>
              {!isSidebarCollapsed && (
                <span className={`text-sm font-medium truncate ${location.pathname === `/dashboard/playlist/${pl.playlist_id}` ? 'text-brand-primary' : 'text-brand-muted group-hover:text-white transition-colors'}`}>
                  {pl.title}
                </span>
              )}
            </Link>
          ))}
          
          {likedPlaylists?.map(pl => (
            <Link 
              key={`saavn-${pl.saavn_playlist_id}`}
              to={`/playlist/saavn/${pl.saavn_playlist_id}`}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors overflow-hidden group ${location.pathname === `/playlist/saavn/${pl.saavn_playlist_id}` ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'} ${isSidebarCollapsed ? 'justify-center' : ''}`}
              title={pl.title}
            >
              <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-indigo-500/20 to-purple-500/10 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-white/20 transition-colors">
                <Library className="w-4 h-4 text-indigo-400/50" />
              </div>
              {!isSidebarCollapsed && (
                <span className={`text-sm font-medium truncate ${location.pathname === `/playlist/saavn/${pl.saavn_playlist_id}` ? 'text-brand-primary' : 'text-brand-muted group-hover:text-white transition-colors'}`}>
                  {pl.title}
                </span>
              )}
            </Link>
          ))}

          <button 
            onClick={handleCreatePlaylist}
            className={`w-full flex items-center gap-3 p-2 mt-2 rounded-lg text-brand-muted hover:text-white hover:bg-white/[0.04] transition-colors group ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title="Create New Playlist"
          >
            <div className="w-8 h-8 rounded-md bg-white/[0.02] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/30 transition-colors">
              <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
            {!isSidebarCollapsed && <span className="text-sm font-medium">Create Playlist</span>}
          </button>
        </div>

        {(user.role === 'artist' || user.role === 'admin') && (
          <div className="pt-8">
            <Link 
              to="/artist" 
              className={`flex items-center gap-4 py-3 text-brand-muted hover:text-brand-primary rounded-lg font-medium transition-colors ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`}
              title={isSidebarCollapsed ? "Artist Portal" : ""}
            >
              <Music className="w-5 h-5 shrink-0" />
              {!isSidebarCollapsed && <span className="truncate">Artist Portal</span>}
            </Link>
          </div>
        )}

        {user.role === 'admin' && (
          <Link 
            to="/admin" 
            className="flex items-center gap-4 px-4 py-3 text-brand-muted hover:text-brand-primary rounded-lg font-medium transition-colors"
          >
            <ShieldIcon className="w-5 h-5" />
            Admin Access
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
