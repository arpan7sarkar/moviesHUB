import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiRefreshCw, FiStar, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import { useDiscoverQuery } from '../../features/movies/movieApi';
import { Link } from 'react-router-dom';

const GENRES = [
  { id: 28, name: 'ACTION' },
  { id: 35, name: 'COMEDY' },
  { id: 18, name: 'DRAMA' },
  { id: 27, name: 'HORROR' },
  { id: 878, name: 'SCI-FI' },
  { id: 10749, name: 'ROMANCE' },
  { id: 53, name: 'THRILLER' },
  { id: 16, name: 'ANIMATION' },
];

const RouletteResult = ({ genre, onReset }) => {
  const randomPage = React.useMemo(() => Math.floor(Math.random() * 5) + 1, [genre.id]);
  
  const { data, isLoading, isError } = useDiscoverQuery({
    mediaType: 'movie',
    with_genres: genre.id,
    page: randomPage,
    sort_by: 'popularity.desc',
    'vote_count.gte': 100
  });

  const [selectedMovies, setSelectedMovies] = useState([]);

  React.useEffect(() => {
    if (data?.results?.length > 0 && selectedMovies.length === 0) {
      const shuffled = [...data.results].sort(() => 0.5 - Math.random());
      setSelectedMovies(shuffled.slice(0, 5));
    }
  }, [data, selectedMovies]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-text-secondary animate-pulse">Finding the perfect {genre.name} movies...</p>
      </div>
    );
  }

  if (isError || selectedMovies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[400px] w-full">
        <p className="text-danger mb-4">Oops! Couldn't find movies right now.</p>
        <button onClick={onReset} className="btn-primary">Try Again</button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center w-full"
    >
      <div className="flex items-center justify-between w-full mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className="p-2 text-text-muted hover:text-accent hover:bg-surface rounded-full transition-colors cursor-pointer"
          >
            <FiArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-accent uppercase tracking-wider">
              {genre.name} PICKS
            </h2>
            <p className="text-text-muted text-sm">We've selected 5 options for you.</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="hidden md:flex p-2 px-4 text-text-secondary hover:text-accent bg-surface hover:bg-surface border border-border rounded-xl transition-all items-center gap-2 cursor-pointer font-bold"
        >
          <FiRefreshCw size={18} />
          Spin Again
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
        {selectedMovies.map((movie) => (
          <Link
            key={movie.id}
            to={`/movies/${movie.id}`}
            className="group bg-primary/50 border border-border/50 rounded-2xl overflow-hidden hover:border-accent/40 hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
          >
            <div className="relative aspect-2/3 overflow-hidden shrink-0">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-surface flex items-center justify-center text-text-muted text-sm text-center p-2">
                  No Poster
                </div>
              )}
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="p-3 md:p-4 flex flex-col grow justify-between">
              <h3 className="font-display font-bold text-text-primary text-sm line-clamp-2 leading-tight mb-2 group-hover:text-accent transition-colors">
                {movie.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-text-muted mt-auto">
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
      
      <button
        onClick={onReset}
        className="mt-8 md:hidden w-full p-3 text-text-secondary hover:text-accent bg-surface hover:bg-surface border border-border rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
      >
        <FiRefreshCw size={18} />
        Spin Again
      </button>
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
    <div className="flex flex-col items-center max-w-5xl mx-auto w-full">
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
            <div className="relative w-[320px] h-[320px] md:w-[500px] md:h-[500px] my-8 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              {/* Pointer */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  {/* Pointing down triangle */}
                  <path d="M5 5 L35 5 L20 25 Z" fill="#926B22" />
                  <path d="M8 7 L32 7 L20 23 Z" fill="#D4A853" />
                </svg>
              </div>

              {/* Wheel Container */}
              <motion.div
                className="w-full h-full rounded-full overflow-hidden bg-black relative shadow-[inset_0_0_10px_rgba(0,0,0,1),0_0_0_8px_#111,0_0_0_10px_#555]"
                animate={{ rotate: rotation }}
                transition={{ type: 'tween', duration: 4, ease: [0.1, 0.9, 0.2, 1] }} 
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    {/* Metallic Gold Gradient for segments */}
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E2C974" />
                      <stop offset="50%" stopColor="#C4A45A" />
                      <stop offset="100%" stopColor="#8A6E35" />
                    </linearGradient>
                    
                    {/* Black/Charcoal Gradient for segments */}
                    <linearGradient id="blackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2A2A2A" />
                      <stop offset="50%" stopColor="#111111" />
                      <stop offset="100%" stopColor="#000000" />
                    </linearGradient>

                    {/* Glass Overlay over the entire wheel */}
                    <linearGradient id="glassOverlay" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="white" stopOpacity="0.05" />
                      <stop offset="50.1%" stopColor="black" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="black" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>

                  {GENRES.map((genre, i) => {
                    const isGold = i % 2 !== 0; // Alternating
                    const bgColor = isGold ? 'url(#goldGradient)' : 'url(#blackGradient)';
                    return (
                      <g key={genre.id}>
                        <path
                          d={getSegmentPath(i, GENRES.length)}
                          fill={bgColor}
                        />
                        <g transform={`rotate(${i * (360 / GENRES.length) + (360 / GENRES.length) / 2}, 50, 50)`}>
                           {/* Rotate text radially, reading from center to edge */}
                           <text
                             x="50"
                             y="27"
                             fill={isGold ? '#111' : '#E2C974'}
                             fontSize="6"
                             fontWeight="bold"
                             textAnchor="middle"
                             className="font-branding tracking-widest"
                             transform="rotate(-90, 50, 27)"
                           >
                             {genre.name}
                           </text>
                        </g>
                      </g>
                    );
                  })}
                  
                  {/* Glossy Overlay */}
                  <circle cx="50" cy="50" r="50" fill="url(#glassOverlay)" pointerEvents="none" />
                </svg>
                
                {/* Center Hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] h-[22%] rounded-full shadow-[0_0_15px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden">
                   <div className="w-full h-full" style={{ background: 'radial-gradient(circle, #F5DB8B 0%, #D4A853 40%, #926B22 80%, #4A340C 100%)' }}>
                      {/* Fake conical gradient for metallic effect over the hub */}
                      <div className="w-full h-full opacity-50" style={{ background: 'conic-gradient(transparent 0deg, rgba(255,255,255,0.8) 45deg, transparent 90deg, rgba(255,255,255,0.8) 135deg, transparent 180deg, rgba(255,255,255,0.8) 225deg, transparent 270deg, rgba(255,255,255,0.8) 315deg, transparent 360deg)' }} />
                   </div>
                </div>
              </motion.div>
            </div>

            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className={`btn-primary text-lg px-10 py-4 rounded-full flex items-center gap-3 w-content disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 mt-4 ${
                !isSpinning && 'cta-pulse hover:scale-105 shadow-[0_0_30px_rgba(212,168,83,0.3)] cursor-pointer'
              }`}
            >
              <FiPlay className="fill-current" />
              {isSpinning ? 'Good Luck...' : 'Spin the Wheel!'}
            </button>
            <p className="mt-4 text-text-muted text-sm text-center max-w-sm">
              Click to spin the wheel and get a selection of 5 random cinematic masterworks.
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
