import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';

// Route Guards
import ProtectedRoute from './guards/ProtectedRoute.jsx';
import AdminRoute from './guards/AdminRoute.jsx';

// Layout & Core Pages
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import RouteErrorBoundary from './components/errors/RouteErrorBoundary';

// Page Components
const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./pages/Home'));
const Movies = lazy(() => import('./pages/Movies'));
const TvShows = lazy(() => import('./pages/TvShows'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const TvDetail = lazy(() => import('./pages/TvDetail'));
const PersonDetail = lazy(() => import('./pages/PersonDetail'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Funzone = lazy(() => import('./pages/Funzone'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Watchlist = lazy(() => import('./pages/Watchlist'));
const History = lazy(() => import('./pages/History'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages (separate dynamic chunks)
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageMovies = lazy(() => import('./pages/admin/ManageMovies'));
const MovieForm = lazy(() => import('./pages/admin/MovieForm'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));

import { useGetMeQuery } from './features/auth/authApi';

function App() {
  const location = useLocation();
  const mode = useSelector((state) => state.theme.mode);
  const token = localStorage.getItem('token');
  const routeFallback = (
    <div className="min-h-[45vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-accent/40 border-t-accent rounded-full animate-spin" />
    </div>
  );
  const withRouteBoundary = (element, key) => (
    <RouteErrorBoundary resetKey={`${key}-${location.pathname}`}>
      <Suspense fallback={routeFallback}>{element}</Suspense>
    </RouteErrorBoundary>
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
  }, [mode]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  // Initial auth check
  const { isLoading: authLoading } = useGetMeQuery(undefined, {
    skip: !token,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <Navbar />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={withRouteBoundary(<Landing />, 'landing')} />
            <Route path="/login" element={withRouteBoundary(<Login />, 'login')} />
            <Route path="/register" element={withRouteBoundary(<Register />, 'register')} />
            
            <Route element={withRouteBoundary(<ProtectedRoute />, 'protected')}>
              <Route path="/home" element={withRouteBoundary(<Home />, 'home')} />
              <Route path="/movies" element={withRouteBoundary(<Movies />, 'movies')} />
              <Route path="/tv" element={withRouteBoundary(<TvShows />, 'tv')} />
              <Route path="/movies/:id" element={withRouteBoundary(<MovieDetail />, 'movie-detail')} />
              <Route path="/tv/:id" element={withRouteBoundary(<TvDetail />, 'tv-detail')} />
              <Route path="/person/:id" element={withRouteBoundary(<PersonDetail />, 'person-detail')} />
              <Route path="/search" element={withRouteBoundary(<SearchResults />, 'search')} />
              <Route path="/funzone" element={withRouteBoundary(<Funzone />, 'funzone')} />
              <Route path="/favorites" element={withRouteBoundary(<Favorites />, 'favorites')} />
              <Route path="/watchlist" element={withRouteBoundary(<Watchlist />, 'watchlist')} />
              <Route path="/history" element={withRouteBoundary(<History />, 'history')} />
              <Route path="/profile" element={withRouteBoundary(<Profile />, 'profile')} />
            </Route>
            
            <Route element={withRouteBoundary(<AdminRoute />, 'admin-guard')}>
              <Route element={withRouteBoundary(<AdminLayout />, 'admin-layout')}>
                <Route path="/admin" element={withRouteBoundary(<Dashboard />, 'admin-dashboard')} />
                <Route path="/admin/movies" element={withRouteBoundary(<ManageMovies />, 'admin-movies')} />
                <Route path="/admin/movies/new" element={withRouteBoundary(<MovieForm />, 'admin-movie-new')} />
                <Route path="/admin/movies/:id/edit" element={withRouteBoundary(<MovieForm />, 'admin-movie-edit')} />
                <Route path="/admin/users" element={withRouteBoundary(<ManageUsers />, 'admin-users')} />
              </Route>
            </Route>

            <Route path="*" element={withRouteBoundary(<NotFound />, 'not-found')} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}


export default App;
