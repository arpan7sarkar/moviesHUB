import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiArrowRight, FiFilm, FiTv, FiUser } from 'react-icons/fi';
import { useSearchMultiQuery } from '../../features/movies/movieApi';
import useDebounce from '../../hooks/useDebounce';

const TMDB_IMG = 'https://image.tmdb.org/t/p';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 28, stiffness: 350, delay: 0.05 } },
  exit: { opacity: 0, scale: 0.97, y: -10, transition: { duration: 0.12 } },
};

/* ─── Result Item ─────────────────────────────────────────────── */
const ResultItem = ({ item, onClose }) => {
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date)?.substring(0, 4);
  const mediaType = item.media_type;

  let linkPath = '/';
  let Icon = FiFilm;
  let imgPath = item.poster_path;

  if (mediaType === 'movie') {
    linkPath = `/movies/${item.id}`;
    Icon = FiFilm;
  } else if (mediaType === 'tv') {
    linkPath = `/tv/${item.id}`;
    Icon = FiTv;
  } else if (mediaType === 'person') {
    linkPath = `/person/${item.id}`;
    Icon = FiUser;
    imgPath = item.profile_path;
  }

  return (
    <Link
      to={linkPath}
      onClick={onClose}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.06] transition-colors group"
    >
      <div className="w-10 h-14 rounded-lg overflow-hidden bg-elevated border border-border/20 flex-shrink-0">
        {imgPath ? (
          <img src={`${TMDB_IMG}/w92${imgPath}`} alt={title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent transition-colors">{title}</p>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Icon size={11} />
          <span className="capitalize">{mediaType}</span>
          {year && <span>· {year}</span>}
        </div>
      </div>
    </Link>
  );
};

/* ─── Main SearchOverlay ─────────────────────────────────────── */
const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 400);

  const { data: searchData, isFetching } = useSearchMultiQuery(
    { query: debouncedQuery },
    { skip: !debouncedQuery || debouncedQuery.length < 2 }
  );

  const results = searchData?.results?.slice(0, 8) || [];

  // Auto-focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  }, [onClose, navigate, query]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Reset query on close
  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  const handleSeeAll = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center pt-[10vh] md:pt-[15vh] px-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-primary/90 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Search Panel */}
          <motion.div
            className="relative w-full max-w-2xl z-10"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Search Input */}
            <div className="relative mb-6">
              <FiSearch size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, TV shows, people..."
                className="w-full bg-elevated/80 backdrop-blur-md border border-border/40 rounded-2xl py-5 pl-14 pr-14 text-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                autoComplete="off"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <FiX size={20} />
                </button>
              )}
              {/* Loading indicator */}
              {isFetching && (
                <div className="absolute right-14 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Results */}
            {debouncedQuery.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-elevated/80 backdrop-blur-md border border-border/30 rounded-2xl overflow-hidden shadow-elevated"
              >
                {results.length > 0 ? (
                  <>
                    <div className="divide-y divide-border/10 max-h-[50vh] overflow-y-auto no-scrollbar p-2">
                      {results.map((item) => (
                        <ResultItem key={`${item.media_type}-${item.id}`} item={item} onClose={onClose} />
                      ))}
                    </div>

                    {/* See All link */}
                    <button
                      onClick={handleSeeAll}
                      className="w-full flex items-center justify-center gap-2 py-4 text-sm font-semibold text-accent hover:text-accent-hover hover:bg-white/[0.03] transition-colors border-t border-border/15 cursor-pointer"
                    >
                      <span>See all results for "{query}"</span>
                      <FiArrowRight size={14} />
                    </button>
                  </>
                ) : !isFetching ? (
                  <div className="text-center py-12 px-6">
                    <FiSearch size={36} className="text-text-muted mx-auto mb-3" />
                    <p className="text-text-muted text-sm">No results found for "<span className="text-text-primary font-medium">{debouncedQuery}</span>"</p>
                    <p className="text-text-muted text-xs mt-1">Try different keywords or check your spelling</p>
                  </div>
                ) : null}
              </motion.div>
            )}

            {/* Hint text */}
            {!debouncedQuery && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-text-muted text-xs mt-6"
              >
                Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-border/30 text-text-primary font-mono text-[10px]">Enter</kbd> to see all results · <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-border/30 text-text-primary font-mono text-[10px]">Esc</kbd> to close
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
