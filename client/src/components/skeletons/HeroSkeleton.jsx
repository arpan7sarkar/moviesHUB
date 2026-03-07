const HeroSkeleton = () => {
  return (
    <div className="w-full h-[60vh] md:h-[80vh] relative animate-pulse bg-elevated">
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent"></div>
      <div className="absolute inset-0 flex flex-col justify-end container-custom pb-20 md:pb-32">
        <div className="h-12 bg-surface rounded w-3/4 md:w-1/2 mb-4"></div>
        <div className="h-4 bg-surface rounded w-full md:w-2/3 mb-2"></div>
        <div className="h-4 bg-surface rounded w-5/6 md:w-[60%] mb-8"></div>
        
        <div className="flex gap-4">
          <div className="h-10 w-32 bg-surface rounded-md"></div>
          <div className="h-10 w-32 bg-surface rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSkeleton;
