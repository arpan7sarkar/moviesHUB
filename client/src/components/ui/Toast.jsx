import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const icons = {
  success: <FiCheckCircle className="text-success min-w-[20px]" size={20} />,
  error: <FiAlertCircle className="text-danger min-w-[20px]" size={20} />,
  info: <FiInfo className="text-accent min-w-[20px]" size={20} />,
};

const actionStyles = {
  neutral: 'bg-white/10 text-text-primary hover:bg-white/20',
  accent: 'bg-accent text-primary hover:bg-accent-hover',
  danger: 'bg-danger text-white hover:bg-danger/85',
};

const Toast = ({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 3000,
  actions = [],
  showClose = true,
  position = 'bottom-right',
  className = '',
}) => {
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
          className={`fixed z-50 px-4 py-3 bg-secondary border border-border shadow-elevated rounded-lg min-w-[300px] max-w-md w-[90%] md:w-auto ${
            position === 'center'
              ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              : 'bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-6 md:bottom-6'
          } ${className}`}
        >
          <div className="flex items-start gap-3">
            {icons[type] || icons.info}
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">{message}</p>
              {actions.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  {actions.map((action, idx) => (
                    <button
                      key={`${action.label}-${idx}`}
                      onClick={action.onClick}
                      disabled={action.disabled}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors disabled:opacity-50 ${actionStyles[action.variant || 'neutral']}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {showClose && (
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-primary p-1 rounded transition-colors"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
