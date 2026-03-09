import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiHeart, FiBookmark, FiClock, FiSettings } from 'react-icons/fi';
import ThemeToggle from '../ui/ThemeToggle';

const Sidebar = ({ isOpen, onClose, navLinks, isScrolled }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth || { isAuthenticated: false, user: null });
  const location = useLocation();

  useEffect(() => {
    onClose();
  }, [location, onClose]);

  // Match sidebar top with navbar bottom in both states.
  const navHeightClass = isScrolled
    ? 'top-[4.25rem] md:top-20'
    : 'top-[4.5rem] md:top-20';

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const sidebarVariants = {
    hidden: { x: '100%', transition: { type: 'spring', damping: 25, stiffness: 200 } },
    visible: { 
      x: 0, 
      transition: { 
        type: 'spring', 
        damping: 25, 
        stiffness: 200, 
        staggerChildren: 0.1, 
        delayChildren: 0.1 
      } 
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            onClick={onClose}
            className={`fixed inset-0 ${navHeightClass} md:hidden z-40 bg-black/60 backdrop-blur-sm cursor-pointer transition-all duration-500 ease-in-out`}
          />

          {/* Sidebar Menu */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sidebarVariants}
            className={`fixed ${navHeightClass} right-0 bottom-0 md:hidden z-50 w-64 sm:w-80 bg-secondary border-l border-border shadow-elevated flex flex-col transition-all duration-500 ease-in-out`}
          >
            <div className="flex-grow p-6 flex flex-col gap-6 overflow-y-auto">
              
              {/* User profile at top if logged in */}
              {isAuthenticated && (
                <motion.div variants={linkVariants} className="flex items-center gap-4 mb-2 pb-4 border-b border-border">
                  <div className="w-12 h-12 rounded-full border border-accent bg-elevated overflow-hidden shrink-0 transition-colors">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name || 'User'} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-accent">
                        <FiUser size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-display font-semibold text-text-primary text-lg truncate">
                      {user?.name || 'User'}
                    </span>
                    <span className="text-sm text-text-muted truncate">
                      {user?.email || 'user@cinemahub.io'}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Staggered Navigation Links */}
              {navLinks.map((link) => (
                <motion.div variants={linkVariants} key={link.path}>
                  <Link
                    to={link.path}
                    className={`block text-xl font-display font-semibold transition-colors ${
                      location.pathname === link.path ? 'text-accent' : 'text-text-primary hover:text-accent'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div variants={linkVariants} className="h-px bg-border my-2" />
              
              {/* Conditional Actions */}
              {isAuthenticated ? (
                <div className="flex flex-col gap-5">
                  {user?.role === 'admin' && (
                    <motion.div variants={linkVariants}>
                      <Link to="/admin" className="flex items-center gap-3 text-lg font-display text-accent hover:text-accent-hover transition-colors font-semibold">
                        <FiSettings className="animate-spin-slow" /> Admin Panel
                      </Link>
                    </motion.div>
                  )}
                  <motion.div variants={linkVariants}>
                    <Link to="/favorites" className="flex items-center gap-3 text-lg font-display text-text-primary hover:text-accent transition-colors">
                      <FiHeart className="text-accent" /> Favorites
                    </Link>
                  </motion.div>
                  <motion.div variants={linkVariants}>
                    <Link to="/watchlist" className="flex items-center gap-3 text-lg font-display text-text-primary hover:text-accent transition-colors">
                      <FiBookmark className="text-accent" /> Watchlist
                    </Link>
                  </motion.div>
                  <motion.div variants={linkVariants}>
                    <Link to="/history" className="flex items-center gap-3 text-lg font-display text-text-primary hover:text-accent transition-colors">
                      <FiClock className="text-accent" /> History
                    </Link>
                  </motion.div>
                  <motion.div variants={linkVariants}>
                    <Link to="/profile" className="flex items-center gap-3 text-lg font-display text-text-primary hover:text-accent transition-colors">
                      <FiUser className="text-accent" /> Profile
                    </Link>
                  </motion.div>
                </div>
              ) : (
                <motion.div variants={linkVariants}>
                  <Link to="/login" className="btn-primary block w-full text-center py-3 text-lg font-display hover:scale-[1.02] active:scale-95 transition-transform">
                    Sign In
                  </Link>
                </motion.div>
              )}
              
              {/* Appearance Setting at bottom */}
              <div className="mt-auto pt-4 flex flex-col">
                <motion.div variants={linkVariants} className="flex items-center justify-between p-4 rounded-xl bg-elevated/50 border border-border">
                  <span className="text-text-secondary font-medium">Appearance</span>
                  <ThemeToggle />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
