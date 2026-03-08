import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for handling infinite scroll pagination with RTK Query API endpoints.
 * 
 * @param {Function} useQueryHook - The RTK Query hook to use (e.g., useGetListQuery)
 * @param {Object} queryArgs - Arguments to pass to the query hook (excluding page)
 * @param {Object} options - Additional options for the intersection observer
 * @returns {Object} - { data, isLoading, isFetching, hasMore, sentinelRef }
 */
const useInfiniteScroll = (useQueryHook, queryArgs = {}, options = {}) => {
  const [page, setPage] = useState(1);
  const [combinedData, setCombinedData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  
  // Ref for the element we want to observe at the bottom of the list
  const sentinelRef = useRef(null);
  
  // Fetch the data for the current page
  const { 
    data: currentData, 
    isLoading, 
    isFetching, 
    error 
  } = useQueryHook({ ...queryArgs, page });

  // Reset state when query arguments (like genre or sort) change
  useEffect(() => {
    setPage(1);
    setCombinedData([]);
    setHasMore(true);
  }, [JSON.stringify(queryArgs)]);

  // Process incoming data
  useEffect(() => {
    if (currentData?.results) {
      if (page === 1) {
        setCombinedData(currentData.results);
      } else {
        // Filter out duplicates that might occur due to changing data on the server
        setCombinedData(prev => {
          const newResults = currentData.results.filter(
            newItm => !prev.some(oldItm => oldItm.id === newItm.id)
          );
          return [...prev, ...newResults];
        });
      }
      
      // Check if we've reached the last page
      setHasMore(currentData.page < currentData.total_pages && page < 500); // TMDB limits to 500 pages
    }
  }, [currentData, page]);

  // Set up the intersection observer
  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      // If the sentinel is visible, we're not currently fetching, and there are more pages
      if (target.isIntersecting && !isFetching && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    },
    [isFetching, hasMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '0px',
      threshold: 1,
      ...options,
    });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [handleObserver, options]);

  return {
    data: combinedData,
    isLoading,
    isFetching,
    hasMore,
    error,
    sentinelRef,
  };
};

export default useInfiniteScroll;
