import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiRefreshCw, FiStar } from 'react-icons/fi';
import { useDiscoverQuery } from '../../features/movies/movieApi';
import { Link } from 'react-router-dom';

const GENRES = [
  { id: 28, name: 'Action', color: '#EF4444', emoji: '💥' },
  { id: 35, name: 'Comedy', color: '#F59E0B', emoji: '😂' },
  { id: 18, name: 'Drama', color: '#3B82F6', emoji: '🎭' },
  { id: 27, name: 'Horror', color: '#8B5CF6', emoji: '👻' },
  { id: 878, name: 'Sci-Fi', color: '#10B981', emoji: '👽' },
  { id: 10749, name: 'Romance', color: '#EC4899', emoji: '❤️' },
  { id: 53, name: 'Thriller', color: '#6366F1', emoji: '🔪' },
  { id: 16, name: 'Animation', color: '#14B8A6', emoji: '✨' },
];

// Helper to get a random item
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const RouletteResult = ({ genre, onReset }) => {
  // To get varied results, fetch a random page between 1 and 5
  const randomPage = React.useMemo(() => Math.floor(Math.random() * 5) + 1, [genre.id]);
  
  const { data, isLoading, isError } = useDiscoverQuery({
    mediaType: 'movie',
    with_genres: genre.id,
    page: randomPage,
    sort_by: 'popularity.desc',
    'vote_count.gte': 100
  });

  const [selectedMovie, setSelectedMovie] = useState(null);

  React.useEffect(() => {
    if (data?.results?.length > 0 && !selectedMovie) {
      setSelectedMovie(getRandomItem(data.results));
    }
  }, [data, selectedMovie]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-text-secondary animate-pulse">Finding the perfect {genre.name} movie...</p>
      </div>
    );
  }

  if (isError || !selectedMovie) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <p className="text-danger mb-4">Oops! Couldn't find a movie right now.</p>
        <button onClick={onReset} className="btn-primary">Try Again</button>
      </div>
    );
  }

  const posterUrl = selectedMovie.poster_path
    ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col md:flex-row gap-8 items-center bg-primary/40 p-6 md:p-8 rounded-3xl border border-border/50"
    >
      <div className="w-48 md:w-64 shrink-0 rounded-2xl overflow-hidden shadow-elevated relative group">
        {posterUrl ? (
          <img src={posterUrl} alt={selectedMovie.title} className="w-full h-auto object-cover aspect-[2/3]" />
        ) : (
          <div className="w-full aspect-[2/3] bg-surface flex items-center justify-center text-text-muted">
            No Poster
          </div>
        )}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
          <Link to={`/movies/${selectedMovie.id}`} className="btn-primary">
            View Details
          </Link>
        </div>
      </div>
      
      <div className="flex-1 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
          <span>{genre.emoji}</span> {genre.name} Pick
        </div>
        <h2 className="text-3xl font-display font-bold text-text-primary mb-2">
          {selectedMovie.title}
        </h2>
        {selectedMovie.release_date && (
          <p className="text-text-muted text-sm mb-4">
            {new Date(selectedMovie.release_date).getFullYear()}
          </p>
        )}
        <p className="text-text-secondary line-clamp-4 mb-6 leading-relaxed">
          {selectedMovie.overview || "No overview available for this title."}
        </p>
        <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
          <div className="flex items-center gap-1.5 text-warning font-semibold bg-warning/10 px-3 py-1.5 rounded-lg">
            <FiStar className="fill-warning text-warning" />
            <span>{selectedMovie.vote_average?.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center md:justify-start gap-4">
          <Link to={`/movies/${selectedMovie.id}`} className="btn-primary">
            More Info
          </Link>
          <button
            onClick={onReset}
            className="p-3 text-text-secondary hover:text-accent bg-surface hover:bg-surface border border-border rounded-xl transition-all"
            title="Spin Again"
          >
            <FiRefreshCw size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const MovieRoulette = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedGenre(null);
    
    // Calculate winning segment
    const segmentAngle = 360 / GENRES.length;
    const winningIndex = Math.floor(Math.random() * GENRES.length);
    
    // We want the winning segment to land at the top (0 degrees).
    // The center of segment i is at: i * segmentAngle + (segmentAngle / 2)
    // To align it to top, we need to rotate backwards by that much.
    const targetBase = 360 - (winningIndex * segmentAngle + segmentAngle / 2);
    
    // Add multiple full rotations for effect (e.g., 5-8 spins)
    const extraSpins = (Math.floor(Math.random() * 4) + 5) * 360;
    const finalRotation = rotation - (rotation % 360) + extraSpins + targetBase;
    
    setRotation(finalRotation);

    // Wait for animation to finish
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedGenre(GENRES[winningIndex]);
    }, 4000); // 4 seconds animation matches transition
  };

  const getSegmentPath = (index, total) => {
    const angle = 360 / total;
    const startAngle = (index * angle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * angle - 90) * (Math.PI / 180);
    const x1 = 50 + 50 * Math.cos(startAngle);
    const y1 = 50 + 50 * Math.sin(startAngle);
    const x2 = 50 + 50 * Math.cos(endAngle);
    const y2 = 50 + 50 * Math.sin(endAngle);
    return `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto w-full">
      <AnimatePresence mode="wait">
        {!selectedGenre ? (
          <motion.div
            key="wheel-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center w-full"
          >
            {/* The Wheel */}
            <div className="relative w-72 h-72 md:w-96 md:h-96 my-8">
              {/* Pointer */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-accent filter drop-shadow-[0_0_8px_rgba(212,168,83,0.5)]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 22h20L12 2z" className="rotate-180 transform origin-center" />
                </svg>
              </div>

              {/* Wheel Container */}
              <motion.div
                className="w-full h-full rounded-full overflow-hidden border-4 border-surface shadow-glow bg-surface relative"
                animate={{ rotate: rotation }}
                transition={{ type: 'tween', duration: 4, ease: [0.2, 0.8, 0.2, 1] }} // smooth deceleration
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {GENRES.map((genre, i) => (
                    <g key={genre.id}>
                      <path
                        d={getSegmentPath(i, GENRES.length)}
                        fill={genre.color}
                        className="opacity-90 hover:opacity-100 transition-opacity"
                      />
                      <text
                        x="50"
                        y="20"
                        fill="white"
                        fontSize="4"
                        fontWeight="bold"
                        textAnchor="middle"
                        transform={`rotate(${i * (360 / GENRES.length) + (360 / GENRES.length) / 2}, 50, 50)`}
                        className="drop-shadow-md tracking-wider font-display uppercase"
                      >
                        {genre.emoji} {genre.name}
                      </text>
                    </g>
                  ))}
                </svg>
                
                {/* Center Hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary rounded-full border-4 border-secondary shadow-inner flex items-center justify-center">
                  <span className="text-xl font-branding text-accent">CH</span>
                </div>
              </motion.div>
            </div>

            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className={`btn-primary text-lg px-10 py-4 rounded-full flex items-center gap-3 w-content disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 ${
                !isSpinning && 'cta-pulse hover:scale-105 shadow-[0_0_30px_rgba(212,168,83,0.3)]'
              }`}
            >
              <FiPlay className="fill-current" />
              {isSpinning ? 'Deciding...' : 'Spin the Wheel!'}
            </button>
            <p className="mt-4 text-text-muted text-sm text-center max-w-sm">
              Let fate decide your next viewing experience. Spin the wheel to get a random cinematic masterpiece.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="result-view"
            className="w-full"
          >
            <RouletteResult genre={selectedGenre} onReset={() => setSelectedGenre(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieRoulette;
