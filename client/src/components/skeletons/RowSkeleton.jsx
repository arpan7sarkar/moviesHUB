import MovieCardSkeleton from './MovieCardSkeleton';

const RowSkeleton = ({ items = 5 }) => {
  return (
    <div className="w-full py-6">
      <div className="h-6 bg-surface rounded w-48 mb-6 ml-5 lg:ml-20 animate-pulse"></div>
      <div className="flex gap-4 overflow-hidden px-5 lg:px-20">
        {[...Array(items)].map((_, i) => (
          <div key={i} className="min-w-[140px] md:min-w-[180px] lg:min-w-[220px] flex-shrink-0 animate-pulse">
            <MovieCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RowSkeleton;
