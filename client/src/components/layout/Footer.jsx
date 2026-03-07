import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiMail, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-primary border-t border-white/5 py-12 md:py-20 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand and Details */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <Link 
              to="/" 
              className="text-2xl font-display font-bold tracking-tighter text-text-primary group mb-4"
            >
              Cine<span className="text-accent group-hover:text-accent-hover transition-colors">Vault</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              Experience movie magic at its finest. Discover, track, and watch your 
              favorite cinema pieces with CineVault.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-2">Explore</h4>
            <Link to="/" className="text-sm text-text-muted hover:text-accent transition-colors">Home</Link>
            <Link to="/movies" className="text-sm text-text-muted hover:text-accent transition-colors">Movies</Link>
            <Link to="/tv" className="text-sm text-text-muted hover:text-accent transition-colors">TV Shows</Link>
          </div>

          {/* Support */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-2">Support</h4>
            <Link to="/profile" className="text-sm text-text-muted hover:text-accent transition-colors">My Profile</Link>
            <Link to="/watchlist" className="text-sm text-text-muted hover:text-accent transition-colors">Watchlist</Link>
            <Link to="/favorites" className="text-sm text-text-muted hover:text-accent transition-colors">Favorites</Link>
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
            &copy; {currentYear} CineVault Inc. All rights reserved.
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
