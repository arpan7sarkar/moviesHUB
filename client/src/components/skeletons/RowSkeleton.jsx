import MovieCardSkeleton from './MovieCardSkeleton';

const RowSkeleton = ({ items = 5 }) => {
  return (
    <div className="w-full py-6">
      <div className="h-6 bg-surface rounded w-48 mb-6 ml-3 md:ml-6 lg:ml-12 skeleton-shimmer"></div>
      <div className="flex gap-4 overflow-hidden pl-3 pr-0 md:pl-6 md:pr-0 lg:pl-12 lg:pr-0">
        {[...Array(items)].map((_, i) => (
          <div key={i} className="min-w-[140px] md:min-w-[180px] lg:min-w-[220px] flex-shrink-0">
            <MovieCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RowSkeleton;
