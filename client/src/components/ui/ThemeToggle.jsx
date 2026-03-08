import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../features/theme/themeSlice';
import { FiSun, FiMoon } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);
  const icon = themeMode === 'light' ? <FiSun size={20} /> : <FiMoon size={20} />;

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="relative p-2 text-text-secondary hover:text-accent hover:bg-surface rounded-full transition-colors overflow-hidden flex items-center justify-center"
      aria-label={`Theme: ${themeMode === 'light' ? 'Light' : 'Dark'}`}
      title={`Theme: ${themeMode === 'light' ? 'Light' : 'Dark'}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={themeMode}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
