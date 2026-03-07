import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const icons = {
  success: <FiCheckCircle className="text-success min-w-[20px]" size={20} />,
  error: <FiAlertCircle className="text-danger min-w-[20px]" size={20} />,
  info: <FiInfo className="text-accent min-w-[20px]" size={20} />,
};

const Toast = ({ message, type = 'info', isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    let timeout;
    if (isVisible && duration > 0) {
      timeout = setTimeout(() => {
        onClose();
      }, duration);
    }
    return () => clearTimeout(timeout);
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 z-50 flex items-center gap-3 px-4 py-3 bg-secondary border border-border shadow-elevated rounded-lg min-w-[300px] max-w-md w-[90%] md:w-auto md:left-auto md:right-6 md:bottom-6"
        >
          {icons[type]}
          <p className="flex-1 text-sm font-medium text-text-primary">{message}</p>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1 rounded transition-colors"
          >
            <FiX size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
