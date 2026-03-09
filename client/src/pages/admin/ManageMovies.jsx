import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiFilm, FiStar, FiCalendar, FiFilter, FiInbox } from 'react-icons/fi';
import { useGetAdminMoviesQuery, useDeleteMovieMutation } from '../../features/admin/adminApi';

const CATEGORIES = ['all', 'featured', 'trending', 'popular', 'top_rated', 'upcoming', 'general'];

const ManageMovies = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isFetching } = useGetAdminMoviesQuery({ page, search, category });
  const [deleteMovie, { isLoading: isDeleting }] = useDeleteMovieMutation();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMovie(deleteTarget._id).unwrap();
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete movie:', err);
    }
  };

  const movies = data?.movies || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  return (
    <div className="space-y-10">
      {/* ───── Page Header ───── */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent flex items-center gap-3">
            <span className="w-10 h-px bg-accent/30" /> Catalog Management
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-black text-text-primary uppercase italic tracking-tighter">
            Archive <span className="text-accent">Manager</span>
          </h1>
          <p className="text-text-muted text-md font-medium opacity-80 max-w-xl">
            Edit, categorize, and maintain the cinematic library of CinemaHub.
          </p>
        </div>
        
        <Link
          to="/admin/movies/new"
          className="group flex items-center gap-3 px-8 py-4 bg-accent text-primary font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_8px_25px_rgba(var(--accent-rgb),0.3)] shrink-0 italic"
        >
          <FiPlus size={18} />
          Append New Entry
        </Link>
      </motion.div>

      {/* ───── Search & Filter Deck ───── */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4 bg-secondary/30 backdrop-blur-md p-3 rounded-[2rem] border border-border/10 shadow-premium"
      >
        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative flex-1 group">
          <FiSearch
            size={18}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors"
          />
          <input
            type="text"
            placeholder="Search Intelligence System..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-primary/40 border border-border/20 rounded-2xl text-sm font-bold text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all"
          />
        </form>

        {/* Category filter */}
        <div className="relative group">
            <FiFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors pointer-events-none" />
            <select
                value={category}
                onChange={(e) => {
                    setCategory(e.target.value === 'all' ? '' : e.target.value);
                    setPage(1);
                }}
                className="w-full lg:w-64 pl-12 pr-10 py-4 bg-primary/40 border border-border/20 rounded-2xl text-xs font-black uppercase tracking-widest text-text-primary appearance-none focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all cursor-pointer"
            >
                {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat === 'all' ? '' : cat} className="bg-primary text-text-primary">
                    {cat === 'all' ? 'All Sectors' : cat.replace('_', ' ').toUpperCase()}
                    </option>
                ))}
            </select>
        </div>
      </motion.div>

      {/* ───── Table ───── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-secondary/20 backdrop-blur-xl border border-border/20 rounded-[2.5rem] overflow-hidden shadow-elevated"
      >
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="px-8 py-6 font-black text-text-muted text-[10px] uppercase tracking-[0.3em] border-b border-border/10">Project</th>
                <th className="px-8 py-6 font-black text-text-muted text-[10px] uppercase tracking-[0.3em] border-b border-border/10 hidden lg:table-cell text-center">Identity</th>
                <th className="px-8 py-6 font-black text-text-muted text-[10px] uppercase tracking-[0.3em] border-b border-border/10 hidden xl:table-cell">Classification</th>
                <th className="px-8 py-6 font-black text-text-muted text-[10px] uppercase tracking-[0.3em] border-b border-border/10 hidden md:table-cell">Deployment</th>
                <th className="px-8 py-6 font-black text-text-muted text-[10px] uppercase tracking-[0.3em] border-b border-border/10 text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/5">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6" colSpan={5}>
                      <div className="h-16 bg-white/5 rounded-2xl w-full" />
                    </td>
                  </tr>
                ))
              ) : movies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-6 opacity-30">
                        <FiInbox size={60} />
                        <div className="space-y-2">
                             <p className="text-xl font-display font-black uppercase italic tracking-widest">Archive Empty</p>
                             <p className="text-xs font-bold font-mono">No data matching active filters in the mainframe</p>
                        </div>
                    </div>
                  </td>
                </tr>
              ) : (
                movies.map((movie, idx) => (
                  <motion.tr
                    key={movie._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-white/5 transition-all duration-300"
                  >
                    {/* Movie info */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-20 rounded-xl overflow-hidden bg-elevated border border-border/30 shrink-0 shadow-card group-hover:border-accent/40 transition-all duration-500 group-hover:scale-105">
                          {movie.posterPath ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w185${movie.posterPath}`}
                              alt={movie.title}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-muted bg-surface/50">
                              <FiFilm size={24} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-lg font-display font-black text-text-primary uppercase italic tracking-tight group-hover:text-accent transition-colors truncate max-w-[280px]">
                            {movie.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                                {movie.voteAverage && (
                                    <span className="flex items-center gap-1 text-[10px] font-black text-warning">
                                        <FiStar size={10} className="fill-warning" /> {movie.voteAverage.toFixed(1)}
                                    </span>
                                )}
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-accent/20 bg-accent/5 text-accent`}>
                                    {movie.category || 'GENERAL'}
                                </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Identity (TMDB ID) */}
                    <td className="px-8 py-5 hidden lg:table-cell text-center">
                      <span className="text-[11px] font-mono text-text-muted/60 font-medium group-hover:text-text-primary transition-colors">ID#{movie.tmdbId}</span>
                    </td>

                    {/* Genre */}
                    <td className="px-8 py-5 hidden xl:table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        {(movie.genres || []).slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 text-text-muted/80 rounded-lg border border-border/20 group-hover:border-accent/10 group-hover:text-text-primary transition-all"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Release Date */}
                    <td className="px-8 py-5 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-text-muted/60 group-hover:text-text-primary transition-colors">
                            <FiCalendar size={12} />
                            <span className="text-xs font-bold uppercase tracking-tighter">{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'UNDATED'}</span>
                        </div>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 transition-all duration-300">
                        <Link
                          to={`/admin/movies/${movie._id}/edit`}
                          className="w-10 h-10 rounded-xl bg-white/5 border border-border/20 flex items-center justify-center text-text-muted hover:text-accent hover:bg-accent/10 hover:border-accent/30 transition-all active:scale-90"
                          title="Edit Entry"
                        >
                          <FiEdit2 size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(movie)}
                          className="w-10 h-10 rounded-xl bg-white/5 border border-border/20 flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger/10 hover:border-danger/30 transition-all active:scale-90 cursor-pointer"
                          title="Wipe record"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-10 py-6 border-t border-border/10 bg-black/20">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
              Vector {page} of {totalPages}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-12 h-12 rounded-2xl border border-border/20 text-text-muted hover:bg-white/5 hover:text-accent hover:border-accent/20 disabled:opacity-10 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center active:scale-90"
              >
                <FiChevronLeft size={20} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-12 h-12 rounded-2xl border border-border/20 text-text-muted hover:bg-white/5 hover:text-accent hover:border-accent/20 disabled:opacity-10 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center active:scale-90"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Global Sync State */}
      <AnimatePresence>
        {isFetching && !isLoading && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-10 right-10 bg-accent/90 backdrop-blur-md text-primary font-black uppercase tracking-widest text-[10px] px-6 py-4 rounded-full shadow-premium flex items-center gap-4 z-50 italic"
            >
                <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Updating Mainframe...
            </motion.div>
        )}
      </AnimatePresence>

      {/* ───── Delete Confirmation Modal ───── */}
      <AnimatePresence>
          {deleteTarget && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setDeleteTarget(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-secondary/95 border border-border/40 rounded-[3rem] p-10 max-w-md w-full shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
              >
                <div className="w-20 h-20 rounded-3xl bg-danger/10 border border-danger/30 flex items-center justify-center text-danger mb-8 mx-auto shadow-inner">
                    <FiTrash2 size={32} />
                </div>
                <h3 className="text-3xl font-display font-black text-text-primary uppercase italic text-center leading-tight">Terminal <span className="text-danger">Removal</span></h3>
                <p className="text-md text-text-muted mt-4 text-center leading-relaxed">
                  Are you absolutely certain? This will permanently purge <strong className="text-text-primary">{deleteTarget.title}</strong> from the Nexus grid.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-10">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-text-muted hover:bg-white/5 transition-all cursor-pointer border border-border/20"
                  >
                    Abort
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-6 py-4 bg-danger text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-danger-hover hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer active:scale-95 italic"
                  >
                    {isDeleting ? 'Wiping...' : 'PURGE RECORD'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
      </AnimatePresence>
    </div>
  );
};

export default ManageMovies;
