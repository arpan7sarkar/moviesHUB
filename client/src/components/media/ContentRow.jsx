import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import MovieCard from '../cards/MovieCard';
import RowSkeleton from '../skeletons/RowSkeleton';

import 'swiper/css';
import 'swiper/css/navigation';

const ContentRow = ({ title, items, isLoading, isError, seeAllLink, mediaType }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (isLoading) return <RowSkeleton />;
  if (isError || !items?.length) return null;

  return (
    <section className="w-full py-6 md:py-10 relative group/row">
      {/* Section Header */}
      <div className="container-custom flex items-center justify-between mb-5 md:mb-6">
        <h2 className="text-xl md:text-2xl font-display font-semibold text-text-primary tracking-tight">
          {title}
        </h2>
        {seeAllLink && (
          <Link
            to={seeAllLink}
            className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors group/link"
          >
            See All
            <FiArrowRight className="transition-transform group-hover/link:translate-x-0.5" size={14} />
          </Link>
        )}
      </div>

      {/* Swiper Carousel */}
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={2.5}
          breakpoints={{
            480: { slidesPerView: 2.5, spaceBetween: 16 },
            640: { slidesPerView: 3.5, spaceBetween: 16 },
            768: { slidesPerView: 3.5, spaceBetween: 20 },
            1024: { slidesPerView: 5, spaceBetween: 20 },
            1280: { slidesPerView: 6, spaceBetween: 20 },
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          className="!px-5 md:!px-10 lg:!px-20"
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <MovieCard item={item} mediaType={mediaType} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows (hidden on mobile) */}
        <button
          ref={prevRef}
          className="hidden md:flex absolute left-1 lg:left-4 top-1/2 -translate-y-[60%] z-20 w-10 h-10 items-center justify-center rounded-full bg-primary/80 backdrop-blur-sm border border-border text-text-primary hover:bg-elevated hover:border-accent hover:text-accent transition-all shadow-elevated opacity-0 group-hover/row:opacity-100 cursor-pointer disabled:opacity-0"
          aria-label="Previous slide"
        >
          <FiChevronLeft size={20} />
        </button>
        <button
          ref={nextRef}
          className="hidden md:flex absolute right-1 lg:right-4 top-1/2 -translate-y-[60%] z-20 w-10 h-10 items-center justify-center rounded-full bg-primary/80 backdrop-blur-sm border border-border text-text-primary hover:bg-elevated hover:border-accent hover:text-accent transition-all shadow-elevated opacity-0 group-hover/row:opacity-100 cursor-pointer disabled:opacity-0"
          aria-label="Next slide"
        >
          <FiChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default React.memo(ContentRow);
