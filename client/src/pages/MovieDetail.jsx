import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlay, FiHeart, FiBookmark, FiStar, FiClock, FiCalendar, FiExternalLink,
} from 'react-icons/fi';
import {
  useGetMovieDetailsQuery,
  useGetVideosQuery,
  useGetCreditsQuery,
  useGetRecommendationsQuery,
  useGetSimilarQuery,
} from '../features/movies/movieApi';
import { useSelector } from 'react-redux';
import {
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useGetWatchlistQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
  useAddToHistoryMutation,
} from '../features/user/userApi';
import PageTransition from '../components/layout/PageTransition';
import DetailSkeleton from '../components/skeletons/DetailSkeleton';
import PersonCard from '../components/cards/PersonCard';
import ContentRow from '../components/media/ContentRow';
import GenreRecommendationRow from '../components/media/GenreRecommendationRow';
import TrailerModal from '../components/media/TrailerModal';

const TMDB_IMG = 'https://image.tmdb.org/t/p';

const MovieDetail = () => {
  const { id } = useParams();
  const [showTrailer, setShowTrailer] = useState(false);
  const { isAuthenticated } = useSelector(state => state.auth);

  // Queries
  const { data: movie, isLoading, isError } = useGetMovieDetailsQuery(id);
  const { data: videosData } = useGetVideosQuery(
    { mediaType: 'movie', id },
    { skip: !id }
  );
  const { data: creditsData } = useGetCreditsQuery(
    { mediaType: 'movie', id },
    { skip: !id }
  );
  const {
    data: recommendationsData,
    isLoading: isRecommendationsLoading,
    isError: isRecommendationsError,
  } = useGetRecommendationsQuery({ mediaType: 'movie', id }, { skip: !id });
  const { data: similarData, isLoading: isSimilarLoading, isError: isSimilarError } =
    useGetSimilarQuery({ mediaType: 'movie', id }, { skip: !id });

  // Derived data
  const trailer = useMemo(() => {
    if (!videosData?.results) return null;
    return (
      videosData.results.find(
        (v) => v.type === 'Trailer' && v.site === 'YouTube'
      ) ||
      videosData.results.find((v) => v.site === 'YouTube') ||
      null
    );
  }, [videosData]);

  // User features queries
  const { data: favorites } = useGetFavoritesQuery(undefined, { skip: !isAuthenticated });
  const { data: watchlist } = useGetWatchlistQuery(undefined, { skip: !isAuthenticated });
  
  const [addFavorite] = useAddToFavoritesMutation();
  const [removeFavorite] = useRemoveFromFavoritesMutation();
  const [addWatchlist] = useAddToWatchlistMutation();
  const [removeWatchlist] = useRemoveFromWatchlistMutation();
  const [addToHistory] = useAddToHistoryMutation();

  const isFavorited = favorites?.some(fav => Number(fav.tmdbId) === Number(id));
  const isWatchlisted = watchlist?.some(w => Number(w.tmdbId) === Number(id));

  React.useEffect(() => {
    if (isAuthenticated && movie) {
      addToHistory({
        tmdbId: movie.id,
        title: movie.title || movie.name,
        posterPath: movie.poster_path,
        mediaType: 'movie',
        releaseDate: movie.release_date || movie.first_air_date,
        voteAverage: movie.vote_average
      });
    }
  }, [isAuthenticated, movie, addToHistory]);

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) return;
    try {
      if (isFavorited) await removeFavorite(id).unwrap();
      else {
        await addFavorite({
          tmdbId: movie.id,
          title: movie.title || movie.name,
          posterPath: movie.poster_path,
          mediaType: 'movie',
          releaseDate: movie.release_date || movie.first_air_date,
          voteAverage: movie.vote_average
        }).unwrap();
      }
    } catch (err) { console.error(err); }
  };

  const handleWatchlistClick = async () => {
    if (!isAuthenticated) return;
    try {
      if (isWatchlisted) await removeWatchlist(id).unwrap();
      else {
        await addWatchlist({
          tmdbId: movie.id,
          title: movie.title || movie.name,
          posterPath: movie.poster_path,
          mediaType: 'movie',
          releaseDate: movie.release_date || movie.first_air_date,
          voteAverage: movie.vote_average
        }).unwrap();
      }
    } catch (err) { console.error(err); }
  };

  const cast = creditsData?.cast?.slice(0, 20) || [];
  const director = creditsData?.crew?.find((c) => c.job === 'Director');

  if (isLoading) {
    return (
      <PageTransition>
        <DetailSkeleton />
      </PageTransition>
    );
  }

  if (isError || !movie) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-primary flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-display text-text-primary mb-4">Movie not found</h1>
            <Link to="/" className="btn-primary px-6 py-2">Go Home</Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const title = movie.title || movie.name;
  const year = (movie.release_date || movie.first_air_date)?.substring(0, 4);
  const rating = movie.vote_average?.toFixed(1);
  const runtime = movie.runtime;
  const runtimeFormatted = runtime
    ? `${Math.floor(runtime / 60)}h ${runtime % 60}m`
    : null;

  const getRatingColor = (val) => {
    if (val >= 7) return 'text-success bg-success/10 border-success/20';
    if (val >= 5) return 'text-warning bg-warning/10 border-warning/20';
    return 'text-danger bg-danger/10 border-danger/20';
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-primary pb-12">
        {/* Full-bleed Backdrop */}
        <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
          {movie.backdrop_path && (
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              src={`${TMDB_IMG}/original${movie.backdrop_path}`}
              alt=""
              className="w-full h-full object-cover object-[center_20%] opacity-40 md:opacity-100"
              loading="eager"
            />
          )}
          {/* Enhanced cinematic gradient overlays for maximum readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 md:via-primary/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 md:via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-primary via-primary/95 to-transparent" />
        </div>

        {/* Content Section */}
        <div className="container-custom relative -mt-48 md:-mt-80 z-10 px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 lg:gap-24">
            {/* LEFT: Poster */}
            <motion.div
              className="flex-shrink-0 mx-auto md:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-48 sm:w-56 md:w-72 aspect-[2/3] rounded-xl overflow-hidden shadow-elevated border border-border/30">
                {movie.poster_path ? (
                  <img
                    src={`${TMDB_IMG}/w500${movie.poster_path}`}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-elevated flex items-center justify-center text-text-muted text-6xl font-display">
                    {title?.charAt(0)}
                  </div>
                )}
              </div>
            </motion.div>

            {/* RIGHT: Details */}
            <motion.div
              className="flex-1 mt-2 md:mt-16 text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-text-primary leading-tight mb-3 tracking-tight">
                {title}
                {year && (
                  <span className="text-text-muted font-normal text-2xl md:text-3xl ml-3">
                    ({year})
                  </span>
                )}
              </h1>

              {/* Tagline */}
              {movie.tagline && (
                <p className="text-text-muted italic text-base md:text-lg mb-5">
                  "{movie.tagline}"
                </p>
              )}

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start mb-10">
                {/* Rating Badge */}
                {rating && (
                  <span className={`inline-flex items-center gap-1.5 text-xs md:text-sm font-mono font-bold px-3.5 py-2 rounded-xl border shadow-lg ${getRatingColor(movie.vote_average)}`}>
                    <FiStar size={15} className="fill-current" />
                    {rating}
                  </span>
                )}

                {/* Year */}
                {year && (
                  <span className="flex items-center gap-2 text-sm text-text-primary font-semibold">
                    <FiCalendar size={15} className="text-accent" />
                    {year}
                  </span>
                )}

                {/* Runtime */}
                {runtimeFormatted && (
                  <span className="flex items-center gap-2 text-sm text-text-primary font-semibold">
                    <FiClock size={15} className="text-accent" />
                    {runtimeFormatted}
                  </span>
                )}

                {/* Genres as Chips */}
                <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
                  {movie.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="text-[11px] md:text-xs px-4 py-1.5 rounded-full border border-border/80 text-text-primary bg-surface/40 backdrop-blur-md hover:border-accent hover:text-accent hover:bg-surface/60 transition-all cursor-default font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Director */}
              {director && (
                <p className="text-base md:text-lg text-text-secondary mb-8">
                  <span className="text-text-muted font-normal">Directed by</span>{' '}
                  <Link to={`/person/${director.id}`} className="text-accent hover:text-accent-hover font-bold transition-colors underline-offset-4 hover:underline">
                    {director.name}
                  </Link>
                </p>
              )}

              {/* Overview */}
              {movie.overview && (
                <div className="mb-12 max-w-4xl">
                  <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-accent/80 mb-4">
                    Overview
                  </h3>
                  <p className="text-text-primary text-lg md:text-xl leading-relaxed font-normal opacity-90 text-shadow-sm">
                    {movie.overview}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 justify-center md:justify-start mb-16">
                {/* Play Trailer */}
                {trailer && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowTrailer(true)}
                    className="btn-primary cta-pulse flex items-center justify-center gap-3 px-10 py-4 text-base md:text-lg w-full sm:w-auto min-w-[200px] shadow-[0_8px_30px_rgba(196,160,82,0.3)]"
                  >
                    <FiPlay size={20} className="fill-primary" />
                    <span className="font-black uppercase tracking-tight">Play Trailer</span>
                  </motion.button>
                )}

                {/* Action group */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
                  {/* Add to Favorites */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFavoriteClick}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border transition-all text-sm font-bold backdrop-blur-xl
                      ${isFavorited
                        ? 'bg-danger/20 border-danger/60 text-danger shadow-[0_0_25px_rgba(239,68,68,0.3)]'
                        : 'bg-white/5 border-border/80 text-text-primary hover:border-text-muted hover:bg-white/10 shadow-lg'
                      }`}
                  >
                    <FiHeart size={20} className={isFavorited ? 'fill-danger' : ''} />
                    <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
                  </motion.button>

                  {/* Add to Watchlist */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWatchlistClick}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border transition-all text-sm font-bold backdrop-blur-xl
                      ${isWatchlisted
                        ? 'bg-accent/20 border-accent/60 text-accent shadow-[0_0_25px_rgba(196,160,82,0.3)]'
                        : 'bg-white/5 border-border/80 text-text-primary hover:border-text-muted hover:bg-white/10 shadow-lg'
                      }`}
                  >
                    <FiBookmark size={20} className={isWatchlisted ? 'fill-accent' : ''} />
                    <span>{isWatchlisted ? 'In Watchlist' : 'Watchlist'}</span>
                  </motion.button>
                </div>
              </div>

              {/* Extra Info Grid - Nexura Style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-t border-border/20">
                {movie.budget > 0 && (
                  <div className="flex flex-col gap-2 group">
                    <span className="text-text-muted text-xs uppercase tracking-[0.2em] font-black group-hover:text-accent transition-colors">Budget</span>
                    <span className="text-text-primary font-mono text-xl font-bold">${movie.budget.toLocaleString()}</span>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div className="flex flex-col gap-2 group">
                    <span className="text-text-muted text-xs uppercase tracking-[0.2em] font-black group-hover:text-accent transition-colors">Revenue</span>
                    <span className="text-text-primary font-mono text-xl font-bold">${movie.revenue.toLocaleString()}</span>
                  </div>
                )}
                {movie.spoken_languages?.length > 0 && (
                  <div className="flex flex-col gap-2 group">
                    <span className="text-text-muted text-xs uppercase tracking-[0.2em] font-black group-hover:text-accent transition-colors">Language</span>
                    <span className="text-text-primary font-bold text-lg">{movie.spoken_languages[0]?.english_name}</span>
                  </div>
                )}
                {movie.production_companies?.length > 0 && (
                  <div className="flex flex-col gap-2 group">
                    <span className="text-text-muted text-xs uppercase tracking-[0.2em] font-black group-hover:text-accent transition-colors">Studio</span>
                    <span className="text-text-primary font-bold text-lg truncate" title={movie.production_companies[0]?.name}>
                      {movie.production_companies[0]?.name}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Cast Section */}
        {cast.length > 0 && (
          <motion.section
            className="mt-32 md:mt-48"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <div className="container-custom px-4 md:px-8">
              <div className="flex items-center gap-6 mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tighter uppercase italic">
                  Top <span className="text-accent">Cast</span>
                </h2>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-accent/40 via-border/20 to-transparent" />
              </div>
            </div>
            <div className="container-custom px-4 md:px-8 overflow-x-auto no-scrollbar">
              <div className="flex gap-8 md:gap-12 pb-10">
                {cast.map((person) => (
                  <PersonCard key={person.credit_id || person.id} person={person} />
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Dynamic Recommendation & Genre Rows - Nexura Inspired */}
        <div className="mt-20 md:mt-32 space-y-16 md:space-y-24">
          <ContentRow
            title="Recommendations"
            items={recommendationsData?.results}
            isLoading={isRecommendationsLoading}
            isError={isRecommendationsError}
            mediaType="movie"
          />

          <ContentRow
            title="Similar Movies"
            items={similarData?.results}
            isLoading={isSimilarLoading}
            isError={isSimilarError}
            mediaType="movie"
          />

          {/* Genre specific rows */}
          {movie.genres?.slice(0, 3).map((genre) => (
            <GenreRecommendationRow
              key={genre.id}
              genre={genre}
              mediaType="movie"
            />
          ))}
        </div>

        {/* Trailer Modal */}
        <TrailerModal
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          videoKey={trailer?.key}
          title={`${title} - Trailer`}
        />
      </main>
    </PageTransition>
  );
};

export default MovieDetail;
