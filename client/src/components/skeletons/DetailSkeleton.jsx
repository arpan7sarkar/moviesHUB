const DetailSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-primary animate-pulse pb-12">
      {/* Backdrop */}
      <div className="w-full h-[40vh] md:h-[60vh] bg-elevated relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent"></div>
      </div>

      <div className="container-custom relative -mt-32 md:-mt-48 z-10 flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="w-48 md:w-72 aspect-[2/3] bg-surface rounded-xl shadow-elevated flex-shrink-0 mx-auto md:mx-0"></div>

        {/* Details */}
        <div className="flex-1 mt-6 md:mt-24 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="h-10 bg-surface rounded w-3/4 mb-4"></div>
          
          <div className="flex gap-3 mb-6 justify-center md:justify-start">
            <div className="h-6 bg-surface rounded w-16"></div>
            <div className="h-6 bg-surface rounded w-20"></div>
            <div className="h-6 bg-surface rounded w-12"></div>
          </div>
          
          <div className="h-5 bg-surface rounded w-32 mb-4"></div>
          
          {/* Overview lines */}
          <div className="flex flex-col gap-2 w-full max-w-3xl items-center md:items-start mb-8">
            <div className="h-4 bg-surface rounded w-full"></div>
            <div className="h-4 bg-surface rounded w-[90%]"></div>
            <div className="h-4 bg-surface rounded w-[85%]"></div>
            <div className="h-4 bg-surface rounded w-[60%]"></div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-4">
            <div className="h-12 w-32 bg-surface rounded-md"></div>
            <div className="h-12 w-12 bg-surface rounded-full"></div>
            <div className="h-12 w-12 bg-surface rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailSkeleton;
