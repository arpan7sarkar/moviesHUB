import { useParams } from 'react-router-dom';

const MovieForm = () => {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-primary pt-20 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-display text-text-primary uppercase tracking-wider">
        {id ? `Edit Movie: ${id}` : 'Create New Movie'}
      </h1>
    </div>
  );
};

export default MovieForm;
