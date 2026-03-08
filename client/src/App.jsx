import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Route Guards
import ProtectedRoute from './guards/ProtectedRoute.jsx';
import AdminRoute from './guards/AdminRoute.jsx';

// Layout & Core Pages
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';

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
  const token = localStorage.getItem('token');
  
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
            {/* ... Routes remain unchanged ... */}
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<TvShows />} />
            <Route path="/movies/:id" element={<MovieDetail />} />
            <Route path="/tv/:id" element={<TvDetail />} />
            <Route path="/person/:id" element={<PersonDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/movies" element={<ManageMovies />} />
                <Route path="/admin/movies/new" element={<MovieForm />} />
                <Route path="/admin/movies/:id/edit" element={<MovieForm />} />
                <Route path="/admin/users" element={<ManageUsers />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}


export default App;
