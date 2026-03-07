import { useSearchParams } from 'react-router-dom';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  
  return (
    <div className="min-h-screen bg-primary pt-20 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-display text-text-primary uppercase tracking-wider">Search: {query}</h1>
    </div>
  );
};

export default SearchResults;
