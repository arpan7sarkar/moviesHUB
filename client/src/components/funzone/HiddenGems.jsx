import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiStar, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import { useDiscoverQuery } from '../../features/movies/movieApi';
import { Link } from 'react-router-dom';

const GENRES = [
  { id: '', name: 'All Genres' },
  { id: '28', name: 'Action' },
  { id: '35', name: 'Comedy' },
  { id: '18', name: 'Drama' },
  { id: '27', name: 'Horror' },
  { id: '878', name: 'Sci-Fi' },
  { id: '10749', name: 'Romance' },
  { id: '9648', name: 'Mystery' },
  { id: '12', name: 'Adventure' },
  { id: '99', name: 'Documentary' },
  { id: '16', name: 'Animation' },
];

const DECADES = [
  { id: '', name: 'Any Year' },
  { id: '2020', name: '2020s', start: '2020-01-01', end: '2029-12-31' },
  { id: '2010', name: '2010s', start: '2010-01-01', end: '2019-12-31' },
  { id: '2000', name: '2000s', start: '2000-01-01', end: '2009-12-31' },
  { id: '1990', name: '90s', start: '1990-01-01', end: '1999-12-31' },
  { id: '1980', name: '80s', start: '1980-01-01', end: '1989-12-31' },
];

const GemResults = ({ filters, onBack }) => {
  const queryParams = {
    mediaType: 'movie',
    sort_by: 'vote_average.desc',
    'vote_count.gte': 100, // Enough votes to be trustworthy
    'vote_count.lte': 2000, // Not too mainstream
    'vote_average.gte': filters.minRating,
    with_genres: filters.genre,
    page: 1,
  };

  if (filters.decade) {
    const decade = DECADES.find(d => d.id === filters.decade);
    if (decade) {
      queryParams['primary_release_date.gte'] = decade.start;
      queryParams['primary_release_date.lte'] = decade.end;
    }
  }

  const { data, isLoading, isError } = useDiscoverQuery(queryParams);
  const movies = data?.results || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full"
    >
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 text-text-muted hover:text-text-primary hover:bg-surface rounded-full transition-colors cursor-pointer"
        >
          <FiArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-display font-bold text-text-primary flex items-center gap-2">
            <span>💎</span> Discovered Gems
          </h2>
          <p className="text-text-muted text-sm">Movies people rarely talk about but critics love.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-text-muted">Unearthing hidden cinematic treasures...</p>
        </div>
      ) : isError || movies.length === 0 ? (
        <div className="text-center p-12 bg-primary/30 rounded-2xl border border-border/50">
          <p className="text-text-secondary mb-4">No hidden gems found with these exact filters.</p>
          <button onClick={onBack} className="btn-primary py-2 px-6">Adjust Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.slice(0, 10).map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="group bg-primary/50 border border-border/50 rounded-2xl overflow-hidden hover:border-accent/40 hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1 block"
            >
              <div className="relative aspect-2/3 overflow-hidden">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-surface flex items-center justify-center text-text-muted text-xs text-center p-2">
                    {movie.title}
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Rare Badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-accent/90 backdrop-blur-sm text-primary text-[10px] font-bold rounded-md uppercase tracking-wider shadow-md">
                  Rare Gem
                </div>
              </div>
              
              <div className="p-4 relative">
                <h3 className="font-display font-bold text-text-primary text-sm line-clamp-1 mb-2 group-hover:text-accent transition-colors">
                  {movie.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-text-muted">
                   <div className="flex items-center gap-1">
                      <FiStar className="text-warning fill-warning" />
                      <span className="text-text-primary font-medium">{movie.vote_average?.toFixed(1)}</span>
                   </div>
                   {movie.release_date && (
                     <div className="flex items-center gap-1">
                       <FiCalendar />
                       <span>{new Date(movie.release_date).getFullYear()}</span>
                     </div>
                   )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const HiddenGems = () => {
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    decade: '',
    minRating: 7.5
  });

  const handleSearch = () => {
    setHasSearched(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {!hasSearched ? (
          <motion.div
            key="filter-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-3 flex items-center justify-center gap-3">
                <span className="text-4xl">💎</span> Hidden Gem Finder
              </h1>
              <p className="text-text-secondary">Discover amazing movies that most people have never heard of.</p>
            </div>

            <div className="w-full max-w-3xl bg-secondary/80 border border-border rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-elevated">
              
              {/* Genre Selector */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((g) => (
                    <button
                      key={g.id || 'all'}
                      onClick={() => setFilters(prev => ({ ...prev, genre: g.id }))}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                        filters.genre === g.id 
                          ? 'bg-danger text-white border border-danger/50 shadow-md' 
                          : 'bg-primary/50 text-text-secondary border border-border hover:bg-surface hover:text-text-primary'
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Decade Selector */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Decade</h3>
                <div className="flex flex-wrap gap-2">
                  {DECADES.map((d) => (
                    <button
                      key={d.id || 'any'}
                      onClick={() => setFilters(prev => ({ ...prev, decade: d.id }))}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                        filters.decade === d.id 
                          ? 'bg-danger text-white border border-danger/50 shadow-md' 
                          : 'bg-primary/50 text-text-secondary border border-border hover:bg-surface hover:text-text-primary'
                      }`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Slider */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Min Rating:</h3>
                  <div className="flex items-center gap-1 text-warning font-bold">
                    <FiStar className="fill-warning" />
                    {filters.minRating.toFixed(1)}
                  </div>
                </div>
                
                <div className="px-2">
                  <input 
                    type="range" 
                    min="6.0" 
                    max="9.0" 
                    step="0.1" 
                    value={filters.minRating}
                    onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer accent-danger outline-none"
                    style={{
                      background: `linear-gradient(to right, #EF4444 0%, #EF4444 ${((filters.minRating - 6) / 3) * 100}%, #1A2035 ${((filters.minRating - 6) / 3) * 100}%, #1A2035 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-text-muted mt-2 font-medium">
                    <span>6.0</span>
                    <span>9.0</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button 
                  onClick={handleSearch}
                  className="bg-danger hover:bg-danger/90 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(239,68,68,0.3)] cursor-pointer"
                >
                  💎 Find Hidden Gems
                </button>
              </div>

            </div>
          </motion.div>
        ) : (
          <GemResults 
            key="results-view"
            filters={filters} 
            onBack={() => setHasSearched(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HiddenGems;
