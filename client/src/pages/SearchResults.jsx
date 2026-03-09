import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilm, FiTv, FiUser, FiGrid } from 'react-icons/fi';
import { useSearchMultiQuery } from '../features/movies/movieApi';
import PageTransition from '../components/layout/PageTransition';
import MovieCard from '../components/cards/MovieCard';
import PersonCard from '../components/cards/PersonCard';

const TMDB_IMG = 'https://image.tmdb.org/t/p';

const TABS = [
  { id: 'all', label: 'All', icon: FiGrid },
  { id: 'movie', label: 'Movies', icon: FiFilm },
  { id: 'tv', label: 'TV Shows', icon: FiTv },
  { id: 'person', label: 'People', icon: FiUser },
];

/* ─── Person Grid Card (larger than PersonCard) ───────────────── */
const PersonResultCard = ({ person }) => (
  <Link
    to={`/person/${person.id}`}
    className="flex flex-col items-center group"
  >
    <div className="w-full aspect-2/3 rounded-xl overflow-hidden bg-elevated border border-border/20 mb-3 group-hover:border-accent transition-all shadow-card group-hover:shadow-elevated">
      {person.profile_path ? (
        <img
          src={`${TMDB_IMG}/w300${person.profile_path}`}
          alt={person.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-text-muted bg-surface">
          <FiUser size={40} />
        </div>
      )}
    </div>
    <h3 className="text-sm font-medium text-text-primary text-center truncate w-full group-hover:text-accent transition-colors">{person.name}</h3>
    <p className="text-xs text-text-muted text-center">{person.known_for_department}</p>
  </Link>
);

/* ─── Main SearchResults ──────────────────────────────────────── */
const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [allResults, setAllResults] = useState([]);
  const loadMoreRef = useRef(null);

  const { data, isLoading, isFetching } = useSearchMultiQuery(
    { query, page },
    { skip: !query }
  );

  // Accumulate results for infinite scroll behavior
  useEffect(() => {
    if (data?.results) {
      if (page === 1) {
        setAllResults(data.results);
      } else {
        setAllResults(prev => [...prev, ...data.results]);
      }
    }
  }, [data, page]);

  // Reset on query change
  useEffect(() => {
    setPage(1);
    setAllResults([]);
    setActiveTab('all');
  }, [query]);

  // Filter results by tab
  const filteredResults = useMemo(() => {
    if (activeTab === 'all') return allResults;
    return allResults.filter(item => item.media_type === activeTab);
  }, [allResults, activeTab]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts = { all: allResults.length, movie: 0, tv: 0, person: 0 };
    allResults.forEach(item => {
      if (counts[item.media_type] !== undefined) counts[item.media_type]++;
    });
    return counts;
  }, [allResults]);

  const totalPages = data?.total_pages || 1;
  const canLoadMore = page < totalPages && page < 20; // Cap at 20 pages

  useEffect(() => {
    if (activeTab !== 'all' || !canLoadMore || isFetching || isLoading) return;
    const current = loadMoreRef.current;
    if (!current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { root: null, rootMargin: '0px', threshold: 1 }
    );

    observer.observe(current);
    return () => observer.disconnect();
  }, [activeTab, canLoadMore, isFetching, isLoading]);

  if (!query) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-primary pt-24 pb-16">
          <div className="container-custom px-4 md:px-8 flex flex-col items-center justify-center min-h-[60vh]">
            <FiSearch size={56} className="text-text-muted mb-6" />
            <h1 className="text-3xl font-display font-bold text-text-primary mb-3">Search CinemaHub</h1>
            <p className="text-text-muted text-base">Use the search icon in the navbar to find movies, TV shows, and people.</p>
          </div>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-primary pt-18 md:pt-20 pb-16">
        <div className="container-custom px-4 md:px-8">

          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight mb-2">
              Results for "<span className="text-accent">{query}</span>"
            </h1>
            <p className="text-text-muted text-sm">
              {data?.total_results ? `${data.total_results.toLocaleString()} results found` : 'Searching...'}
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap border shrink-0
                  ${activeTab === tab.id
                    ? 'bg-accent/15 border-accent/30 text-accent font-semibold'
                    : 'bg-white/5 border-border/30 text-text-muted hover:text-text-primary hover:bg-white/10'
                  }`}
              >
                <tab.icon size={15} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${activeTab === tab.id ? 'bg-accent/20 text-accent' : 'bg-white/10 text-text-muted'}`}>
                  {tabCounts[tab.id]}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Loading State */}
          {isLoading && page === 1 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-2/3 bg-elevated rounded-lg mb-2" />
                  <div className="h-3 bg-elevated rounded w-3/4 mb-1" />
                  <div className="h-2.5 bg-elevated rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredResults.length > 0 ? (
            <>
              {/* Results Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-12">
                {filteredResults.map((item, i) => {
                  if (item.media_type === 'person') {
                    return <PersonResultCard key={`person-${item.id}`} person={item} />;
                  }
                  return (
                    <MovieCard
                      key={`${item.media_type}-${item.id}`}
                      item={item}
                      mediaType={item.media_type}
                    />
                  );
                })}
              </div>

              {canLoadMore && activeTab === 'all' && (
                <div ref={loadMoreRef} className="flex justify-center min-h-10">
                  {isFetching && (
                    <div className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-border/30 text-text-muted text-sm">
                      <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      <span>Loading...</span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <motion.div
              className="flex flex-col items-center justify-center py-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-20 h-20 rounded-full bg-white/5 border border-border/20 flex items-center justify-center mb-6">
                <FiSearch size={32} className="text-text-muted" />
              </div>
              <h2 className="text-xl font-display font-bold text-text-primary mb-2">
                No results found for "{query}"
              </h2>
              <p className="text-text-muted text-sm text-center max-w-md mb-6">
                We couldn't find any movies, TV shows, or people matching your search. Try different keywords or check your spelling.
              </p>
              <Link to="/" className="btn-primary px-6 py-2.5 text-sm">
                Back to Home
              </Link>
            </motion.div>
          )}
        </div>
      </main>
    </PageTransition>
  );
};

export default SearchResults;
