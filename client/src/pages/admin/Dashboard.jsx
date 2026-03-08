import { FiUsers, FiHeart, FiBookmark, FiClock, FiTrendingUp, FiUser } from 'react-icons/fi';
import { useGetAdminStatsQuery } from '../../features/admin/adminApi';

const statCards = [
  {
    label: 'Total Users',
    key: 'totalUsers',
    icon: FiUsers,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
  },
  {
    label: 'Total Favorites',
    key: 'totalFavorites',
    icon: FiHeart,
    color: 'text-rose-400',
    bgColor: 'bg-rose-400/10',
    borderColor: 'border-rose-400/20',
  },
  {
    label: 'Total Watchlist',
    key: 'totalWatchlist',
    icon: FiBookmark,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/20',
  },
  {
    label: 'Total History',
    key: 'totalHistory',
    icon: FiClock,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/20',
  },
];

const Dashboard = () => {
  const { data, isLoading, isError } = useGetAdminStatsQuery();

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header skeleton */}
        <div>
          <div className="h-8 w-48 bg-elevated rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-elevated rounded-lg animate-pulse mt-2" />
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-secondary border border-border rounded-xl p-5 h-28 animate-pulse"
            />
          ))}
        </div>
        {/* Tables skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-secondary border border-border rounded-xl h-80 animate-pulse" />
          <div className="bg-secondary border border-border rounded-xl h-80 animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-danger text-sm">Failed to load dashboard data. Please try again.</p>
      </div>
    );
  }

  const { stats, recentUsers, recentFavorites } = data;

  return (
    <div className="space-y-8">
      {/* ───── Page Header ───── */}
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">
          Overview of your CineVault platform activity.
        </p>
      </div>

      {/* ───── Stats Cards ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = stats?.[card.key] ?? 0;

          return (
            <div
              key={card.key}
              className={`bg-secondary border ${card.borderColor} rounded-xl p-5 flex items-start gap-4 transition-all hover:border-opacity-60`}
            >
              <div
                className={`w-11 h-11 rounded-lg ${card.bgColor} flex items-center justify-center shrink-0`}
              >
                <Icon size={20} className={card.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary font-mono tabular-nums">
                  {value.toLocaleString()}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ───── Recent Activity ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-secondary border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <FiTrendingUp size={16} className="text-accent" />
              <h2 className="text-sm font-semibold text-text-primary">Recent Users</h2>
            </div>
            <span className="text-xs text-text-muted">{recentUsers?.length || 0} latest</span>
          </div>
          <div className="divide-y divide-border">
            {recentUsers?.length > 0 ? (
              recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-elevated/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-elevated border border-border shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <FiUser size={14} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-text-muted truncate">{user.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        user.role === 'admin'
                          ? 'bg-accent/10 text-accent border border-accent/20'
                          : 'bg-elevated text-text-muted border border-border'
                      }`}
                    >
                      {user.role}
                    </span>
                    <p className="text-[10px] text-text-muted mt-1">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-sm text-text-muted">
                No users yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Favorites */}
        <div className="bg-secondary border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <FiHeart size={16} className="text-rose-400" />
              <h2 className="text-sm font-semibold text-text-primary">Recent Favorites</h2>
            </div>
            <span className="text-xs text-text-muted">
              {recentFavorites?.length || 0} latest
            </span>
          </div>
          <div className="divide-y divide-border">
            {recentFavorites?.length > 0 ? (
              recentFavorites.map((fav) => (
                <div
                  key={fav._id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-elevated/50 transition-colors"
                >
                  <div className="w-9 h-13 rounded overflow-hidden bg-elevated border border-border shrink-0">
                    {fav.posterPath ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${fav.posterPath}`}
                        alt={fav.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted text-[10px]">
                        N/A
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {fav.title}
                    </p>
                    <p className="text-xs text-text-muted">
                      by {fav.user?.name || 'Unknown'}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-elevated text-text-muted border border-border shrink-0">
                    {fav.mediaType}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-sm text-text-muted">
                No favorites yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
