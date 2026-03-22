import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Headphones, Disc3, Clock, Music, Heart, Users, Play, BarChart3, Mic2, Globe } from 'lucide-react';
import api from '../api';
import { PlayerContext } from '../context/PlayerContext';
import CountUp from '../components/CountUp';

const ListenerStats = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { playSong } = useContext(PlayerContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(`/api/stats/listener/${user.id}`);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching listener stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [user.id]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto pb-32 custom-scrollbar animate-fade-in">
        <div className="p-8 max-w-6xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-64 bg-brand-surface rounded-xl" />
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-36 bg-brand-surface rounded-2xl" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="h-80 bg-brand-surface rounded-2xl" />
              <div className="h-80 bg-brand-surface rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Total Streams', 
      value: stats?.stats?.total_streams || 0, 
      icon: Play,
      gradient: 'from-sky-500/20 to-sky-500/5',
      iconColor: 'text-sky-400',
      borderColor: 'border-sky-500/10',
      countUp: true
    },
    { 
      label: 'Listen Time', 
      value: stats?.stats?.total_listen_time || '0h 0m', 
      icon: Clock,
      gradient: 'from-violet-500/20 to-violet-500/5',
      iconColor: 'text-violet-400',
      borderColor: 'border-violet-500/10'
    },
    { 
      label: 'Top Artist', 
      value: stats?.stats?.top_artist || '--', 
      icon: Mic2,
      gradient: 'from-rose-500/20 to-rose-500/5',
      iconColor: 'text-rose-400',
      borderColor: 'border-rose-500/10',
      isText: true
    },
    { 
      label: 'Top Language', 
      value: stats?.stats?.top_language || '--', 
      icon: Globe,
      gradient: 'from-amber-500/20 to-amber-500/5',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/10',
      isText: true
    },
    { 
      label: 'Top Genre', 
      value: stats?.stats?.top_genre || '--', 
      icon: Disc3,
      gradient: 'from-fuchsia-500/20 to-fuchsia-500/5',
      iconColor: 'text-fuchsia-400',
      borderColor: 'border-fuchsia-500/10',
      isText: true
    },
    { 
      label: 'Unique Languages', 
      value: stats?.stats?.unique_languages || 0, 
      icon: Globe,
      gradient: 'from-blue-500/20 to-blue-500/5',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/10',
      countUp: true
    },
    { 
      label: 'Unique Genres', 
      value: stats?.stats?.unique_genres || 0, 
      icon: Music,
      gradient: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/10',
      countUp: true
    },
    { 
      label: 'Liked Songs', 
      value: stats?.stats?.liked_count || 0, 
      icon: Heart,
      gradient: 'from-pink-500/20 to-pink-500/5',
      iconColor: 'text-pink-400',
      borderColor: 'border-pink-500/10',
      countUp: true
    },
    {
      label: 'Liked Playlists',
      value: stats?.stats?.liked_playlists_count || 0,
      icon: Disc3,
      gradient: 'from-orange-500/20 to-orange-500/5',
      iconColor: 'text-orange-400',
      borderColor: 'border-orange-500/10',
      countUp: true
    }
  ];

  const maxPlayCount = stats?.top_songs?.[0]?.play_count || 1;
  const maxGenreCount = stats?.top_genres?.[0]?.listen_count || 1;
  const maxLanguageCount = stats?.top_languages?.[0]?.listen_count || 1;

  // Colors for genre bars
  const genreColors = [
    'bg-sky-400', 'bg-violet-400', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400',
    'bg-pink-400', 'bg-teal-400', 'bg-orange-400'
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-32 custom-scrollbar animate-fade-in">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-slide-up">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/[0.06] flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-brand-primary">Your Stats</h1>
              <p className="text-brand-muted text-sm font-medium mt-0.5">Your personal Spotify Wrapped — updated live.</p>
            </div>
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.label}
                className={`relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br ${card.gradient} border ${card.borderColor} hover:scale-[1.02] transition-all duration-300 animate-slide-up group`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">{card.label}</span>
                  <Icon className={`w-5 h-5 ${card.iconColor} opacity-60 group-hover:opacity-100 transition-opacity`} />
                </div>
                <span className={`${card.isText ? 'text-lg' : 'text-3xl'} font-bold text-brand-primary block truncate`}>
                  {card.countUp ? (
                    <CountUp from={0} to={Number(card.value) || 0} separator="," duration={1.5} />
                  ) : (
                    card.value
                  )}
                </span>
                {/* Decorative glow */}
                <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20 bg-gradient-to-br ${card.gradient}`} />
              </div>
            );
          })}
        </div>

        {/* Main Content - Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Played Songs */}
          <div className="rounded-2xl bg-brand-surface border border-white/[0.03] overflow-hidden animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="p-6 pb-4 border-b border-white/[0.03]">
              <h3 className="text-sm font-bold text-brand-primary uppercase tracking-wider flex items-center gap-2">
                <Headphones className="w-4 h-4 text-sky-400" />
                Most Played
              </h3>
            </div>
            <div className="p-4">
              {stats?.top_songs?.length > 0 ? (
                <div className="space-y-1">
                  {stats.top_songs.slice(0, 8).map((song, i) => (
                    <div 
                      key={song.song_id} 
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group"
                      onClick={() => playSong(song)}
                    >
                      {/* Rank */}
                      <span className={`text-sm font-black w-6 text-center tabular-nums ${i < 3 ? 'text-white' : 'text-brand-muted'}`}>
                        {i + 1}
                      </span>

                      {/* Cover */}
                      <div className="w-10 h-10 rounded-lg bg-brand-dark flex items-center justify-center overflow-hidden shrink-0 relative">
                        {song.cover_image_url ? (
                          <img src={song.cover_image_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <Music className="w-4 h-4 text-brand-muted" />
                        )}
                        <div className="absolute inset-0 bg-brand-dark/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-brand-primary truncate">{song.title}</div>
                        <div className="text-xs text-brand-muted truncate">{song.artist_name}</div>
                      </div>

                      {/* Play count bar */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className="h-full bg-sky-400/60 rounded-full transition-all duration-700" 
                            style={{ width: `${(song.play_count / maxPlayCount) * 100}%` }} 
                          />
                        </div>
                        <span className="text-xs font-bold text-brand-muted tabular-nums w-8 text-right">{song.play_count}×</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Headphones className="w-10 h-10 text-brand-muted/30 mx-auto mb-3" />
                  <p className="text-sm text-brand-muted">Start listening to see your top songs!</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Languages and Genres Container */}
          <div className="space-y-6">
            {/* Top Languages */}
            <div className="rounded-2xl bg-brand-surface border border-white/[0.03] overflow-hidden animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="p-6 pb-4 border-b border-white/[0.03]">
                <h3 className="text-sm font-bold text-brand-primary uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  Top Languages
                </h3>
              </div>
              <div className="p-6">
                {stats?.top_languages?.length > 0 ? (
                  <div className="space-y-4">
                    {stats.top_languages.slice(0, 3).map((lang, i) => {
                      const pct = (lang.listen_count / maxLanguageCount) * 100;
                      const barColor = genreColors[i % genreColors.length];
                      return (
                        <div key={lang.language} className="group">
                          <div className="flex justify-between items-center mb-1.5">
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-black w-4 text-center tabular-nums ${i < 2 ? 'text-white' : 'text-brand-muted'}`}>
                                {i + 1}
                              </span>
                              <span className="text-sm font-semibold text-brand-primary">{lang.language}</span>
                            </div>
                            <span className="text-xs font-bold text-brand-muted tabular-nums">{lang.listen_count} plays</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden ml-7">
                            <div 
                              className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`}
                              style={{ width: `${pct}%`, opacity: 0.7 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Globe className="w-8 h-8 text-brand-muted/30 mx-auto mb-2" />
                    <p className="text-xs text-brand-muted">Listen to more music to discover your top language!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Genres */}
            <div className="rounded-2xl bg-brand-surface border border-white/[0.03] overflow-hidden animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="p-6 pb-4 border-b border-white/[0.03]">
                <h3 className="text-sm font-bold text-brand-primary uppercase tracking-wider flex items-center gap-2">
                  <Disc3 className="w-4 h-4 text-violet-400" />
                  Top Genres
                </h3>
              </div>
              <div className="p-6">
                {stats?.top_genres?.length > 0 ? (
                  <div className="space-y-4">
                    {stats.top_genres.slice(0, 4).map((genre, i) => {
                      const pct = (genre.listen_count / maxGenreCount) * 100;
                      const barColor = genreColors[i % genreColors.length];
                      return (
                        <div key={genre.genre} className="group">
                          <div className="flex justify-between items-center mb-1.5">
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-black w-4 text-center tabular-nums ${i < 2 ? 'text-white' : 'text-brand-muted'}`}>
                                {i + 1}
                              </span>
                              <span className="text-sm font-semibold text-brand-primary">{genre.genre}</span>
                            </div>
                            <span className="text-xs font-bold text-brand-muted tabular-nums">{genre.listen_count} plays</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden ml-7">
                            <div 
                              className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`}
                              style={{ width: `${pct}%`, opacity: 0.7 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Disc3 className="w-8 h-8 text-brand-muted/30 mx-auto mb-2" />
                    <p className="text-xs text-brand-muted">Listen to more music to discover your genre taste!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListenerStats;
