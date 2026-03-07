import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * AdminRoute Component
 * 
 * Guards routes that require administrative privileges.
 * Redirects to the root (/) if the user does not have the 'admin' role.
 */
const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAuthenticated && user?.role === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default AdminRoute;
