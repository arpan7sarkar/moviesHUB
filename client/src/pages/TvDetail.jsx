import { useParams } from 'react-router-dom';

const TvDetail = () => {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-primary pt-20 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-display text-text-primary uppercase tracking-wider">Tv Detail: {id}</h1>
    </div>
  );
};

export default TvDetail;
