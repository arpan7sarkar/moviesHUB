import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiSearch, FiFilm } from 'react-icons/fi';
import { useGetFavoritesQuery } from '../features/user/userApi';
import MovieCard from '../components/cards/MovieCard';
import SectionTitle from '../components/ui/SectionTitle';
import { Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';

const Favorites = () => {
  const { data: favorites, isLoading, isError } = useGetFavoritesQuery();

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-[4.5rem] md:pt-20 pb-20 container-custom flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </PageTransition>
    );
  }

  if (isError) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-[4.5rem] md:pt-20 pb-20 container-custom text-center">
          <p className="text-danger">Failed to load favorites. Please try again later.</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-[4.5rem] md:pt-20 pb-20 container-custom">
        <SectionTitle 
          title="My Favorites" 
          subtitle="Your absolute cinematic preferences"
          icon={<FiHeart className="text-danger fill-danger" />}
        />

        {favorites?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-10">
            <AnimatePresence mode="popLayout">
              {favorites.map((fav) => (
                <motion.div
                  key={fav.tmdbId}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                >
                  <MovieCard 
                    item={{
                      ...fav,
                      id: fav.tmdbId, // Map tmdbId back to id for MovieCard
                      poster_path: fav.posterPath, // Resolve naming mismatch
                      release_date: fav.releaseDate,
                      vote_average: fav.voteAverage,
                      media_type: fav.mediaType
                    }} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-secondary border border-border flex items-center justify-center mb-6">
              <FiHeart size={40} className="text-text-muted" />
            </div>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-2">No Favorites Yet</h2>
            <p className="text-text-muted max-w-md mb-8">
              You haven't marked any movies or TV shows as favorites. 
              Start exploring and click the heart icon to save what you love.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/movies" className="btn-primary py-3 px-8 rounded-xl font-bold flex items-center gap-2">
                <FiFilm /> Browse Movies
              </Link>
              <Link to="/search" className="py-3 px-8 rounded-xl border border-border hover:bg-elevated text-text-primary font-bold transition-all flex items-center gap-2">
                <FiSearch /> Search Content
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default Favorites;
