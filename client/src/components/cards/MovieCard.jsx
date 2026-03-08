import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiStar, FiFilm, FiTv, FiBookmark } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import {
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useGetWatchlistQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
} from '../../features/user/userApi';
import { resolvePoster, handlePosterError, getBlurBackground } from '../../utils/mediaFallbacks';

const MovieCard = ({ item, mediaType: propMediaType }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data: favorites } = useGetFavoritesQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: watchlist } = useGetWatchlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [addFavorite] = useAddToFavoritesMutation();
  const [removeFavorite] = useRemoveFromFavoritesMutation();
  const [addWatchlist] = useAddToWatchlistMutation();
  const [removeWatchlist] = useRemoveFromWatchlistMutation();

  const tmdbId = item.id || item.tmdbId;
  const isFavorited = favorites?.some((fav) => Number(fav.tmdbId) === Number(tmdbId));
  const isInWatchlist = watchlist?.some((w) => Number(w.tmdbId) === Number(tmdbId));

  const title = item.title || item.name || 'Untitled';
  const year = (item.release_date || item.first_air_date)?.substring(0, 4);
  const rating = item.vote_average?.toFixed(1);
  const numericRating = Number(item.vote_average || 0);
  const type = propMediaType || item.media_type || 'movie';
  const linkPath = type === 'tv' ? `/tv/${tmdbId}` : `/movies/${tmdbId}`;

  const pPath = item.poster_path || item.posterPath;
  const posterUrl = resolvePoster(pPath, 'w300');

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorited) {
        await removeFavorite(tmdbId).unwrap();
      } else {
        await addFavorite({
          tmdbId,
          title,
          posterPath: pPath,
          mediaType: type,
          releaseDate: item.release_date || item.first_air_date,
          voteAverage: item.vote_average,
        }).unwrap();
      }
    } catch (err) {
      console.error('Favorite action failed:', err);
    }
  };

  const handleWatchlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isInWatchlist) {
        await removeWatchlist(tmdbId).unwrap();
      } else {
        await addWatchlist({
          tmdbId,
          title,
          posterPath: pPath,
          mediaType: type,
          releaseDate: item.release_date || item.first_air_date,
          voteAverage: item.vote_average,
        }).unwrap();
      }
    } catch (err) {
      console.error('Watchlist action failed:', err);
    }
  };

  const getRatingColor = (value) => {
    if (value >= 7) return 'text-success';
    if (value >= 5) return 'text-warning';
    return 'text-danger';
  };

  return (
    <Link
      to={linkPath}
      className="group relative flex w-full flex-col cursor-pointer focus-visible:outline-accent"
      id={`movie-card-${tmdbId}`}
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-2xl border border-border/70 bg-elevated shadow-[0_14px_40px_rgba(0,0,0,0.28)] transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-accent/45 group-hover:shadow-[0_24px_56px_rgba(0,0,0,0.45)]">
        {!imgLoaded && (
          <div
            className="absolute inset-0 rounded-2xl bg-elevated"
            style={getBlurBackground('thumb')}
          />
        )}

        <img
          src={posterUrl}
          alt={title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={handlePosterError}
          className={`h-full w-full object-cover transition-all duration-700 ${
            imgLoaded ? 'scale-100 opacity-100 blur-0 group-hover:scale-110' : 'scale-105 opacity-0 blur-xl'
          }`}
          style={getBlurBackground('thumb')}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,168,83,0.26),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {rating && (
          <div className="absolute left-3 top-3 z-20">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${getRatingColor(
                numericRating
              )}`}
            >
              <FiStar size={11} className="fill-current" />
              {rating}
            </span>
          </div>
        )}

        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
          <button
            onClick={handleFavoriteClick}
            className={`rounded-full border border-white/20 p-2 backdrop-blur-md transition-all duration-200 ${
              isFavorited
                ? 'scale-110 bg-danger text-white shadow-[0_8px_22px_rgba(239,68,68,0.5)]'
                : 'bg-black/45 text-white/90 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-danger/85 hover:text-white'
            }`}
            aria-label="Toggle favorite"
          >
            <FiHeart size={14} className={isFavorited ? 'fill-white' : ''} />
          </button>

          <button
            onClick={handleWatchlistClick}
            className={`rounded-full border border-white/20 p-2 backdrop-blur-md transition-all duration-200 ${
              isInWatchlist
                ? 'scale-110 bg-accent text-primary shadow-[0_8px_22px_rgba(212,168,83,0.45)]'
                : 'bg-black/45 text-white/90 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-accent/85 hover:text-primary'
            }`}
            aria-label="Toggle watchlist"
          >
            <FiBookmark size={14} className={isInWatchlist ? 'fill-current' : ''} />
          </button>
        </div>

      </div>

      <div className="mt-3 px-1 text-left">
        <h3 className="truncate text-sm font-serif font-bold leading-tight text-text-primary transition-colors duration-200 group-hover:text-accent">
          {title}
        </h3>
        <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-text-muted">
          {type === 'tv' ? 'Series' : 'Feature'} | {year || 'TBA'}
        </p>
      </div>
    </Link>
  );
};

export default React.memo(MovieCard);
