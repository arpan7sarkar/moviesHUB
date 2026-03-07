import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../features/theme/themeSlice';
import { FiSun, FiMoon } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="relative p-2 text-text-secondary hover:text-accent hover:bg-surface rounded-full transition-colors overflow-hidden flex items-center justify-center"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {themeMode === 'dark' ? (
          <motion.div
            key="sun"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiSun size={20} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiMoon size={20} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
