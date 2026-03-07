import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiStar, FiFilm, FiTv } from 'react-icons/fi';

const TMDB_IMG = 'https://image.tmdb.org/t/p';

const MovieCard = ({ item, mediaType: propMediaType }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const title = item.title || item.name || 'Untitled';
  const year = (item.release_date || item.first_air_date)?.substring(0, 4);
  const rating = item.vote_average?.toFixed(1);
  const type = propMediaType || item.media_type || 'movie';
  const linkPath = type === 'tv' ? `/tv/${item.id}` : `/movies/${item.id}`;
  const posterUrl = item.poster_path
    ? `${TMDB_IMG}/w300${item.poster_path}`
    : null;

  // Rating color logic
  const getRatingColor = (val) => {
    if (val >= 7) return 'text-success';
    if (val >= 5) return 'text-warning';
    return 'text-danger';
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    // TODO: dispatch RTK mutation for favorites
  };

  return (
    <Link
      to={linkPath}
      className="group relative flex flex-col w-full rounded-lg overflow-hidden cursor-pointer focus-visible:outline-accent"
      id={`movie-card-${item.id}`}
    >
      {/* Poster Container */}
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-elevated shadow-card transition-all duration-300 group-hover:scale-[1.05] group-hover:shadow-elevated group-hover:z-10">
        {/* Blur placeholder */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-elevated animate-pulse rounded-lg" />
        )}

        {/* Poster Image */}
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface text-text-muted">
            <FiFilm size={40} />
          </div>
        )}

        {/* Heart icon overlay (top-right) */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 z-20
            ${isFavorited
              ? 'bg-danger/90 text-white scale-110'
              : 'bg-black/40 text-white/80 opacity-0 group-hover:opacity-100 hover:bg-danger/80 hover:text-white'
            }`}
          aria-label="Toggle favorite"
        >
          <FiHeart size={14} className={isFavorited ? 'fill-white' : ''} />
        </button>

        {/* Slide-up detail panel on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <h4 className="text-sm font-semibold text-white truncate mb-1">{title}</h4>
          <div className="flex items-center gap-2 text-xs">
            {/* Rating */}
            {rating && (
              <span className={`flex items-center gap-0.5 font-mono font-semibold ${getRatingColor(item.vote_average)}`}>
                <FiStar size={10} className="fill-current" />
                {rating}
              </span>
            )}
            {year && <span className="text-white/60">• {year}</span>}
            <span className="text-white/40 ml-auto">
              {type === 'tv' ? <FiTv size={12} /> : <FiFilm size={12} />}
            </span>
          </div>
        </div>
      </div>

      {/* Title & Year below card (visible always, for mobile) */}
      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-medium text-text-primary truncate leading-tight">{title}</h3>
        <p className="text-xs text-text-muted mt-0.5">{year || 'TBA'}</p>
      </div>
    </Link>
  );
};

export default React.memo(MovieCard);
