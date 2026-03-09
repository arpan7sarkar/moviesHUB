import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBookmark, FiSearch, FiTv } from 'react-icons/fi';
import { useGetWatchlistQuery } from '../features/user/userApi';
import MovieCard from '../components/cards/MovieCard';
import SectionTitle from '../components/ui/SectionTitle';
import { Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';

const Watchlist = () => {
  const { data: watchlist, isLoading, isError } = useGetWatchlistQuery();

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-18 md:pt-20 pb-20 container-custom flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </PageTransition>
    );
  }

  if (isError) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-18 md:pt-20 pb-20 container-custom text-center">
          <p className="text-danger">Failed to load watchlist. Please try again later.</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-18 md:pt-20 pb-20 container-custom">
        <SectionTitle 
          title="My Watchlist" 
          subtitle="Movies and shows you've saved for later"
          icon={<FiBookmark className="text-accent" />}
        />

        {watchlist?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-10">
            <AnimatePresence mode="popLayout">
              {watchlist.map((item) => (
                <motion.div
                  key={item.tmdbId}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                >
                  <MovieCard 
                    item={{
                      ...item,
                      id: item.tmdbId,
                      poster_path: item.posterPath,
                      release_date: item.releaseDate,
                      vote_average: item.voteAverage,
                      media_type: item.mediaType
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
              <FiBookmark size={40} className="text-text-muted" />
            </div>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-2">Your Watchlist is Empty</h2>
            <p className="text-text-muted max-w-md mb-8">
              Found something interesting? Add it to your watchlist so you don't forget to watch it later.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/tv" className="btn-primary py-3 px-8 rounded-xl font-bold flex items-center gap-2">
                <FiTv /> Browse TV Shows
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

export default Watchlist;
