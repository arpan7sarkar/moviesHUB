import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown, FiGrid, FiSliders } from 'react-icons/fi';
import { useDiscoverQuery } from '../features/movies/movieApi';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import PageTransition from '../components/layout/PageTransition';
import MovieCard from '../components/cards/MovieCard';

const MOVIE_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Latest Release' },
  { value: 'revenue.desc', label: 'Highest Revenue' },
  { value: 'vote_count.desc', label: 'Most Voted' },
];

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  
  const selectedGenres = useMemo(() => {
    const genreParam = searchParams.get('genre');
    return genreParam ? genreParam.split(',').map(Number) : [];
  }, [searchParams]);
  
  const sortBy = searchParams.get('sort') || 'popularity.desc';

  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Build query params
  const queryParams = useMemo(() => {
    const params = {
      mediaType: 'movie',
      sort_by: sortBy,
      include_adult: false,
      'vote_count.gte': sortBy === 'vote_average.desc' ? 200 : undefined,
      page,
    };
    if (selectedGenres.length > 0) {
      params.with_genres = selectedGenres.join(',');
    }
    return params;
  }, [selectedGenres, sortBy, page]);

  const { data: combinedData, isLoading, isFetching, hasMore, sentinelRef } = useInfiniteScroll(
    useDiscoverQuery,
    queryParams
  );

  const toggleGenre = useCallback((genreId) => {
    const newGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
      
    const newParams = new URLSearchParams(searchParams);
    if (newGenres.length > 0) {
      newParams.set('genre', newGenres.join(','));
    } else {
      newParams.delete('genre');
    }
    setSearchParams(newParams);
    setPage(1);
  }, [selectedGenres, searchParams, setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams({});
    setPage(1);
  }, [setSearchParams]);

  const activeSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Sort';

  // totalResults isn't easily extracted from combinedData array directly. 
  // We can just rely on the data length or if we really needed it, we could expose it from the hook.
  const hasActiveFilters = selectedGenres.length > 0 || sortBy !== 'popularity.desc';

  return (
    <PageTransition>
      <main className="min-h-screen bg-primary pt-[4.5rem] md:pt-20 pb-16">
        <div className="container-custom px-4 md:px-8">

          {/* ═══════════ Page Header ═══════════ */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-black text-text-primary tracking-tight mb-2">
              Explore <span className="text-accent">Movies</span>
            </h1>
            <p className="text-text-muted text-base md:text-lg">
              Discover thousands of titles
            </p>
          </motion.div>

          {/* ═══════════ Filter & Sort Bar ═══════════ */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 flex-wrap">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer
                  ${showFilters || selectedGenres.length > 0
                    ? 'bg-accent/15 border-accent/30 text-accent'
                    : 'bg-white/5 border-border/40 text-text-primary hover:bg-white/10'
                  }`}
              >
                <FiFilter size={15} />
                <span>Genres</span>
                {selectedGenres.length > 0 && (
                  <span className="bg-accent/25 text-accent text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    {selectedGenres.length}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/40 bg-white/5 text-sm font-medium text-text-primary hover:bg-white/10 transition-all cursor-pointer"
                >
                  <FiSliders size={15} />
                  <span>{activeSortLabel}</span>
                  <FiChevronDown size={14} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showSortDropdown && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.12 }}
                      className="absolute top-full left-0 mt-2 w-52 bg-elevated border border-border/40 rounded-xl shadow-elevated z-50 overflow-hidden"
                    >
                      {SORT_OPTIONS.map(option => (
                        <li key={option.value}>
                          <button
                            onClick={() => { 
                              const newParams = new URLSearchParams(searchParams);
                              newParams.set('sort', option.value);
                              setSearchParams(newParams);
                              setShowSortDropdown(false); 
                              setPage(1); 
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer
                              ${option.value === sortBy
                                ? 'bg-accent/10 text-accent font-semibold'
                                : 'text-text-primary hover:bg-white/5'
                              }`}
                          >
                            {option.label}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-text-muted hover:text-danger transition-colors cursor-pointer"
                >
                  <FiX size={13} /> Clear all
                </button>
              )}
            </div>

            {/* Results count indicator removed since it's infinite scroll */}
            <p className="text-text-muted text-xs font-mono">
               {combinedData?.length > 0 ? `${combinedData.length} loaded` : ''}
            </p>
          </motion.div>

          {/* ═══════════ Genre Chips (expandable) ═══════════ */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden mb-8"
              >
                <div className="flex overflow-x-auto gap-3 p-5 bg-white/[0.02] border border-border/15 rounded-2xl custom-scrollbar pb-6">
                  {MOVIE_GENRES.map(genre => (
                    <button
                      key={genre.id}
                      onClick={() => toggleGenre(genre.id)}
                      className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border
                        ${selectedGenres.includes(genre.id)
                          ? 'bg-accent border-accent text-primary shadow-[0_0_15px_rgba(var(--color-accent),0.3)]'
                          : 'bg-white/5 border-border/30 text-text-primary hover:bg-white/10 hover:border-border/60'
                        }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══════════ Movie Grid ═══════════ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-12">
            {isLoading ? (
              // Initial Skeleton loading
              Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-elevated rounded-lg mb-2" />
                  <div className="h-3 bg-elevated rounded w-3/4 mb-1" />
                  <div className="h-2.5 bg-elevated rounded w-1/2" />
                </div>
              ))
            ) : combinedData?.length > 0 ? (
              <>
                {combinedData.map(item => (
                  <MovieCard key={item.id} item={item} mediaType="movie" />
                ))}
                
                {/* Sentinel div for intersection observer */}
                <div ref={sentinelRef} className="col-span-full h-10 w-full flex items-center justify-center mt-4">
                  {hasMore && isFetching && (
                    <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
                  )}
                </div>
              </>
            ) : (
              <div className="col-span-full text-center py-20">
                <FiGrid size={48} className="text-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-display font-bold text-text-primary mb-2">No movies found</h3>
                <p className="text-text-muted text-sm">Try adjusting your filters or sorting options.</p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="mt-4 text-accent font-medium text-sm hover:text-accent-hover cursor-pointer">
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Fetching overlay removed in favor of infinite scroll spinner at bottom */}

          {/* Fetching overlay */}
          {isFetching && !isLoading && (
            <div className="fixed bottom-6 right-6 bg-elevated border border-border/30 rounded-xl px-4 py-2.5 shadow-elevated flex items-center gap-2 z-50">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-text-muted text-xs font-medium">Loading...</span>
            </div>
          )}
        </div>
      </main>
    </PageTransition>
  );
};

export default Movies;
