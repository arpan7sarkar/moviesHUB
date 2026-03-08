import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
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
import Home from './pages/Home';
import Movies from './pages/Movies';
import TvShows from './pages/TvShows';
import MovieDetail from './pages/MovieDetail';
import TvDetail from './pages/TvDetail';
import PersonDetail from './pages/PersonDetail';
import SearchResults from './pages/SearchResults';
import Favorites from './pages/Favorites';
import Watchlist from './pages/Watchlist';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Admin Page Components
import Dashboard from './pages/admin/Dashboard';
import ManageMovies from './pages/admin/ManageMovies';
import MovieForm from './pages/admin/MovieForm';
import ManageUsers from './pages/admin/ManageUsers';

import { useGetMeQuery } from './features/auth/authApi';

function App() {
  const location = useLocation();
  const mode = useSelector((state) => state.theme.mode);
  const token = localStorage.getItem('token');
  const withRouteBoundary = (element, key) => (
    <RouteErrorBoundary resetKey={`${key}-${location.pathname}`}>
      {element}
    </RouteErrorBoundary>
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
  }, [mode]);

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
            <Route path="/" element={withRouteBoundary(<Home />, 'home')} />
            <Route path="/movies" element={withRouteBoundary(<Movies />, 'movies')} />
            <Route path="/tv" element={withRouteBoundary(<TvShows />, 'tv')} />
            <Route path="/movies/:id" element={withRouteBoundary(<MovieDetail />, 'movie-detail')} />
            <Route path="/tv/:id" element={withRouteBoundary(<TvDetail />, 'tv-detail')} />
            <Route path="/person/:id" element={withRouteBoundary(<PersonDetail />, 'person-detail')} />
            <Route path="/search" element={withRouteBoundary(<SearchResults />, 'search')} />
            <Route path="/login" element={withRouteBoundary(<Login />, 'login')} />
            <Route path="/register" element={withRouteBoundary(<Register />, 'register')} />
            
            <Route element={withRouteBoundary(<ProtectedRoute />, 'protected')}>
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
