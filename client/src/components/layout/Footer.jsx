import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiTwitter, FiInstagram, FiMail, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  const homeLink = isAuthenticated ? '/home' : '/';

  return (
    <footer className="w-full bg-primary border-t border-white/5 py-12 md:py-20 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand and Details */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <Link 
              to={homeLink} 
              className="text-3xl font-branding font-bold tracking-wide text-accent group mb-4"
            >
              <span className="text-text-primary">Cinema</span>Hub
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              Experience movie magic at its finest. Discover, track, and watch your 
              favorite cinema pieces with CinemaHub.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-2">Explore</h4>
            <Link to={homeLink} className="text-sm text-text-muted hover:text-accent transition-colors">Home</Link>
            <Link to={isAuthenticated ? '/movies' : '/login'} className="text-sm text-text-muted hover:text-accent transition-colors">Movies</Link>
            <Link to={isAuthenticated ? '/tv' : '/register'} className="text-sm text-text-muted hover:text-accent transition-colors">TV Shows</Link>
          </div>

          {/* Support */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-2">Support</h4>
            <Link to={isAuthenticated ? '/profile' : '/login'} className="text-sm text-text-muted hover:text-accent transition-colors">{isAuthenticated ? 'My Profile' : 'Login'}</Link>
            <Link to={isAuthenticated ? '/watchlist' : '/register'} className="text-sm text-text-muted hover:text-accent transition-colors">{isAuthenticated ? 'Watchlist' : 'Sign Up'}</Link>
            <Link to={isAuthenticated ? '/favorites' : '/'} className="text-sm text-text-muted hover:text-accent transition-colors">{isAuthenticated ? 'Favorites' : 'Overview'}</Link>
          </div>

          {/* Connect */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-2">Connect</h4>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="p-2 text-text-secondary hover:text-accent hover:bg-surface rounded-full transition-all">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="p-2 text-text-secondary hover:text-accent hover:bg-surface rounded-full transition-all">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="p-2 text-text-secondary hover:text-accent hover:bg-surface rounded-full transition-all">
                <FiYoutube size={20} />
              </a>
              <a href="#" className="p-2 text-text-secondary hover:text-accent hover:bg-surface rounded-full transition-all">
                <FiMail size={20} />
              </a>
            </div>
            <p className="mt-8 text-xs text-text-muted text-center md:text-left uppercase tracking-tighter">
              Brought to you by CineHUB Studios
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-text-muted">
            &copy; {currentYear} CinemaHub Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link to="#" className="text-xs text-text-muted hover:text-text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-xs text-text-muted hover:text-text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
