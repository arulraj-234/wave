import React from 'react';

const ArtistOverview = ({ stats, totalPlays }) => {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Plays" value={(stats?.stats?.total_plays || totalPlays).toLocaleString()} />
        <StatCard title="Unique Listeners" value={(stats?.stats?.unique_listeners || 0).toLocaleString()} />
        <StatCard title="Avg Plays/Song" value={stats?.stats?.avg_plays_per_song || 0} />
        <StatCard title="Followers" value={(stats?.stats?.follower_count || 0).toLocaleString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-8">
          <h3 className="text-xl font-bold mb-6 tracking-tight">Stream Analytics</h3>
          {stats?.daily_streams?.length > 0 ? (
            <div className="space-y-4">
              <p className="text-white/40 mb-3 font-bold uppercase tracking-widest text-[10px]">Last 7 Days</p>
              <div className="flex items-end gap-2 h-48 border-b border-white/5 pb-2">
                {stats.daily_streams.map((day, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-brand-primary/30 rounded-t-sm hover:bg-brand-primary/50 transition-all relative group"
                    style={{ height: `${Math.max(5, (day.daily_streams / Math.max(...stats.daily_streams.map(d => d.daily_streams))) * 100)}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none transition-opacity">
                      {day.stream_date}: {day.daily_streams}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-white/30 font-medium">
                <span>{stats.daily_streams[0]?.stream_date}</span>
                <span>{stats.daily_streams[stats.daily_streams.length - 1]?.stream_date}</span>
              </div>
            </div>
          ) : (
             <div className="h-48 flex items-center justify-center text-white/20 border border-dashed border-white/5 rounded-xl">No Analytics Data</div>
          )}
        </div>

        <div className="glass-panel p-8">
          <h3 className="text-xl font-bold mb-6 tracking-tight">Top Song</h3>
          {stats?.stats?.top_song_title ? (
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl group hover:bg-white/[0.04] transition-colors">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-xl mb-4 flex items-center justify-center text-brand-primary">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
              </div>
              <p className="text-lg font-black text-brand-primary group-hover:text-brand-accent transition-colors truncate">{stats.stats.top_song_title}</p>
              <p className="text-xs text-white/40 font-bold mt-2 uppercase tracking-widest">{stats.stats.top_song_plays?.toLocaleString()} Streams</p>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-white/20 border border-dashed border-white/5 rounded-xl">No top song yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="glass-panel p-6 bg-gradient-to-br from-brand-primary/5 to-transparent border-brand-primary/10 hover:border-brand-primary/20 transition-all group">
    <p className="text-white/40 mb-2 font-bold uppercase tracking-widest text-[10px]">{title}</p>
    <h2 className="text-4xl font-black text-white tabular-nums tracking-tighter group-hover:scale-105 origin-left transition-transform duration-300">
      {value}
    </h2>
  </div>
);

export default ArtistOverview;
