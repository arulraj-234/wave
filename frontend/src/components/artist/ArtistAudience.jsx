import React from 'react';
import { Users, Star, Headphones, UserPlus, ArrowUpRight, Crown, Lock, TrendingUp } from 'lucide-react';
import { resolveUrl } from '../../api';

const GENDER_ICONS = {
  male: '♂',
  female: '♀',
  'non-binary': '⚧',
  other: '◆',
  prefer_not_to_say: '—'
};

const GENDER_COLORS = {
  male: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', bar: 'from-blue-400 to-blue-500' },
  female: { bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-400', bar: 'from-pink-400 to-pink-500' },
  'non-binary': { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', bar: 'from-purple-400 to-purple-500' },
  other: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', bar: 'from-amber-400 to-amber-500' },
  prefer_not_to_say: { bg: 'bg-white/5', border: 'border-white/10', text: 'text-white/40', bar: 'from-white/20 to-white/30' }
};

const AGE_COLORS = ['#A78BFA', '#F472B6', '#34D399', '#FBBF24', '#60A5FA', '#FB923C'];

const ArtistAudience = ({ stats }) => {
  const s = stats?.stats || {};
  const genderData = stats?.gender_breakdown || [];
  const ageData = stats?.age_distribution || [];
  const superfan = stats?.superfan;
  const qualityPrefs = stats?.quality_preferences || [];
  const recentFollowers = stats?.recent_followers || [];
  const followerGrowth = stats?.follower_growth || [];
  const newVsReturn = stats?.new_vs_returning || {};

  const totalGenderListeners = genderData.reduce((sum, g) => sum + g.listener_count, 0) || 1;
  const totalAgeListeners = ageData.reduce((sum, a) => sum + a.listener_count, 0) || 1;
  const totalQualityListeners = qualityPrefs.reduce((sum, q) => sum + q.listener_count, 0) || 1;

  const hasData = genderData.length > 0 || ageData.length > 0 || superfan || recentFollowers.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* ── Top Stats Row ──────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniStat icon={<Users />} label="Unique Listeners" value={(s.unique_listeners || 0).toLocaleString()} />
        <MiniStat icon={<Star />} label="Followers" value={(s.follower_count || 0).toLocaleString()} />
        <MiniStat 
          icon={<UserPlus />} 
          label="New (30d)" 
          value={(newVsReturn.new_listeners || 0).toLocaleString()} 
        />
        <MiniStat 
          icon={<ArrowUpRight />} 
          label="Returning (30d)" 
          value={(newVsReturn.returning_listeners || 0).toLocaleString()} 
        />
      </div>

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-white/[0.01] rounded-full border border-dashed border-white/10 flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-white/10" />
          </div>
          <h3 className="text-2xl font-black">Audience insights are building</h3>
          <p className="text-white/40 max-w-md mx-auto mt-2 font-medium">
            As more listeners stream your music, we'll surface deep analytics about your audience right here.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">

            {/* ── Gender Breakdown ─────────────────── */}
            {genderData.length > 0 && (
              <div className="glass-panel p-6">
                <h3 className="text-lg font-bold mb-4 tracking-tight">Gender Breakdown</h3>
                <div className="space-y-3">
                  {genderData.map((g) => {
                    const pct = Math.round((g.listener_count / totalGenderListeners) * 100);
                    const colors = GENDER_COLORS[g.gender] || GENDER_COLORS.other;
                    const label = g.gender === 'prefer_not_to_say' ? 'Not specified' : g.gender?.charAt(0).toUpperCase() + g.gender?.slice(1);
                    return (
                      <div key={g.gender} className="flex items-center gap-3">
                        <span className={`text-lg w-6 text-center ${colors.text}`}>{GENDER_ICONS[g.gender] || '◆'}</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-white/70">{label}</span>
                            <span className="text-xs font-bold text-white/40 tabular-nums">{pct}%</span>
                          </div>
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${colors.bar} rounded-full`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Age Distribution ─────────────────── */}
            {ageData.length > 0 && (
              <div className="glass-panel p-6">
                <h3 className="text-lg font-bold mb-4 tracking-tight">Age Distribution</h3>
                <div className="space-y-3">
                  {ageData.map((a, i) => {
                    const pct = Math.round((a.listener_count / totalAgeListeners) * 100);
                    return (
                      <div key={a.age_group} className="flex items-center gap-3">
                        <span className="text-xs font-bold w-14 text-white/40">{a.age_group}</span>
                        <div className="flex-1 h-5 bg-white/5 rounded-full overflow-hidden relative">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.max(5, pct)}%`,
                              backgroundColor: AGE_COLORS[i % AGE_COLORS.length]
                            }}
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/50 tabular-nums">{a.listener_count}</span>
                        </div>
                        <span className="text-xs font-bold text-white/30 tabular-nums w-10 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ── Top Regions (Coming Soon / Locked) ── */}
            <div className="glass-panel p-6 relative overflow-hidden group border border-white/5">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-20" />
               <div className="flex items-center justify-between mb-1 relative z-10">
                 <h3 className="text-lg font-bold tracking-tight">Top Regions</h3>
                 <span className="text-[8px] font-black uppercase tracking-widest text-brand-primary/40 bg-white/5 px-2 py-1 rounded-full border border-white/10">Coming Soon</span>
               </div>
               <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 relative z-10">Where your fans are</p>
               <div className="h-[140px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-black/20 relative z-10">
                 <div className="flex items-center gap-2 text-white/40 mb-2 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-md">
                   <span className="text-xs font-bold uppercase tracking-widest">Unlocks at 50 Streams</span>
                 </div>
                 <p className="text-[10px] text-white/25 text-center px-4">Keep growing your audience to unlock geographic heatmaps.</p>
               </div>
            </div>

            {/* ── Recent Followers ──────────────────── */}
            <div className="glass-panel p-6 border border-white/5">
              <h3 className="text-lg font-bold mb-4 tracking-tight">Recent Followers</h3>
              {recentFollowers.length > 0 ? (
                <div className="space-y-3">
                  {recentFollowers.map((f, i) => (
                    <div key={f.user_id || i} className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-full bg-brand-dark border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                        {f.avatar_url ? (
                          <img src={resolveUrl(f.avatar_url)} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-black text-white/30">{f.username?.[0]?.toUpperCase()}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate group-hover:text-brand-primary transition-colors">{f.username}</p>
                        <p className="text-[10px] text-white/25">{f.followed_at?.split(' ')[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[160px] flex flex-col items-center justify-center text-center border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                  <UserPlus className="w-8 h-8 text-white/10 mb-3" />
                  <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest">No followers yet</p>
                  <p className="text-[10px] text-white/20 mt-1 max-w-[200px]">When listeners follow your profile, they will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Follower Growth Timeline ─────────────── */}
          <div className="glass-panel p-6 border border-white/5">
            <h3 className="text-lg font-bold mb-1 tracking-tight">Follower Growth</h3>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-5">Monthly new followers</p>
            {followerGrowth.length > 1 ? (
              <div className="flex items-end gap-1 h-32">
                {followerGrowth.map((m, i) => {
                  const maxFollowers = Math.max(...followerGrowth.map(f => f.new_followers), 1);
                  const pct = Math.max(8, (m.new_followers / maxFollowers) * 100);
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group">
                      <div className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-white/50 transition-opacity mb-1">
                        +{m.new_followers}
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-pink-500/40 to-pink-400/20 rounded-t-sm hover:from-pink-500/60 hover:to-pink-400/40 transition-all cursor-pointer"
                        style={{ height: `${pct}%` }}
                      />
                      <span className="text-[9px] font-bold text-white/25 truncate w-full text-center mt-1">{m.month?.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest">Not enough history</p>
                <p className="text-[10px] text-white/20 mt-1">Check back next month for historical growth insights.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const MiniStat = ({ icon, label, value }) => (
  <div className="glass-panel p-4 flex items-center gap-3 group hover:border-white/15 transition-all">
    <div className="text-white/15 group-hover:text-brand-primary/40 transition-colors w-5 h-5 shrink-0">{icon}</div>
    <div>
      <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-black tabular-nums tracking-tight">{value}</p>
    </div>
  </div>
);

export default ArtistAudience;
