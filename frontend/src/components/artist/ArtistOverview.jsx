import React, { useState } from 'react';
import { TrendingUp, Users, Heart, Music, Clock, BarChart3, Headphones } from 'lucide-react';
import { resolveUrl } from '../../api';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const StreamAnalyticsChart = ({ dailyStreams }) => {
  const [hoverIdx, setHoverIdx] = useState(null);
  
  if (!dailyStreams || dailyStreams.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-white/20 border border-dashed border-white/5 rounded-xl">
        No stream data yet
      </div>
    );
  }
  
  const maxDaily = Math.max(...dailyStreams.map(d => d.daily_streams), 1);
  const minDaily = Math.min(...dailyStreams.map(d => d.daily_streams), 0);
  const range = maxDaily === minDaily ? 1 : maxDaily - minDaily;
  
  const points = dailyStreams.map((day, i) => {
    const x = dailyStreams.length > 1 ? (i / (dailyStreams.length - 1)) * 1000 : 500;
    const y = 260 - ((day.daily_streams - minDaily) / range) * 220; // 40 top padding, 40 bottom padding
    return { x, y, day };
  });

  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const cp1x = p1.x + (p2.x - p1.x) / 2;
    const cp2x = p1.x + (p2.x - p1.x) / 2;
    path += ` C ${cp1x},${p1.y} ${cp2x},${p2.y} ${p2.x},${p2.y}`;
  }

  const areaPath = `${path} L ${points[points.length - 1].x},300 L ${points[0].x},300 Z`;

  const labelCount = Math.min(6, dailyStreams.length);
  const labelIndices = Array.from({ length: labelCount }, (_, i) => Math.floor(i * (dailyStreams.length - 1) / (labelCount - 1)));

  return (
    <div className="relative h-56 w-full mt-4 group select-none fade-in zoom-in-95 animate-in duration-500" onMouseLeave={() => setHoverIdx(null)}>
      <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="absolute inset-0 w-full h-[calc(100%-24px)] overflow-visible">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {labelIndices.map(idx => (
           <line key={`grid-${idx}`} x1={points[idx].x} y1="0" x2={points[idx].x} y2="300" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
        ))}

        <path d={areaPath} fill="url(#chartFill)" className="transition-all duration-300" />
        <path d={path} fill="none" stroke="#2DD4BF" strokeWidth="3" vectorEffect="non-scaling-stroke" filter="url(#glow)" />
        <path d={path} fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.6" vectorEffect="non-scaling-stroke" />

        {hoverIdx !== null && (
          <>
            <line x1={points[hoverIdx].x} y1={points[hoverIdx].y} x2={points[hoverIdx].x} y2="300" stroke="#2DD4BF" strokeWidth="1.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
            <circle cx={points[hoverIdx].x} cy={points[hoverIdx].y} r="6" fill="#141414" stroke="#2DD4BF" strokeWidth="3" vectorEffect="non-scaling-stroke" className="pointer-events-none" />
            <circle cx={points[hoverIdx].x} cy={points[hoverIdx].y} r="15" fill="#2DD4BF" fillOpacity="0.2" className="animate-pulse pointer-events-none" />
          </>
        )}
      </svg>
      
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-white/40 font-bold pointer-events-none">
        {labelIndices.map((idx, index) => {
           let alignClass = 'text-center';
           let pushLeft = '0';
           if (index === 0) alignClass = 'text-left';
           else if (index === labelIndices.length - 1) alignClass = 'text-right';
           else pushLeft = `calc(${(points[idx].x / 1000) * 100}% - 20px)`;
           
           return (
             <div key={idx} className={`absolute w-10 ${alignClass}`} style={{ left: index !== 0 && index !== labelIndices.length - 1 ? pushLeft : index === 0 ? '0' : 'auto', right: index === labelIndices.length - 1 ? '0' : 'auto' }}>
               {new Date(points[idx].day.stream_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
             </div>
           );
        })}
      </div>

      {hoverIdx !== null && (
        <div className="absolute inset-0 bottom-6 pointer-events-none transition-all z-30 flex items-center justify-center">
            <div 
               className="absolute -translate-x-1/2 -translate-y-[140%] drop-shadow-[0_0_15px_rgba(45,212,191,0.2)]"
               style={{ left: `${(points[hoverIdx].x / 1000) * 100}%`, top: `${(points[hoverIdx].y / 300) * 100}%` }}
            >
               <div className="bg-zinc-900 border border-white/10 text-white rounded-lg px-3 py-1.5 whitespace-nowrap overflow-visible relative">
                  <span className="text-brand-success font-black tracking-tighter text-sm">{points[hoverIdx].day.daily_streams}</span> <span className="text-white/60 text-[9px] uppercase font-bold tracking-widest leading-[0]">Plays</span>
               </div>
               <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-transparent border-t-zinc-900 absolute left-1/2 -translate-x-1/2 top-full"></div>
            </div>
        </div>
      )}

      {/* Hover Interaction Overlay */}
      <div className="absolute inset-0 bottom-6 flex z-20">
        {points.map((p, i) => (
          <div 
            key={i} 
            className="flex-1 h-full cursor-crosshair"
            onMouseEnter={() => setHoverIdx(i)}
            onClick={() => setHoverIdx(i)}
          />
        ))}
      </div>
    </div>
  );
};

const ArtistOverview = ({ stats, songs }) => {
  const s = stats?.stats || {};
  const dailyStreams = stats?.daily_streams || [];
  const topSongs = stats?.top_songs || [];
  const hourly = stats?.hourly_activity || [];
  const dailyActivity = stats?.daily_activity || [];
  const genres = stats?.genre_distribution || [];
  const languages = stats?.language_distribution || [];

  const maxDaily = Math.max(...dailyStreams.map(d => d.daily_streams), 1);
  const maxHourly = Math.max(...hourly.map(h => h.stream_count), 1);

  // Format peak hour 
  const peakHour = hourly.length > 0
    ? hourly.reduce((a, b) => a.stream_count > b.stream_count ? a : b)
    : null;
  const formatHour = (h) => {
    if (h === 0) return '12 AM';
    if (h === 12) return '12 PM';
    return h > 12 ? `${h - 12} PM` : `${h} AM`;
  };

  // Peak day
  const peakDay = dailyActivity.length > 0
    ? dailyActivity.reduce((a, b) => a.stream_count > b.stream_count ? a : b)
    : null;

  // Color palette for genre/language chips
  const COLORS = ['#A78BFA', '#F472B6', '#34D399', '#FBBF24', '#60A5FA', '#FB923C', '#A3E635'];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* ── Stat Cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={<BarChart3 />} title="Total Plays" value={(s.total_plays || 0).toLocaleString()} accent="from-violet-500/20 to-violet-600/5" />
        <StatCard icon={<Users />} title="Unique Listeners" value={(s.unique_listeners || 0).toLocaleString()} accent="from-blue-500/20 to-blue-600/5" />
        <StatCard icon={<Heart />} title="Followers" value={(s.follower_count || 0).toLocaleString()} accent="from-pink-500/20 to-pink-600/5" />
        <StatCard icon={<Music />} title="Total Tracks" value={s.total_songs || 0} accent="from-emerald-500/20 to-emerald-600/5" />
        <StatCard icon={<Clock />} title="Listen Hours" value={s.total_listen_hours || 0} accent="from-amber-500/20 to-amber-600/5" />
        <StatCard icon={<TrendingUp />} title="Avg/Song" value={s.avg_plays_per_song || 0} accent="from-cyan-500/20 to-cyan-600/5" />
      </div>

      {/* ── Completion Rate Banner ─────────────────── */}
      {s.avg_completion_pct > 0 && (
        <div className="glass-panel p-5 flex items-center gap-4 bg-gradient-to-r from-emerald-500/5 to-transparent border-emerald-500/10">
          <Headphones className="w-8 h-8 text-emerald-400 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-black text-white/40 uppercase tracking-widest">Listener Retention</p>
            <p className="text-2xl font-black text-emerald-400 tabular-nums">{s.avg_completion_pct}%</p>
            <p className="text-[10px] text-white/30">Average song completion rate</p>
          </div>
          <div className="w-32 h-3 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(s.avg_completion_pct, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Stream Analytics (last 30 days) ────── */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-lg font-bold mb-1 tracking-tight">Stream Analytics</h3>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-5">Last 30 Days</p>
          <StreamAnalyticsChart dailyStreams={dailyStreams} />
        </div>

        {/* ── Top Song Card ──────────────────────── */}
        <div className="glass-panel p-6 flex flex-col">
          <h3 className="text-lg font-bold mb-4 tracking-tight">🏆 Top Song</h3>
          {s.top_song_title ? (
            <div className="flex-1 flex flex-col">
              <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl group hover:bg-white/[0.04] transition-colors flex-1">
                {s.top_song_cover && (
                  <img 
                    src={resolveUrl(s.top_song_cover)} 
                    alt="" 
                    className="w-full aspect-square object-cover rounded-xl mb-4 shadow-lg group-hover:scale-[1.02] transition-transform"
                  />
                )}
                <p className="text-lg font-black text-brand-primary group-hover:text-brand-accent transition-colors truncate">{s.top_song_title}</p>
                <p className="text-xs text-white/40 font-bold mt-1 uppercase tracking-widest">{s.top_song_plays?.toLocaleString()} Streams</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/20 border border-dashed border-white/5 rounded-xl">
              No top song yet
            </div>
          )}
        </div>
      </div>

      {/* ── Top Songs Leaderboard ──────────────── */}
      {topSongs.length > 0 && (
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold mb-1 tracking-tight">Song Performance</h3>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-5">All tracks ranked by streams</p>
          <div className="space-y-2">
            {topSongs.slice(0, 10).map((song, i) => {
              const maxPlays = topSongs[0]?.play_count || 1;
              const pct = Math.max(5, (song.play_count / maxPlays) * 100);
              return (
                <div key={song.song_id} className="flex items-center gap-4 group hover:bg-white/[0.02] p-2 rounded-xl transition-colors">
                  <span className={`w-7 text-center text-sm font-black tabular-nums ${i < 3 ? 'text-brand-primary' : 'text-white/20'}`}>
                    {i + 1}
                  </span>
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-dark shrink-0 shadow">
                    {song.cover_image_url ? (
                      <img src={resolveUrl(song.cover_image_url)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10"><Music className="w-4 h-4" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate group-hover:text-brand-primary transition-colors">{song.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {song.genre && <span className="text-[9px] text-brand-primary/70 font-bold uppercase bg-brand-primary/10 px-1.5 py-0.5 rounded">{song.genre}</span>}
                      <span className="text-[10px] text-white/20">{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                  <div className="w-32 hidden md:block">
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-primary/40 to-brand-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-black tabular-nums text-white/60 w-16 text-right">{(song.play_count || 0).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Peak Listening Hours ──────────────── */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold mb-1 tracking-tight">Peak Hours</h3>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">
            {peakHour ? `Busiest at ${formatHour(peakHour.listen_hour)}` : 'When your listeners tune in'}
          </p>
          {hourly.length > 0 ? (
            <div className="flex items-end gap-[2px] h-28">
              {Array.from({ length: 24 }, (_, hour) => {
                const match = hourly.find(h => h.listen_hour === hour);
                const count = match?.stream_count || 0;
                const pct = Math.max(3, (count / maxHourly) * 100);
                const isPeak = peakHour && hour === peakHour.listen_hour;
                return (
                  <div
                    key={hour}
                    className={`flex-1 rounded-t-sm transition-all relative group cursor-pointer ${isPeak ? 'bg-amber-400/60' : 'bg-white/10 hover:bg-white/20'}`}
                    style={{ height: `${pct}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black/90 text-white text-[9px] py-1 px-2 rounded whitespace-nowrap pointer-events-none z-10 font-bold border border-white/10">
                      {formatHour(hour)}: {count}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-28 flex items-center justify-center text-white/20 border border-dashed border-white/5 rounded-xl text-xs">No data</div>
          )}
          <div className="flex justify-between text-[9px] text-white/15 font-bold mt-2">
            <span>12AM</span><span>6AM</span><span>12PM</span><span>6PM</span><span>11PM</span>
          </div>
        </div>

        {/* ── Peak Days ────────────────────────── */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold mb-1 tracking-tight">Peak Days</h3>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">
            {peakDay ? `Best day: ${DAY_LABELS[peakDay.day_of_week - 1]}` : 'Weekly listening pattern'}
          </p>
          <div className="space-y-2">
            {DAY_LABELS.map((label, i) => {
              const dayNum = i + 1;
              const match = dailyActivity.find(d => d.day_of_week === dayNum);
              const count = match?.stream_count || 0;
              const maxDay = Math.max(...dailyActivity.map(d => d.stream_count), 1);
              const pct = Math.max(3, (count / maxDay) * 100);
              const isPeak = peakDay && dayNum === peakDay.day_of_week;
              return (
                <div key={label} className="flex items-center gap-3">
                  <span className={`text-xs font-bold w-8 ${isPeak ? 'text-amber-400' : 'text-white/30'}`}>{label}</span>
                  <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isPeak ? 'bg-gradient-to-r from-amber-400/50 to-amber-400' : 'bg-white/15'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-white/30 tabular-nums w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Genre & Language Distribution ────────── */}
      {(genres.length > 0 || languages.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {genres.length > 0 && (
            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold mb-4 tracking-tight">Genre Mix</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((g, i) => (
                  <span
                    key={g.genre}
                    className="px-3 py-1.5 rounded-full text-xs font-bold border"
                    style={{
                      backgroundColor: `${COLORS[i % COLORS.length]}15`,
                      borderColor: `${COLORS[i % COLORS.length]}30`,
                      color: COLORS[i % COLORS.length]
                    }}
                  >
                    {g.genre} <span className="opacity-60">({g.song_count})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
          {languages.length > 0 && (
            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold mb-4 tracking-tight">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {languages.map((l, i) => (
                  <span
                    key={l.language}
                    className="px-3 py-1.5 rounded-full text-xs font-bold border"
                    style={{
                      backgroundColor: `${COLORS[(i + 3) % COLORS.length]}15`,
                      borderColor: `${COLORS[(i + 3) % COLORS.length]}30`,
                      color: COLORS[(i + 3) % COLORS.length]
                    }}
                  >
                    {l.language} <span className="opacity-60">({l.song_count})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, accent }) => (
  <div className={`glass-panel p-5 bg-gradient-to-br ${accent} border-white/5 hover:border-white/15 transition-all group overflow-hidden`}>
    <div className="flex items-center gap-2 mb-2">
      <span className="text-white/20 group-hover:text-brand-primary/60 transition-colors w-4 h-4 shrink-0 flex items-center justify-center">{icon}</span>
      <p className="text-white/40 font-bold uppercase tracking-wider text-[8px] truncate">{title}</p>
    </div>
    <h2 className="text-2xl lg:text-3xl font-black text-white tabular-nums tracking-tighter group-hover:scale-105 origin-left transition-transform duration-300 truncate">
      {value}
    </h2>
  </div>
);

export default ArtistOverview;
