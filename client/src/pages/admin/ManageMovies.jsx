import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiFilm } from 'react-icons/fi';
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
    <div className="space-y-6">
      {/* ───── Header ───── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Manage Movies</h1>
          <p className="text-sm text-text-muted mt-1">
            {total} movie{total !== 1 ? 's' : ''} in catalog
          </p>
        </div>
        <Link
          to="/admin/movies/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-primary font-semibold rounded-lg hover:bg-accent-hover transition-all active:scale-95 text-sm w-fit"
        >
          <FiPlus size={16} />
          Add Movie
        </Link>
      </div>

      {/* ───── Filters ───── */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1">
          <FiSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
          />
        </form>

        {/* Category filter */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value === 'all' ? '' : e.target.value);
            setPage(1);
          }}
          className="w-full md:w-48 px-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent/50 transition-colors cursor-pointer"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat === 'all' ? '' : cat}>
              {cat === 'all' ? 'All Categories' : cat.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* ───── Table ───── */}
      <div className="bg-secondary border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-4 font-semibold text-text-muted text-[10px] uppercase tracking-wider">Movie</th>
                <th className="px-5 py-4 font-semibold text-text-muted text-[10px] uppercase tracking-wider hidden sm:table-cell">TMDB ID</th>
                <th className="px-5 py-4 font-semibold text-text-muted text-[10px] uppercase tracking-wider hidden lg:table-cell">Genre</th>
                <th className="px-5 py-4 font-semibold text-text-muted text-[10px] uppercase tracking-wider hidden xs:table-cell">Category</th>
                <th className="px-5 py-4 font-semibold text-text-muted text-[10px] uppercase tracking-wider hidden md:table-cell">Release</th>
                <th className="px-5 py-4 font-semibold text-text-muted text-[10px] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-3.5" colSpan={6}>
                      <div className="h-10 bg-elevated rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : movies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-elevated flex items-center justify-center">
                        <FiFilm size={24} className="text-text-muted" />
                      </div>
                      <p className="text-sm text-text-muted">
                        {search ? 'No movies found matching your search.' : 'No movies in catalog yet.'}
                      </p>
                      {!search && (
                        <Link
                          to="/admin/movies/new"
                          className="text-sm text-accent hover:text-accent-hover font-medium"
                        >
                          Add your first movie →
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                movies.map((movie) => (
                  <tr
                    key={movie._id}
                    className="hover:bg-elevated/50 transition-colors"
                  >
                    {/* Movie info */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-13 rounded overflow-hidden bg-elevated border border-border shrink-0">
                          {movie.posterPath ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`}
                              alt={movie.title}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-muted">
                              <FiFilm size={12} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate max-w-[200px]">
                            {movie.title}
                          </p>
                          {movie.voteAverage && (
                            <p className="text-xs text-warning">★ {movie.voteAverage.toFixed(1)}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* TMDB ID */}
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="text-xs text-text-muted font-mono">{movie.tmdbId}</span>
                    </td>

                    {/* Genre */}
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(movie.genres || []).slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className="text-[10px] px-2 py-0.5 bg-elevated text-text-muted border border-border rounded-full"
                          >
                            {g}
                          </span>
                        ))}
                        {(movie.genres || []).length > 2 && (
                          <span className="text-[10px] px-1.5 py-0.5 text-text-muted">
                            +{movie.genres.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3">
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                        {movie.category?.replace('_', ' ') || 'general'}
                      </span>
                    </td>

                    {/* Release Date */}
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="text-xs text-text-muted">{movie.releaseDate || '—'}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/movies/${movie._id}/edit`}
                          className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-all"
                          title="Edit"
                        >
                          <FiEdit2 size={14} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(movie)}
                          className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-text-muted">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-border text-text-muted hover:bg-elevated disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <FiChevronLeft size={14} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-border text-text-muted hover:bg-elevated disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {isFetching && !isLoading && (
        <div className="fixed bottom-6 right-6 bg-secondary border border-border rounded-xl px-4 py-2.5 shadow-elevated flex items-center gap-2 z-50">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-text-muted">Loading...</span>
        </div>
      )}

      {/* ───── Delete Confirmation Modal ───── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-secondary border border-border rounded-2xl p-6 max-w-sm w-full mx-4 shadow-elevated">
            <h3 className="text-lg font-semibold text-text-primary">Delete Movie</h3>
            <p className="text-sm text-text-secondary mt-2">
              Are you sure you want to delete{' '}
              <strong className="text-text-primary">{deleteTarget.title}</strong>? This action
              cannot be undone.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-elevated transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-danger text-white rounded-lg text-sm font-medium hover:bg-danger/90 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMovies;
