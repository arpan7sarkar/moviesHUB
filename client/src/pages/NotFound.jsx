import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-primary pt-20 flex flex-col items-center justify-center text-center">
      <h1 className="text-9xl font-display font-bold text-accent text-glow">404</h1>
      <h2 className="text-3xl font-display text-text-primary mt-4">Page Not Found</h2>
      <p className="text-text-secondary mt-2 mb-8">The cinematic experience you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
