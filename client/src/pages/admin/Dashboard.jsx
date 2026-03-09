import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiHeart, FiBookmark, FiClock, FiTrendingUp, FiUser, FiActivity, FiArrowRight } from 'react-icons/fi';
import { useGetAdminStatsQuery } from '../../features/admin/adminApi';
import { Link } from 'react-router-dom';

const statCards = [
  {
    label: 'Total Users',
    key: 'totalUsers',
    icon: FiUsers,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
    description: 'Registered platform accounts'
  },
  {
    label: 'Total Favorites',
    key: 'totalFavorites',
    icon: FiHeart,
    color: 'text-rose-400',
    bgColor: 'bg-rose-400/10',
    borderColor: 'border-rose-400/20',
    description: 'Movies loved by users'
  },
  {
    label: 'Total Watchlist',
    key: 'totalWatchlist',
    icon: FiBookmark,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/20',
    description: 'Items saved for later'
  },
  {
    label: 'Total History',
    key: 'totalHistory',
    icon: FiClock,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/20',
    description: 'Overall viewing activity'
  },
];

const Dashboard = () => {
  const { data, isLoading, isError } = useGetAdminStatsQuery();

  if (isLoading) {
    return (
      <div className="space-y-12">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 bg-elevated rounded-full" />
          <div className="h-12 w-64 bg-elevated rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-secondary/40 border border-border/40 rounded-3xl p-8 h-40 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-secondary/40 border border-border/40 rounded-3xl h-96 animate-pulse" />
          <div className="bg-secondary/40 border border-border/40 rounded-3xl h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center text-danger">
            <FiActivity size={40} />
        </div>
        <div>
            <h2 className="text-2xl font-display font-black text-text-primary uppercase tracking-tight">Error Fetching Data</h2>
            <p className="text-text-muted mt-2 max-w-sm mx-auto">We encountered an issue fetching the latest analytics. Check your connection or try again.</p>
        </div>
        <button onClick={() => window.location.reload()} className="btn-primary px-8 py-3 rounded-xl font-bold">Refresh Analytics</button>
      </div>
    );
  }

  const { stats, recentUsers, recentFavorites } = data;

  return (
    <div className="space-y-12 max-w-[1400px] mx-auto">
      {/* ───── Page Header ───── */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent flex items-center gap-3">
            <span className="w-10 h-px bg-accent/30" /> Dashboard Overview
          </p>
          <h1 className="text-4xl md:text-6xl font-display font-black text-text-primary uppercase italic tracking-tighter">
            Admin <span className="text-accent">Dashboard</span>
          </h1>
          <p className="text-text-muted text-lg font-medium opacity-80 max-w-2xl">
            Monitor activity metrics and manage your CinemaHub ecosystem from a unified command deck.
          </p>
        </div>
        
        <div className="shrink-0 flex items-center gap-3 bg-accent/5 border border-accent/20 rounded-2xl px-6 py-4 backdrop-blur-md">
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" />
            <span className="text-xs font-black uppercase tracking-widest text-accent">Online</span>
        </div>
      </motion.div>

      {/* ───── Stats Grid ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const value = stats?.[card.key] ?? 0;

          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`bg-secondary/40 border border-border/40 rounded-2xl p-8 flex flex-col justify-between transition-all hover:bg-secondary/60 hover:shadow-sm group cursor-default`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl ${card.bgColor} flex items-center justify-center border border-white/5 shadow-inner`}>
                  <Icon size={28} className={card.color} />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiTrendingUp className="text-text-muted/30" size={24} />
                </div>
              </div>
              
              <div>
                <p className="text-4xl font-black text-text-primary font-mono tracking-tighter tabular-nums mb-1">
                  {value.toLocaleString()}
                </p>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-text-muted group-hover:text-accent transition-colors">
                    {card.label}
                </p>
                <p className="text-[10px] text-text-muted/60 mt-3 font-medium">
                    {card.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ───── Detailed Panels ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Recent Users - Span 2 */}
        <motion.div 
            className="lg:col-span-2 bg-secondary/40 border border-border/40 rounded-2xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
          <div className="px-8 py-7 border-b border-border/10 flex items-center justify-between">
            <h2 className="text-lg font-display font-black text-text-primary uppercase italic tracking-tight flex items-center gap-3">
              <FiUsers className="text-accent" /> Recent <span className="text-accent italic">Users</span>
            </h2>
            <Link to="/admin/users" className="text-xs font-black uppercase tracking-widest text-accent hover:underline flex items-center gap-2">
                Manage <FiArrowRight />
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar max-h-[500px]">
            {recentUsers?.length > 0 ? (
              <div className="divide-y divide-border/5">
                {recentUsers.map((user, idx) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                    className="flex items-center gap-5 px-8 py-5 hover:bg-white/5 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-elevated border border-border/40 shrink-0 group-hover:border-accent transition-all duration-500 shadow-inner p-1">
                        <div className="w-full h-full rounded-xl overflow-hidden">
                            {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-muted bg-surface/50 font-black text-lg">
                                {user.name.charAt(0)}
                            </div>
                            )}
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-md font-bold text-text-primary truncate group-hover:text-accent transition-colors font-display">
                        {user.name}
                      </p>
                      <p className="text-xs text-text-muted font-mono">{user.email}</p>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <span className={`inline-block text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                        user.role === 'admin'
                          ? 'bg-accent/10 text-accent border-accent/30'
                          : 'bg-white/5 text-text-muted border-border/20'
                        }`}
                      >
                        {user.role}
                      </span>
                      <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest block font-mono">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-40">
                <FiUsers size={48} className="mb-4" />
                <p className="font-bold text-sm tracking-widest uppercase italic">No recent accounts</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity Wall - Span 3 */}
        <motion.div 
            className="lg:col-span-3 bg-secondary/40 border border-border/40 rounded-2xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
          <div className="px-8 py-7 border-b border-border/10">
            <h2 className="text-lg font-display font-black text-text-primary uppercase italic tracking-tight flex items-center gap-3">
              <FiActivity className="text-rose-400" /> Recent <span className="text-rose-400 italic">Favorites</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/5">
            {recentFavorites?.length > 0 ? (
                recentFavorites.map((fav, idx) => (
                    <motion.div
                        key={fav._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + idx * 0.05 }}
                        className="bg-secondary/20 p-6 flex flex-col justify-between hover:bg-white/5 transition-all group border-r border-b border-border/5"
                    >
                        <div className="flex gap-4 mb-4">
                            <div className="w-16 h-24 rounded-xl overflow-hidden bg-elevated border border-border/40 shrink-0 shadow-card transition-all duration-500 group-hover:scale-105 group-hover:border-accent">
                                {fav.posterPath ? (
                                    <img src={`https://image.tmdb.org/t/p/w185${fav.posterPath}`} alt={fav.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-text-muted text-xs font-black">N/A</div>
                                )}
                            </div>
                            <div className="min-w-0 flex-1 pt-2">
                                <p className="text-sm font-black text-text-primary truncate uppercase italic leading-tight group-hover:text-accent transition-colors font-display">
                                    {fav.title}
                                </p>
                                <p className="text-[10px] text-text-muted mt-2 font-bold flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-rose-400/50" />
                                    FAVORITED BY {fav.user?.name || 'USER'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent/60">
                                {fav.mediaType}
                            </span>
                            <div className="h-1 w-12 bg-border/20 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-accent"
                                    initial={{ width: 0 }}
                                    animate={{ width: '40%' }}
                                    transition={{ duration: 1 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))
            ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-40">
                    <FiActivity size={48} className="mb-4" />
                    <p className="font-bold text-sm tracking-widest uppercase italic border-t border-border/20 pt-4">No recent activity</p>
                </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
