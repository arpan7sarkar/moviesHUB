import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiSearch, FiMenu, FiX, FiUser, FiHeart, FiBookmark, FiClock, FiSettings } from 'react-icons/fi';
import ThemeToggle from '../ui/ThemeToggle';
import Sidebar from './Sidebar';
import SearchOverlay from '../search/SearchOverlay';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const toggleMobileMenu = React.useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = React.useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled((prev) => {
        if (!prev && y > 72) return true;
        if (prev && y < 28) return false;
        return prev;
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [location, closeMobileMenu]);

  const navLinks = React.useMemo(() => [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv' },
  ], []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div
          className={`will-change-transform transition-[margin,margin-top,height,border-radius,background-color,box-shadow,backdrop-filter,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isScrolled
              ? 'mx-3 mt-3 md:mx-6 md:mt-4 h-14 md:h-16 rounded-2xl border bg-primary/92 backdrop-blur-xl border-border/90 shadow-[0_12px_35px_rgba(0,0,0,0.32)]'
              : 'mx-0 mt-0 h-[4.5rem] md:h-20 rounded-none border border-transparent bg-primary/0 backdrop-blur-0 shadow-none'
          }`}
        >
        <div className="container-custom h-full flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl md:text-3xl font-display font-bold tracking-tighter text-text-primary group"
          >
            Cine<span className="text-accent group-hover:text-accent-hover transition-colors">Vault</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors hover:text-accent ${
                  location.pathname === link.path ? 'text-accent' : 'text-text-secondary'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-5">
            <button onClick={() => setIsSearchOpen(true)} className="p-2 text-text-secondary hover:text-accent transition-colors cursor-pointer" aria-label="Open search">
              <FiSearch size={20} />
            </button>
            
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-4 ml-2">
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    title="Admin Dashboard" 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-all font-medium text-xs md:text-sm"
                  >
                    <FiSettings className="animate-spin-slow transition-transform group-hover:rotate-90" />
                    <span className="hidden lg:inline">Admin Panel</span>
                  </Link>
                )}
                <Link to="/favorites" title="Favorites" className="hidden md:block text-text-secondary hover:text-accent transition-colors">
                  <FiHeart size={20} />
                </Link>
                <Link to="/watchlist" title="Watchlist" className="hidden md:block text-text-secondary hover:text-accent transition-colors">
                  <FiBookmark size={20} />
                </Link>
                <Link to="/history" title="History" className="hidden md:block text-text-secondary hover:text-accent transition-colors">
                  <FiClock size={20} />
                </Link>
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-elevated border border-border overflow-hidden group-hover:border-accent transition-all">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <FiUser size={16} />
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-1.5 px-4 text-sm hidden sm:block">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-text-primary z-50 relative"
              onClick={toggleMobileMenu}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
        </div>
      </nav>

      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={closeMobileMenu} 
        navLinks={navLinks}
        isScrolled={isScrolled}
      />

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
