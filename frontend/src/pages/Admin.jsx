import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Music as MusicIcon, Activity, Trash2, Upload, Plus, 
  TrendingUp, BarChart2, CheckCircle, XCircle, LayoutDashboard, 
  Settings, Image as ImageIcon, Edit, X, Save, FileAudio, LogOut,
  MessageSquare, AlertCircle, Check
} from 'lucide-react';
import api, { resolveUrl } from '../api';
import WaveLogo from '../components/Logo';
import MagicBento, { ParticleCard } from '../components/MagicBento';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-brand-dark min-h-screen text-white">
          <h1 className="text-3xl text-rose-500 mb-4 font-bold">Something went wrong.</h1>
          <p className="font-mono text-sm text-white/70 overflow-x-auto whitespace-pre-wrap">{this.state.error && this.state.error.toString()}</p>
          <pre className="mt-4 text-[10px] text-white/50">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ users: 0, songs: 0, activeStreams: 0, health: 'Degraded', db_status: 'Disconnected' });
  const [platformStats, setPlatformStats] = useState(null);
  
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchAdminData = async () => {
    try {
      const [statsRes, healthRes, platformRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/health'),
        api.get('/api/stats/platform')
      ]);

      setPlatformStats(platformRes.data);
      setStats({
        users: statsRes.data.users,
        songs: statsRes.data.songs,
        activeStreams: statsRes.data.streams,
        health: healthRes.data.status === 'healthy' ? 'Optimal' : 'Degraded',
        db_status: healthRes.data.database === 'connected' ? 'Connected' : 'Disconnected'
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  useEffect(() => {
    fetchAdminData();
    // Refresh interval
    const interval = setInterval(fetchAdminData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-brand-dark overflow-hidden font-sans text-white">
      {/* Sidebar Navigation — desktop only */}
      <div className="hidden md:flex w-64 border-r border-white/5 bg-brand-dark/50 backdrop-blur-md flex-col">
        <div className="p-8 pb-4">
          <h1 className="text-xl font-black text-brand-primary flex items-center gap-2">
            <WaveLogo size={24} />
            ADMIN
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'songs', icon: MusicIcon, label: 'Manage Songs' },
            { id: 'upload', icon: Upload, label: 'Upload Tracks' },
            { id: 'users', icon: Users, label: 'Manage Users' },
            { id: 'issues', icon: MessageSquare, label: 'User Issues' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-400' : 'text-white/40'}`} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5 space-y-3">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
          >
            <LogOut className="w-5 h-5 text-white/40" />
            Logout
          </button>
          <p className="text-xs text-white/30 text-center">Wave Admin Protocol v2.0</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 pt-safe pb-3 border-b border-white/5 bg-brand-dark/90 backdrop-blur-xl sticky top-0 z-30">
          <h1 className="text-base font-black text-brand-primary flex items-center gap-2">
            <WaveLogo size={18} />
            ADMIN
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-rose-500/10 text-white/60 hover:text-rose-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 pb-24 md:pb-8">
            <ErrorBoundary>
              {activeTab === 'overview' && <OverviewTab stats={stats} platformStats={platformStats} />}
              {activeTab === 'upload' && <UploadTab token={token} currentUser={currentUser} onUploadComplete={fetchAdminData} />}
              {activeTab === 'songs' && <SongsTab token={token} />}
              {activeTab === 'users' && <UsersTab token={token} />}
              {activeTab === 'issues' && <IssuesTab token={token} />}
            </ErrorBoundary>
          </div>
        </div>

        {/* Mobile bottom tab bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-dark/95 backdrop-blur-xl border-t border-white/[0.06] flex items-center justify-around px-2 pb-safe z-40">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'songs', icon: MusicIcon, label: 'Songs' },
            { id: 'upload', icon: Upload, label: 'Upload' },
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'issues', icon: MessageSquare, label: 'Issues' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-3 px-3 rounded-xl transition-all min-w-[56px] ${
                activeTab === tab.id 
                  ? 'text-indigo-300' 
                  : 'text-white/40'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== [ OVERVIEW TAB ] ====================

const OverviewTab = ({ stats, platformStats }) => {
  const maxStreams = Math.max(1, ...(platformStats?.daily_streams || []).map(d => d.daily_streams));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">System Overview</h2>
      
      {/* Primary Stats Grid */}
      <MagicBento className="grid grid-cols-2 lg:grid-cols-4 gap-4" glowColor="180, 195, 215">
        {[
          { label: 'Total Users', count: platformStats?.stats?.total_users || stats.users, icon: Users, color: 'text-indigo-400/70' },
          { label: 'Total Songs', count: platformStats?.stats?.total_songs || stats.songs, icon: MusicIcon, color: 'text-indigo-400/70' },
          { label: 'Total Streams', count: platformStats?.stats?.total_streams || stats.activeStreams, icon: Activity, color: 'text-indigo-400/70' },
          { label: 'DB Health', count: stats.db_status, icon: stats.db_status === 'Connected' ? CheckCircle : XCircle, isHealth: true, color: stats.db_status === 'Connected' ? 'text-emerald-400/70' : 'text-rose-400/70' }
        ].map((stat, idx) => (
          <ParticleCard key={idx} className="card card--border-glow glass-panel p-6 flex flex-col justify-center items-center text-center border border-transparent z-10" glowColor="180, 195, 215" enableTilt={false} enableMagnetism={false}>
            <div className={`mb-3 ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div className="w-full flex flex-col items-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-1 break-all w-full leading-tight">
                {typeof stat.count === 'number' ? stat.count.toLocaleString() : stat.count}
              </h2>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          </ParticleCard>
        ))}
      </MagicBento>

      {platformStats && (
        <MagicBento className="grid grid-cols-1 lg:grid-cols-3 gap-6" glowColor="180, 195, 215">
          {/* Highlights */}
          <ParticleCard className="card card--border-glow glass-panel p-6 border border-transparent z-10 lg:col-span-2 flex flex-col justify-center" glowColor="180, 195, 215" enableTilt={false}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 border-r border-white/5">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Streams Today</p>
                <p className="text-3xl font-black text-indigo-400/80">{platformStats.stats.streams_today?.toLocaleString() || 0}</p>
              </div>
              <div className="text-center p-4 border-r border-white/5">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Streams This Week</p>
                <p className="text-3xl font-black text-indigo-400/80">{platformStats.stats.streams_this_week?.toLocaleString() || 0}</p>
              </div>
              <div className="text-center p-4">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">New Users (Week)</p>
                <p className="text-3xl font-black text-indigo-400/80">{platformStats.stats.new_users_this_week?.toLocaleString() || 0}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2"><MusicIcon className="w-3" /> Most Popular Song</p>
              <p className="text-xl md:text-2xl font-black max-w-lg truncate">{platformStats.stats.most_popular_song || '--'}</p>
              <p className="text-sm text-white/30">{platformStats.stats.most_popular_song_plays?.toLocaleString() || 0} total plays</p>
            </div>
          </ParticleCard>

          {/* 30-Day Streams Chart */}
          <ParticleCard className="card card--border-glow glass-panel p-6 border border-transparent z-10 flex flex-col justify-between" glowColor="180, 195, 215" enableTilt={false}>
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
              <BarChart2 className="w-4 h-4" /> 30-Day Stream Activity
            </h3>
            {platformStats.daily_streams?.length > 0 ? (
              <div className="flex items-end justify-start gap-1 h-32 w-full mt-auto px-2 pb-4 pt-8">
                {platformStats.daily_streams.map((day, i) => {
                  const percent = Math.max(2, (day.daily_streams / maxStreams) * 100);
                  return (
                    <div
                      key={i}
                      className="flex-1 max-w-[12px] min-w-[4px] bg-indigo-400/30 rounded-sm hover:bg-indigo-400/80 transition-colors group cursor-crosshair relative"
                      style={{ height: `${percent}%` }}
                    >
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black/90 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap pointer-events-none z-50 transition-opacity">
                        {day.stream_date}: {day.daily_streams}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-white/20 text-sm">No recent activity</div>
            )}
          </ParticleCard>
        </MagicBento>
      )}

      {/* Tables section */}
      {platformStats && (
        <MagicBento className="grid grid-cols-1 lg:grid-cols-2 gap-6" glowColor="180, 195, 215">
          <ParticleCard className="card card--border-glow glass-panel p-6 border border-transparent z-10" glowColor="180, 195, 215" enableTilt={false}>
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2 justify-center">
              <TrendingUp className="w-4 h-4" /> Top Artists
            </h3>
            <div className="space-y-4">
              {platformStats.top_artists?.length > 0 ? platformStats.top_artists.map((artist, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-white/20 w-5 text-right">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-sm font-bold truncate">{artist.artist_name}</span>
                      <span className="text-[10px] font-mono text-white/40 whitespace-nowrap ml-2">{artist.total_plays?.toLocaleString()} plays</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400/50 rounded-full" style={{ width: `${(artist.total_plays / platformStats.top_artists[0].total_plays) * 100}%` }} />
                    </div>
                  </div>
                </div>
              )) : <p className="text-center text-white/20 text-sm">No top artists yet.</p>}
            </div>
          </ParticleCard>

          <ParticleCard className="card card--border-glow glass-panel p-6 border border-transparent z-10 flex flex-col justify-center" glowColor="180, 195, 215" enableTilt={false}>
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6 text-center">User Role Breakdown</h3>
            <div className="flex gap-4 h-full items-center justify-center">
              {platformStats.role_distribution?.length > 0 ? platformStats.role_distribution.map((role, i) => (
                <div key={i} className="flex-1 p-6 rounded-xl bg-white/[0.02] border border-white/5 text-center transition-transform hover:scale-105 hover:bg-white/[0.04]">
                  <p className="text-3xl font-black text-indigo-400/80">{role.count}</p>
                  <p className="text-[10px] font-bold text-indigo-400/40 uppercase tracking-widest mt-2">{role.role}s</p>
                </div>
              )) : <p className="text-white/20 text-sm">No data recorded.</p>}
            </div>
          </ParticleCard>
        </MagicBento>
      )}
    </div>
  );
};

// ==================== [ UPLOAD SECION (MULTI) ] ====================

const UploadTab = ({ token, currentUser, onUploadComplete }) => {
  const [uploads, setUploads] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    const newUploads = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      audioFile: file,
      coverFile: null,
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
      artistName: '',
      genre: '',
      status: 'idle', // idle, uploading, success, error
      message: ''
    }));

    setUploads(prev => [...prev, ...newUploads]);
    e.target.value = ''; // Reset input
  };

  const removeUpload = (id) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  const updateUploadData = (id, field, value) => {
    setUploads(prev => prev.map(u => u.id === id ? { ...u, [field]: value } : u));
  };

  const handleBatchUpload = async () => {
    setIsProcessing(true);
    let allSuccess = true;

    for (let u of uploads) {
      if (u.status === 'success') continue;
      
      updateUploadData(u.id, 'status', 'uploading');
      updateUploadData(u.id, 'message', 'Uploading...');

      const formData = new FormData();
      formData.append('audio_file', u.audioFile);
      formData.append('user_id', currentUser?.id);
      if (u.title) formData.append('title', u.title);
      if (u.artistName) formData.append('artist_name', u.artistName);
      if (u.genre) formData.append('genre', u.genre);
      if (u.coverFile) formData.append('cover_image_file', u.coverFile);

      try {
        const response = await api.post('/api/songs', formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
        });
        updateUploadData(u.id, 'status', 'success');
        updateUploadData(u.id, 'message', 'Success!');
      } catch (error) {
        allSuccess = false;
        updateUploadData(u.id, 'status', 'error');
        updateUploadData(u.id, 'message', error.response?.data?.error || 'Upload failed');
      }
    }

    setIsProcessing(false);
    if (allSuccess) onUploadComplete();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Multi-Song Uploader</h2>
        <div className="flex gap-4">
          <input 
            type="file" 
            accept="audio/mp3,audio/wav" 
            multiple 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFilesSelected}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary py-2 px-4 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Files
          </button>
          {uploads.length > 0 && (
            <button 
              onClick={handleBatchUpload}
              disabled={isProcessing || !uploads.some(u => u.status !== 'success')}
              className="btn-primary py-2 px-6 flex items-center gap-2 font-bold"
            >
              <Upload className="w-4 h-4" /> 
              {isProcessing ? 'Processing...' : 'Upload All'}
            </button>
          )}
        </div>
      </div>

      {uploads.length === 0 ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-indigo-500/20 rounded-2xl p-16 text-center hover:border-indigo-400/50 hover:bg-indigo-500/5 transition-colors cursor-pointer flex flex-col items-center justify-center my-8"
        >
          <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 text-indigo-400/60">
            <Upload className="w-8 h-8" />
          </div>
          <p className="text-lg font-bold mb-2">Drag tracks here or click to select</p>
          <p className="text-sm text-white/40">Support MP3 and WAV. Bulk upload enabled.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {uploads.map(track => (
            <div key={track.id} className={`glass-panel p-4 flex gap-6 items-center border ${track.status === 'success' ? 'border-emerald-500/30 bg-emerald-500/5' : track.status === 'error' ? 'border-rose-500/30 bg-rose-500/5' : 'border-white/5'}`}>
              
              {/* Cover Image Upload Spot */}
              <div className="relative group w-20 h-20 bg-indigo-500/5 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-indigo-500/10">
                {track.coverFile ? (
                  <img src={URL.createObjectURL(track.coverFile)} className="w-full h-full object-cover" alt="cover" />
                ) : (
                  <ImageIcon className="text-white/20 w-8 h-8" />
                )}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-xs font-bold text-white z-10">
                  COVER
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if(e.target.files[0]) updateUploadData(track.id, 'coverFile', e.target.files[0]);
                    }} 
                  />
                </label>
              </div>

              {/* Form details */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Title</label>
                  <input 
                    type="text" 
                    value={track.title} 
                    onChange={e => updateUploadData(track.id, 'title', e.target.value)}
                    disabled={track.status === 'uploading' || track.status === 'success'}
                    className="input-field w-full py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Artist</label>
                  <input 
                    type="text" 
                    value={track.artistName} 
                    onChange={e => updateUploadData(track.id, 'artistName', e.target.value)}
                    disabled={track.status === 'uploading' || track.status === 'success'}
                    className="input-field w-full py-2 text-sm"
                    placeholder="Auto-detect if empty"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/40 uppercase mb-1">Genre</label>
                  <input 
                    type="text" 
                    value={track.genre} 
                    onChange={e => updateUploadData(track.id, 'genre', e.target.value)}
                    disabled={track.status === 'uploading' || track.status === 'success'}
                    className="input-field w-full py-2 text-sm"
                    placeholder="e.g. Synthwave"
                  />
                </div>
              </div>

              {/* Status & Actions */}
              <div className="w-32 flex flex-col items-end gap-2 shrink-0">
                {track.status === 'idle' && (
                  <button onClick={() => removeUpload(track.id)} className="text-white/40 hover:text-rose-400 p-2"><X className="w-5 h-5"/></button>
                )}
                {track.status === 'uploading' && <span className="text-xs font-bold animate-pulse text-indigo-400 flex items-center gap-1"><Upload className="w-3 h-3"/> Uploading...</span>}
                {track.status === 'success' && <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Done</span>}
                {track.status === 'error' && (
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1"><XCircle className="w-3 h-3"/> Error</span>
                    <span className="text-[9px] text-rose-400/70 truncate w-32 text-right" title={track.message}>{track.message}</span>
                  </div>
                )}
                <div className="text-[10px] text-white/30 font-mono truncate max-w-full" title={track.audioFile.name}>
                  {track.audioFile.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== [ SONG MANAGEMENT TAB ] ====================

const SongsTab = ({ token }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSong, setEditingSong] = useState(null);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/songs');
      setSongs(res.data.songs);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchSongs(); }, []);

  const handleDelete = async (songId, title) => {
    if(!window.confirm(`Delete "${title}" permanently?`)) return;
    try {
      await api.delete(`/api/songs/${songId}`);
      fetchSongs();
    } catch (e) {
      alert("Failed to delete song");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', editingSong.title);
    if(editingSong.artist_name) formData.append('artist_name', editingSong.artist_name);
    formData.append('genre', editingSong.genre);
    if(editingSong.newCoverFile) formData.append('cover_image_file', editingSong.newCoverFile);

    try {
      await api.put(`/api/songs/${editingSong.song_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      setEditingSong(null);
      fetchSongs();
    } catch (err) {
      alert("Failed to update song");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Song Management</h2>
      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/50 animate-pulse">Loading songs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-wider text-indigo-200/40 bg-white/[0.02]">
                  <th className="px-6 py-4">Track</th>
                  <th className="px-6 py-4">Artist</th>
                  <th className="px-6 py-4">Genre</th>
                  <th className="px-6 py-4">Stats</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {songs.map(song => (
                  <tr key={song.song_id} className="hover:bg-indigo-500/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-indigo-500/10 overflow-hidden flex-shrink-0 border border-indigo-500/20">
                          {song.cover_image_url ? 
                            <img src={resolveUrl(song.cover_image_url)} className="w-full h-full object-cover" alt="" /> 
                            : <div className="w-full h-full flex justify-center items-center"><MusicIcon className="w-4 h-4 text-indigo-400/40"/></div>}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white max-w-[200px] truncate">{song.title}</span>
                          <span className="text-[10px] text-white/40">{Math.floor(song.duration/60)}:{(song.duration%60).toString().padStart(2,'0')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/70 whitespace-normal break-words max-w-xs md:max-w-md">{song.artist_name}</td>
                    <td className="px-6 py-4 text-white/50">{song.genre || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] bg-teal-500/10 text-teal-300 px-2 py-1 rounded-full font-mono border border-teal-500/20">
                        {song.play_count} plays
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                       <button onClick={() => setEditingSong({...song, newCoverFile: null})} className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors text-white/40 hover:text-blue-400">
                         <Edit className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDelete(song.song_id, song.title)} className="p-2 hover:bg-rose-500/10 rounded-lg transition-colors text-white/40 hover:text-rose-400">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
                {songs.length === 0 && (
                  <tr><td colSpan="5" className="text-center p-8 text-white/30">No songs found in the database.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingSong && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setEditingSong(null)} className="absolute top-4 right-4 p-2 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-bold mb-6">Edit Song</h3>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative group w-32 h-32 bg-white/5 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
                  {editingSong.newCoverFile ? (
                    <img src={URL.createObjectURL(editingSong.newCoverFile)} className="w-full h-full object-cover" />
                  ) : editingSong.cover_image_url ? (
                    <img src={resolveUrl(editingSong.cover_image_url)} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-white/20"/>
                  )}
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity font-bold text-xs uppercase tracking-widest text-white">
                    Change Cover
                    <input type="file" accept="image/*" className="hidden" onChange={e => setEditingSong({...editingSong, newCoverFile: e.target.files[0]})} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Title</label>
                <input type="text" className="input-field w-full py-2" value={editingSong.title} onChange={e => setEditingSong({...editingSong, title: e.target.value})} required/>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Artist Name</label>
                <input type="text" className="input-field w-full py-2" value={editingSong.artist_name} onChange={e => setEditingSong({...editingSong, artist_name: e.target.value})} required/>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Genre</label>
                <input type="text" className="input-field w-full py-2" value={editingSong.genre} onChange={e => setEditingSong({...editingSong, genre: e.target.value})} />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditingSong(null)} className="flex-1 btn-secondary py-3">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-3 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== [ USER MANAGEMENT TAB ] ====================

const UsersTab = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data.users);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const deleteUser = async (user) => {
    if(!window.confirm(`Delete user "${user.username}" and all their data?`)) return;
    try {
      await api.delete(`/api/admin/users/${user.user_id}`);
      fetchUsers();
    } catch (e) {
      alert("Error deleting user.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      <div className="glass-panel overflow-hidden">
        {loading ? (
           <div className="p-8 text-center text-white/50 animate-pulse">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-wider text-indigo-200/40 bg-white/[0.02]">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => (
                  <tr key={u.user_id} className="hover:bg-indigo-500/[0.02] transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-xs ring-1 ring-indigo-500/30">
                        {u.username ? u.username.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold">{u.username}</span>
                        <span className="text-[10px] text-indigo-200/40">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider border ${
                        u.role === 'admin' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' : 
                        u.role === 'artist' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                      }`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-400 text-xs flex items-center gap-1 pr-2"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span> Active</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteUser(u)} className="p-2 hover:bg-rose-500/10 text-white/40 hover:text-rose-400 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== [ ISSUES MANAGEMENT TAB ] ====================

const IssuesTab = ({ token }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/issues/');
      setIssues(res.data.issues);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchIssues(); }, []);

  const handleResolve = async (issueId, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'resolved' : 'open';
    try {
      await api.put(`/api/issues/${issueId}/resolve`, { status: newStatus });
      fetchIssues();
    } catch (e) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Reported Issues</h2>
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-12 text-center text-white/30 animate-pulse bg-white/[0.02] rounded-3xl border border-white/5">
            Scanning for reports...
          </div>
        ) : issues.length === 0 ? (
          <div className="p-20 text-center text-white/20 bg-white/[0.02] rounded-3xl border border-white/5 italic">
            No issues reported. System is clean.
          </div>
        ) : (
          issues.map(issue => (
            <div 
              key={issue.issue_id} 
              className={`p-6 rounded-3xl border transition-all ${
                issue.status === 'resolved' 
                  ? 'bg-emerald-500/[0.02] border-emerald-500/10 opacity-70' 
                  : 'bg-white/[0.03] border-white/10 shadow-xl'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border ${
                      issue.status === 'resolved' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {issue.status}
                    </span>
                    <span className="text-xs text-white/40 font-mono">
                      {new Date(issue.created_at).toLocaleString()}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{issue.description}</h4>
                    <p className="text-xs text-indigo-300/60 font-semibold flex items-center gap-2">
                       <Users className="w-3 h-3" /> Reported by @{issue.username} ({issue.email})
                    </p>
                  </div>

                  {issue.error_log && issue.error_log !== 'Manual report' && (
                    <div className="mt-4 p-4 bg-black/40 rounded-2xl border border-white/5 overflow-x-auto">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Technical Logs</p>
                      <pre className="text-[10px] font-mono text-rose-400/80 leading-relaxed">
                        {issue.error_log}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0">
                  <button 
                    onClick={() => handleResolve(issue.issue_id, issue.status)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs transition-all ${
                      issue.status === 'resolved'
                        ? 'bg-white/5 text-white/40 hover:bg-white/10'
                        : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    }`}
                  >
                    {issue.status === 'resolved' ? (
                      <><AlertCircle className="w-4 h-4" /> Re-open</>
                    ) : (
                      <><Check className="w-4 h-4" /> Resolve Issue</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Admin;
