import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { FiPlay, FiBookmark, FiStar } from 'react-icons/fi';
import { useGetTrendingQuery } from '../../features/movies/movieApi';
import HeroSkeleton from '../skeletons/HeroSkeleton';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroSlider = () => {
  const { data, isLoading, isError } = useGetTrendingQuery({
    mediaType: 'all',
    timeWindow: 'day',
  });

  if (isLoading) return <HeroSkeleton />;
  if (isError || !data?.results?.length) return null;

  const trendingItems = data.results
    .filter((item) => item.backdrop_path)
    .slice(0, 8);

  return (
    <div className="relative w-full h-[65vh] sm:h-[70vh] md:h-[85vh]">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          el: '.hero-pagination',
          bulletClass: 'hero-dot',
          bulletActiveClass: 'hero-dot-active',
        }}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        speed={800}
        className="w-full h-full"
      >
        {trendingItems.map((item) => {
          const title = item.title || item.name;
          const year = (item.release_date || item.first_air_date)?.substring(0, 4);
          const rating = item.vote_average?.toFixed(1);
          const overview =
            item.overview?.length > 200
              ? item.overview.substring(0, 200) + '...'
              : item.overview;
          const mediaRoute = item.media_type === 'tv' ? 'tv' : 'movies';

          return (
            <SwiperSlide key={item.id}>
              <div className="w-full h-full relative select-none">
                {/* Backdrop */}
                <div className="absolute inset-0">
                  <img
                    src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                    alt=""
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                    draggable="false"
                  />
                </div>

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end container-custom pb-20 sm:pb-24 md:pb-32">
                  <div className="max-w-2xl">
                    {/* Media type badge */}
                    <span className="inline-block mb-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-accent border border-accent/30 bg-accent/10 px-2.5 py-1 rounded">
                      {item.media_type === 'tv' ? 'TV Series' : 'Movie'}
                    </span>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-text-primary leading-[1.1] mb-4 tracking-tight">
                      {title}
                    </h1>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mb-5">
                      {rating && (
                        <span className="flex items-center gap-1 text-warning font-mono font-semibold bg-warning/10 px-2 py-0.5 rounded border border-warning/20">
                          <FiStar size={12} className="fill-warning" />
                          {rating}
                        </span>
                      )}
                      {year && <span className="text-text-secondary">{year}</span>}
                    </div>

                    {/* Overview */}
                    <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-8 max-w-lg line-clamp-3">
                      {overview || 'Description not available'}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        to={`/${mediaRoute}/${item.id}`}
                        className="btn-primary cta-pulse flex items-center gap-2 px-7 py-3 text-sm md:text-base"
                      >
                        <FiPlay size={16} className="fill-primary" />
                        <span className="font-semibold">Watch Now</span>
                      </Link>
                      <button className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-text-primary text-sm md:text-base font-medium rounded-md border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm active:scale-95">
                        <FiBookmark size={16} />
                        <span>Watchlist</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom Pagination Dots */}
      <div className="hero-pagination absolute bottom-6 sm:bottom-8 md:bottom-12 left-0 right-0 z-10 container-custom flex justify-start gap-1.5" />

      <style>{`
        .hero-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .hero-dot:hover {
          background: rgba(255, 255, 255, 0.6);
        }
        .hero-dot-active {
          width: 28px !important;
          background: var(--color-accent) !important;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;
