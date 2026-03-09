import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiStar, FiCalendar, FiActivity } from 'react-icons/fi';
import { useDiscoverQuery } from '../../features/movies/movieApi';
import { Link } from 'react-router-dom';

const MOODS = [
  { id: 'happy', title: 'Happy', emoji: '😂', description: 'Fun & light-hearted', genres: '35,16' }, // Comedy, Animation
  { id: 'sad', title: 'Sad', emoji: '😢', description: 'Emotional & deep', genres: '18' }, // Drama
  { id: 'excited', title: 'Excited', emoji: '🔥', description: 'Action-packed!', genres: '28,53' }, // Action, Thriller
  { id: 'scared', title: 'Scared', emoji: '😱', description: 'Thrilling & scary', genres: '27' }, // Horror
  { id: 'romantic', title: 'Romantic', emoji: '💕', description: 'Love stories', genres: '10749' }, // Romance
  { id: 'inspired', title: 'Inspired', emoji: '💪', description: 'Motivating true stories', genres: '99,36' }, // Documentary, History
  { id: 'relaxed', title: 'Relaxed', emoji: '😌', description: 'Easy & chill', genres: '10751,10402' }, // Family, Music
  { id: 'curious', title: 'Curious', emoji: '🤔', description: 'Mind-bending mysteries', genres: '9648,878' }, // Mystery, Sci-Fi
];

const MoodResults = ({ mood, onBack }) => {
  const { data, isLoading, isError } = useDiscoverQuery({
    mediaType: 'movie',
    with_genres: mood.genres,
    sort_by: 'popularity.desc',
    'vote_count.gte': 100,
    page: 1, // Get top results
  });

  const movies = data?.results?.slice(0, 8) || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
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
            <span>{mood.emoji}</span> {mood.title} Vibe
          </h2>
          <p className="text-text-muted text-sm">Our hand-picked {mood.title.toLowerCase()} list.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-text-muted">Curating movies for your mood...</p>
        </div>
      ) : isError || movies.length === 0 ? (
        <div className="text-center p-12">
          <p className="text-danger">Failed to fetch movies. Please try again.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {movies.map((movie) => (
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
                  <div className="w-full h-full bg-surface flex items-center justify-center text-text-muted">
                    No Poster
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

const MoodSelector = () => {
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <AnimatePresence mode="wait">
        {!selectedMood ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-3 flex items-center justify-center gap-3">
                <FiActivity className="text-4xl text-accent" /> What's the Vibe?
              </h1>
              <p className="text-text-secondary">Pick your current energy and we'll match it with a movie.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {MOODS.map((mood, index) => (
                <motion.button
                  key={mood.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedMood(mood)}
                  className="bg-surface/50 hover:bg-surface border border-border hover:border-accent/40 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 cursor-pointer overflow-hidden group hover:-translate-y-1 hover:shadow-glow"
                >
                  <div className="text-5xl mb-4 transform group-hover:scale-110 group-active:scale-95 transition-transform duration-300 drop-shadow-lg">
                    {mood.emoji}
                  </div>
                  <h3 className="text-lg font-display font-bold text-text-primary mb-1 group-hover:text-accent transition-colors">
                    {mood.title}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {mood.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <MoodResults
            key="results"
            mood={selectedMood}
            onBack={() => setSelectedMood(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodSelector;
