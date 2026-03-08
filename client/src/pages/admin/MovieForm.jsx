import { useParams } from 'react-router-dom';

const MovieForm = () => {
  const { id } = useParams();
  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
        {id ? `Edit Movie` : 'Create New Movie'}
      </h1>
      <p className="text-text-muted text-sm">
        {id ? 'Update movie details below.' : 'Fill in the details to add a new movie.'}
      </p>
    </div>
  );
};

export default MovieForm;
