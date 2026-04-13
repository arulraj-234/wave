import React from 'react';
import { TrendingUp, Users, Heart, Music, Clock, BarChart3, Headphones } from 'lucide-react';
import { resolveUrl } from '../../api';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
          {dailyStreams.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-end gap-1.5 h-40 mt-6 group/chart border-b border-white/5 pb-2">
                {dailyStreams.map((day, i) => {
                  const pct = Math.max(8, (day.daily_streams / maxDaily) * 100);
                  const hoverDate = new Date(day.stream_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) || day.stream_date;
                  return (
                    <div
                      key={i}
                      className="flex-1 relative group cursor-pointer h-full flex flex-col justify-end"
                    >
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 bg-zinc-900 border border-white/10 text-white text-[10px] py-1.5 px-3 rounded-lg whitespace-nowrap pointer-events-none transition-all duration-200 z-10 font-bold shadow-xl drop-shadow-[0_0_15px_rgba(29,185,84,0.2)] scale-95 group-hover:scale-100 origin-bottom text-center">
                        <span className="text-brand-primary text-sm tracking-tight">{day.daily_streams}</span> <span className="text-white/70">streams</span>
                        <br /><span className="text-white/30 font-medium text-[9px]">{hoverDate}</span>
                      </div>
                      {/* The Bar */}
                      <div 
                        className="w-full bg-gradient-to-t from-brand-primary/10 to-brand-primary/30 rounded-t-md group-hover:from-brand-primary/30 group-hover:to-brand-primary transition-all duration-300 overflow-hidden group-hover:shadow-[0_0_15px_rgba(29,185,84,0.3)] group-hover:-translate-y-1"
                        style={{ height: `${pct}%` }}
                      >
                        <div className="absolute inset-x-0 top-0 h-1 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-white/30 font-bold px-1">
                <span>{new Date(dailyStreams[0]?.stream_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                <span>{new Date(dailyStreams[dailyStreams.length - 1]?.stream_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-white/20 border border-dashed border-white/5 rounded-xl">
              No stream data yet
            </div>
          )}
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
