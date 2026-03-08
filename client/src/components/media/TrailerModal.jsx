import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.9, y: 20 },
};

const TrailerModal = ({ isOpen, onClose, videoKey, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl z-10"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
              aria-label="Close trailer"
            >
              <FiX size={20} />
            </button>

            {/* YouTube Embed */}
            {videoKey ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
                title={title || 'Trailer'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted text-lg">
                No trailer available
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TrailerModal;
