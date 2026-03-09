import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { FiPlay, FiBookmark, FiStar } from 'react-icons/fi';
import { useGetTrendingQuery } from '../../features/movies/movieApi';
import HeroSkeleton from '../skeletons/HeroSkeleton';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroSlider = () => {
  const { isAuthenticated } = useSelector((state) => state.auth || {});
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
    <div className="relative left-1/2 -translate-x-1/2 w-screen max-w-none h-[65vh] sm:h-[70vh] md:h-[85vh]">
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
          const mediaRoute = item.media_type === 'tv' ? 'tv' : 'movies';
          const primaryCta = isAuthenticated ? `/${mediaRoute}/${item.id}` : '/register';
          const secondaryCta = isAuthenticated ? '/watchlist' : '/login';
          const overview =
            item.overview?.length > 200
              ? item.overview.substring(0, 200) + '...'
              : item.overview;

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

                {/* Readability overlays */}
                <div className="hero-overlay hero-overlay-v absolute inset-0" />
                <div className="hero-overlay hero-overlay-h absolute inset-0" />
                <div className="hero-overlay hero-overlay-bottom absolute bottom-0 left-0 right-0 h-32" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end container-custom pb-20 sm:pb-24 md:pb-32">
                  <div className="max-w-2xl">
                    {/* Media type badge */}
                    <span className="inline-block mb-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-accent border border-accent/40 bg-black/25 backdrop-blur-sm px-2.5 py-1 rounded">
                      {item.media_type === 'tv' ? 'TV Series' : 'Movie'}
                    </span>

                    {/* Title */}
                    <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-['Melodrama'] font-bold text-white leading-[1.1] mb-4 tracking-tight">
                      {title}
                    </h1>

                    {/* Metadata */}
                    <div className="hero-meta flex flex-wrap items-center gap-3 text-sm text-white/85 mb-5">
                      {rating && (
                        <span className="flex items-center gap-1 text-warning font-mono font-semibold bg-warning/20 px-2 py-0.5 rounded border border-warning/40">
                          <FiStar size={12} className="fill-warning" />
                          {rating}
                        </span>
                      )}
                      {year && <span className="text-white/85">{year}</span>}
                    </div>

                    {/* Overview */}
                    <p className="hero-overview font-['Zodiak'] text-white/80 text-sm md:text-base leading-relaxed mb-8 max-w-lg line-clamp-3">
                      {overview || 'Description not available'}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        to={primaryCta}
                        className="btn-primary cta-pulse flex items-center gap-2 px-7 py-3 text-sm md:text-base"
                      >
                        <FiPlay size={16} className="fill-primary" />
                        <span className="font-semibold">{isAuthenticated ? 'Watch Now' : 'Get Started'}</span>
                      </Link>
                      <Link to={secondaryCta} className="flex items-center gap-2 px-5 py-3 bg-black/25 hover:bg-black/35 text-white text-sm md:text-base font-medium rounded-md border border-white/20 hover:border-white/35 transition-all backdrop-blur-sm active:scale-95">
                        <FiBookmark size={16} />
                        <span>{isAuthenticated ? 'Watchlist' : 'Sign In'}</span>
                      </Link>
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
        .hero-overlay-v {
          background: linear-gradient(
            to top,
            rgba(5, 10, 18, 0.88) 0%,
            rgba(5, 10, 18, 0.5) 48%,
            rgba(5, 10, 18, 0) 100%
          );
        }
        .hero-overlay-h {
          background: linear-gradient(
            to right,
            rgba(5, 10, 18, 0.82) 0%,
            rgba(5, 10, 18, 0.28) 50%,
            rgba(5, 10, 18, 0) 100%
          );
        }
        .hero-overlay-bottom {
          background: linear-gradient(
            to top,
            rgba(5, 10, 18, 0.85) 0%,
            rgba(5, 10, 18, 0) 100%
          );
        }

        [data-theme="light"] .hero-overlay-v {
          background: linear-gradient(
            to top,
            rgba(10, 16, 30, 0.76) 0%,
            rgba(10, 16, 30, 0.38) 50%,
            rgba(10, 16, 30, 0.04) 100%
          );
        }
        [data-theme="light"] .hero-overlay-h {
          background: linear-gradient(
            to right,
            rgba(10, 16, 30, 0.7) 0%,
            rgba(10, 16, 30, 0.22) 52%,
            rgba(10, 16, 30, 0) 100%
          );
        }
        [data-theme="light"] .hero-overlay-bottom {
          background: linear-gradient(
            to top,
            rgba(10, 16, 30, 0.58) 0%,
            rgba(10, 16, 30, 0) 100%
          );
        }

        .hero-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.38);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .hero-dot:hover {
          background: rgba(255, 255, 255, 0.7);
        }
        [data-theme="light"] .hero-dot {
          background: rgba(15, 23, 42, 0.28);
        }
        [data-theme="light"] .hero-dot:hover {
          background: rgba(15, 23, 42, 0.5);
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
