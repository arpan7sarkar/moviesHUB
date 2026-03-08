const MovieCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="w-full aspect-[2/3] bg-elevated rounded-lg shadow-card skeleton-shimmer"></div>
      <div className="h-4 bg-surface rounded w-3/4 mt-1 skeleton-shimmer"></div>
      <div className="h-3 bg-surface rounded w-1/2 skeleton-shimmer"></div>
    </div>
  );
};

export default MovieCardSkeleton;
