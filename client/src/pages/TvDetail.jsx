import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlay, FiHeart, FiBookmark, FiStar, FiClock, FiCalendar, FiTv, FiLayers,
  FiChevronDown, FiImage,
} from 'react-icons/fi';
import {
  useGetTvDetailsQuery,
  useGetVideosQuery,
  useGetCreditsQuery,
  useGetRecommendationsQuery,
  useGetSimilarQuery,
  useGetTvSeasonDetailsQuery,
} from '../features/movies/movieApi';
import PageTransition from '../components/layout/PageTransition';
import DetailSkeleton from '../components/skeletons/DetailSkeleton';
import PersonCard from '../components/cards/PersonCard';
import ContentRow from '../components/media/ContentRow';
import GenreRecommendationRow from '../components/media/GenreRecommendationRow';
import TrailerModal from '../components/media/TrailerModal';
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
import { resolvePoster, handlePosterError, getBlurBackground } from '../utils/mediaFallbacks';

const TMDB_IMG = 'https://image.tmdb.org/t/p';

/* ─── Custom Season Dropdown ──────────────────────────────────────── */
const SeasonSelector = ({ seasons, selectedSeason, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = seasons.find((s) => s.season_number === selectedSeason);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-5 py-3 rounded-xl bg-elevated border border-border/60 text-text-primary font-semibold text-sm hover:border-accent transition-all min-w-[200px] justify-between cursor-pointer"
      >
        <span>{selected?.name || `Season ${selectedSeason}`}</span>
        <FiChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-full max-h-64 overflow-y-auto bg-elevated border border-border/60 rounded-xl shadow-elevated z-50 no-scrollbar"
          >
            {seasons
              .filter((s) => s.season_number > 0)
              .map((season) => (
                <li key={season.id}>
                  <button
                    onClick={() => { onSelect(season.season_number); setIsOpen(false); }}
                    className={`w-full text-left px-5 py-3 text-sm transition-colors cursor-pointer flex items-center justify-between
                      ${season.season_number === selectedSeason
                        ? 'bg-accent/10 text-accent font-bold'
                        : 'text-text-primary hover:bg-white/5'
                      }`}
                  >
                    <span>{season.name}</span>
                    <span className="text-text-muted text-xs">{season.episode_count} eps</span>
                  </button>
                </li>
              ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Episode Card ────────────────────────────────────────────────── */
const EpisodeCard = ({ episode, index }) => {
  const airDate = episode.air_date
    ? new Date(episode.air_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="flex gap-4 md:gap-6 p-3 md:p-4 rounded-xl hover:bg-white/[0.03] transition-colors group"
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-36 md:w-52 aspect-video rounded-lg overflow-hidden bg-elevated border border-border/20 relative">
        {episode.still_path ? (
          <img
            src={`${TMDB_IMG}/w300${episode.still_path}`}
            alt={episode.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <FiImage size={24} />
          </div>
        )}
        {/* Episode number overlay */}
        <div className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
          E{episode.episode_number}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-1">
        <h4 className="text-sm md:text-base font-semibold text-text-primary mb-1 truncate group-hover:text-accent transition-colors">
          {episode.episode_number}. {episode.name}
        </h4>
        <div className="flex items-center gap-3 text-xs text-text-muted mb-2 flex-wrap">
          {airDate && (
            <span className="flex items-center gap-1">
              <FiCalendar size={11} /> {airDate}
            </span>
          )}
          {episode.runtime && (
            <span className="flex items-center gap-1">
              <FiClock size={11} /> {episode.runtime}m
            </span>
          )}
          {episode.vote_average > 0 && (
            <span className="flex items-center gap-1 text-accent">
              <FiStar size={11} className="fill-current" /> {episode.vote_average.toFixed(1)}
            </span>
          )}
        </div>
        <p className="text-text-muted text-xs md:text-sm leading-relaxed line-clamp-2">
          {episode.overview || 'Description not available'}
        </p>
      </div>
    </motion.div>
  );
};

/* ─── Main TvDetail Component ─────────────────────────────────────── */
const TvDetail = () => {
  const { id } = useParams();
  const [showTrailer, setShowTrailer] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [selectedSeason, setSelectedSeason] = useState(1);

  // Queries
  const { data: tv, isLoading, isError } = useGetTvDetailsQuery(id);
  const { data: videosData } = useGetVideosQuery(
    { mediaType: 'tv', id },
    { skip: !id }
  );
  const { data: creditsData } = useGetCreditsQuery(
    { mediaType: 'tv', id },
    { skip: !id }
  );
  const {
    data: recommendationsData,
    isLoading: isRecommendationsLoading,
    isError: isRecommendationsError,
  } = useGetRecommendationsQuery({ mediaType: 'tv', id }, { skip: !id });
  const { data: similarData, isLoading: isSimilarLoading, isError: isSimilarError } =
    useGetSimilarQuery({ mediaType: 'tv', id }, { skip: !id });
  const { data: seasonData, isFetching: isSeasonFetching } = useGetTvSeasonDetailsQuery(
    { tvId: id, seasonNumber: selectedSeason },
    { skip: !id }
  );

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

  useEffect(() => {
    if (isAuthenticated && tv) {
      addToHistory({
        tmdbId: tv.id,
        title: tv.name || tv.title,
        posterPath: tv.poster_path,
        mediaType: 'tv',
        releaseDate: tv.first_air_date,
        voteAverage: tv.vote_average
      });
    }
  }, [isAuthenticated, tv, addToHistory]);

  useEffect(() => {
    setPosterLoaded(false);
  }, [id]);

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) return;
    try {
      if (isFavorited) await removeFavorite(id).unwrap();
      else {
        await addFavorite({
          tmdbId: tv.id,
          title: tv.name || tv.title,
          posterPath: tv.poster_path,
          mediaType: 'tv',
          releaseDate: tv.first_air_date,
          voteAverage: tv.vote_average
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
          tmdbId: tv.id,
          title: tv.name || tv.title,
          posterPath: tv.poster_path,
          mediaType: 'tv',
          releaseDate: tv.first_air_date,
          voteAverage: tv.vote_average
        }).unwrap();
      }
    } catch (err) { console.error(err); }
  };

  const cast = creditsData?.cast?.slice(0, 20) || [];
  const creators = tv?.created_by || [];
  const seasons = tv?.seasons || [];

  if (isLoading) {
    return (
      <PageTransition>
        <DetailSkeleton />
      </PageTransition>
    );
  }

  if (isError || !tv) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-primary flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-display text-text-primary mb-4">TV Show not found</h1>
            <Link to="/" className="btn-primary px-6 py-2">Go Home</Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const title = tv.name;
  const year = tv.first_air_date?.substring(0, 4);
  const rating = tv.vote_average?.toFixed(1);
  const runtime = tv.episode_run_time?.[0];
  const runtimeFormatted = runtime ? `${runtime}m` : null;

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
          {tv.backdrop_path && (
            <motion.img
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              src={`${TMDB_IMG}/original${tv.backdrop_path}`}
              alt=""
              className="w-full h-full object-cover object-[center_20%] opacity-40 md:opacity-100"
              loading="lazy"
            />
          )}
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
                <img
                  src={resolvePoster(tv.poster_path, 'w780')}
                  alt={title}
                  loading="lazy"
                  onLoad={() => setPosterLoaded(true)}
                  onError={handlePosterError}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    posterLoaded ? 'blur-0 scale-100 opacity-100' : 'blur-xl scale-[1.03] opacity-75'
                  }`}
                  style={getBlurBackground('detail')}
                />
              </div>
            </motion.div>

            {/* RIGHT: Details */}
            <motion.div
              className="flex-1 mt-2 md:mt-16 text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-text-primary leading-tight mb-3 tracking-tight">
                {title}
                {year && <span className="text-text-muted font-normal text-2xl md:text-3xl ml-3">({year})</span>}
              </h1>

              {tv.tagline && (
                <p className="text-text-muted italic text-base md:text-lg mb-5">"{tv.tagline}"</p>
              )}

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start mb-10">
                {rating && (
                  <span className={`inline-flex items-center gap-1.5 text-xs md:text-sm font-mono font-bold px-3.5 py-2 rounded-xl border shadow-lg ${getRatingColor(tv.vote_average)}`}>
                    <FiStar size={15} className="fill-current" />
                    {rating}
                  </span>
                )}
                {year && (
                  <span className="flex items-center gap-2 text-sm text-text-primary font-semibold">
                    <FiCalendar size={15} className="text-accent" /> {year}
                  </span>
                )}
                {runtimeFormatted && (
                  <span className="flex items-center gap-2 text-sm text-text-primary font-semibold">
                    <FiClock size={15} className="text-accent" /> {runtimeFormatted}
                  </span>
                )}
                {tv.status && (
                  <span className="text-[11px] md:text-xs px-3 py-1 rounded-full border border-accent/30 text-accent bg-accent/10 font-bold uppercase tracking-wider">
                    {tv.status}
                  </span>
                )}
                <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
                  {tv.genres?.map((genre) => (
                    <span key={genre.id} className="text-[11px] md:text-xs px-4 py-1.5 rounded-full border border-border/80 text-text-primary bg-surface/40 backdrop-blur-md hover:border-accent hover:text-accent hover:bg-surface/60 transition-all cursor-default font-medium">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Creators */}
              {creators.length > 0 && (
                <div className="text-base md:text-lg text-text-secondary mb-8">
                  <span className="text-text-muted font-normal">Created by</span>{' '}
                  {creators.map((creator, index) => (
                    <React.Fragment key={creator.id}>
                      <Link to={`/person/${creator.id}`} className="text-accent hover:text-accent-hover font-bold transition-colors underline-offset-4 hover:underline">
                        {creator.name}
                      </Link>
                      {index < creators.length - 1 ? ', ' : ''}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* Overview */}
              <div className="mb-12 max-w-4xl">
                <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-accent/80 mb-4">Overview</h3>
                <p className="text-text-primary text-lg md:text-xl leading-relaxed font-normal opacity-90">
                  {tv.overview || 'Description not available'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 justify-center md:justify-start mb-16">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTrailer(true)}
                  className="btn-primary cta-pulse flex items-center justify-center gap-3 px-10 py-4 text-base md:text-lg w-full sm:w-auto min-w-[200px] shadow-[0_8px_30px_rgba(196,160,82,0.3)]"
                >
                  <FiPlay size={20} className="fill-primary" />
                  <span className="font-black uppercase tracking-tight">Play Trailer</span>
                </motion.button>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleFavoriteClick}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border transition-all text-sm font-bold backdrop-blur-xl
                      ${isFavorited ? 'bg-danger/20 border-danger/60 text-danger shadow-[0_0_25px_rgba(239,68,68,0.3)]' : 'bg-white/5 border-border/80 text-text-primary hover:border-text-muted hover:bg-white/10 shadow-lg'}`}
                  >
                    <FiHeart size={20} className={isFavorited ? 'fill-danger' : ''} />
                    <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={handleWatchlistClick}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border transition-all text-sm font-bold backdrop-blur-xl
                      ${isWatchlisted ? 'bg-accent/20 border-accent/60 text-accent shadow-[0_0_25px_rgba(196,160,82,0.3)]' : 'bg-white/5 border-border/80 text-text-primary hover:border-text-muted hover:bg-white/10 shadow-lg'}`}
                  >
                    <FiBookmark size={20} className={isWatchlisted ? 'fill-accent' : ''} />
                    <span>{isWatchlisted ? 'In Watchlist' : 'Watchlist'}</span>
                  </motion.button>
                </div>
              </div>

              {/* Extra Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-t border-border/20">
                <div className="flex flex-col gap-2 group">
                  <span className="text-text-muted text-xs uppercase tracking-[0.2em] font-black group-hover:text-accent transition-colors flex items-center gap-2"><FiLayers size={14} /> Seasons</span>
                  <span className="text-text-primary font-mono text-xl font-bold">{tv.number_of_seasons} Seasons</span>
                </div>
                <div className="flex flex-col gap-2 group">
                  <span className="text-text-muted text-xs uppercase tracking-[0.2em] font-black group-hover:text-accent transition-colors flex items-center gap-2"><FiTv size={14} /> Episodes</span>
                  <span className="text-text-primary font-mono text-xl font-bold">{tv.number_of_episodes} Episodes</span>
                </div>
                {tv.spoken_languages?.length > 0 && (
                  <div className="flex flex-col gap-2 group">
                    <span className="text-text-muted text-xs uppercase tracking-[0.2em] font-black group-hover:text-accent transition-colors">Language</span>
                    <span className="text-text-primary font-bold text-lg">{tv.spoken_languages[0]?.english_name}</span>
                  </div>
                )}
                {tv.networks?.length > 0 && (
                  <div className="flex flex-col gap-2 group">
                    <span className="text-text-muted text-xs uppercase tracking-[0.2em] font-black group-hover:text-accent transition-colors">Network</span>
                    <span className="text-text-primary font-bold text-lg truncate" title={tv.networks[0]?.name}>
                      {tv.networks[0]?.name}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ═══════════ Seasons & Episodes Section ═══════════ */}
        {seasons.length > 0 && (
          <motion.section
            className="mt-24 md:mt-36"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="container-custom px-4 md:px-8">
              {/* Header with Season Selector */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-6">
                  <h2 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tighter uppercase italic">
                    Episodes
                  </h2>
                  <div className="h-[2px] flex-1 min-w-[60px] bg-gradient-to-r from-accent/40 via-border/20 to-transparent hidden md:block" />
                </div>
                <SeasonSelector
                  seasons={seasons}
                  selectedSeason={selectedSeason}
                  onSelect={setSelectedSeason}
                />
              </div>

              {/* Season Overview */}
              {seasonData && (
                <div className="mb-8 flex items-center gap-4">
                  <img
                    src={resolvePoster(seasonData.poster_path, 'w92')}
                    alt={seasonData.name}
                    loading="lazy"
                    onError={handlePosterError}
                    className="w-14 h-20 rounded-lg object-cover border border-border/20 flex-shrink-0"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">{seasonData.name}</h3>
                    <p className="text-text-muted text-sm">
                      {seasonData.episodes?.length || 0} episodes
                      {seasonData.air_date && ` · ${seasonData.air_date.substring(0, 4)}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Episode List */}
              <div className="space-y-2 rounded-2xl border border-border/10 bg-white/[0.01] p-2 md:p-4">
                {isSeasonFetching ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : seasonData?.episodes?.length > 0 ? (
                  seasonData.episodes.map((episode, i) => (
                    <EpisodeCard key={episode.id} episode={episode} index={i} />
                  ))
                ) : (
                  <div className="text-center py-16 text-text-muted">
                    <p className="text-lg">No episodes found for this season.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* Cast Section */}
        {cast.length > 0 && (
          <motion.section
            className="mt-24 md:mt-36"
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

        {/* Recommendation & Genre Rows */}
        <div className="mt-20 md:mt-32 space-y-16 md:space-y-24">
          <ContentRow title="Recommendations" items={recommendationsData?.results} isLoading={isRecommendationsLoading} isError={isRecommendationsError} mediaType="tv" />
          <ContentRow title="Similar Shows" items={similarData?.results} isLoading={isSimilarLoading} isError={isSimilarError} mediaType="tv" />
          {tv.genres?.slice(0, 3).map((genre) => (
            <GenreRecommendationRow key={genre.id} genre={genre} mediaType="tv" />
          ))}
        </div>

        {/* Trailer Modal */}
        <TrailerModal isOpen={showTrailer} onClose={() => setShowTrailer(false)} videoKey={trailer?.key} title={`${title} - Trailer`} />
      </main>
    </PageTransition>
  );
};

export default TvDetail;
