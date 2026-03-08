import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiTrash2, FiSearch } from 'react-icons/fi';
import { useGetHistoryQuery, useClearHistoryMutation } from '../features/user/userApi';
import SectionTitle from '../components/ui/SectionTitle';
import { Link } from 'react-router-dom';
import Toast from '../components/ui/Toast';
import { resolvePoster, handlePosterError } from '../utils/mediaFallbacks';

const History = () => {
  const { data: history, isLoading, isError } = useGetHistoryQuery();
  const [clearHistory, { isLoading: isClearing }] = useClearHistoryMutation();
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearHistory = async () => {
    try {
      await clearHistory().unwrap();
      setShowClearConfirm(false);
      setToast({
        show: true,
        message: 'Watch history cleared successfully.',
        type: 'success',
      });
    } catch (err) {
      console.error('Failed to clear history:', err);
      setToast({
        show: true,
        message: err?.data?.message || 'Failed to clear watch history.',
        type: 'error',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 container-custom flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen pt-32 pb-20 container-custom text-center">
        <p className="text-danger">Failed to load history. Please try again later.</p>
      </div>
    );
  }

  // Group history by date
  const groupedHistory = history?.reduce((groups, item) => {
    const date = new Date(item.watchedAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  return (
    <div className="min-h-screen pt-32 pb-20 container-custom">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <SectionTitle 
          title="Watch History" 
          subtitle="Your recently viewed movies and shows"
          icon={<FiClock className="text-accent" />}
          className="mb-0"
        />
        
        {history?.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={isClearing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-danger/10 hover:bg-danger/20 text-danger text-sm font-bold transition-all disabled:opacity-50 cursor-pointer w-fit self-end md:self-center"
          >
            <FiTrash2 />
            {isClearing ? 'Clearing...' : 'Clear All'}
          </button>
        )}
      </div>

      {history?.length > 0 ? (
        <div className="space-y-12 mt-12">
          {Object.entries(groupedHistory).map(([date, items]) => (
            <motion.div 
              key={date}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-display font-bold text-text-primary mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-accent" />
                {date}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group flex gap-4 bg-secondary p-3 rounded-xl border border-border/40 hover:border-accent/40 transition-all hover:shadow-premium"
                    >
                      <Link to={item.mediaType === 'tv' ? `/tv/${item.tmdbId}` : `/movies/${item.tmdbId}`} className="shrink-0">
                        <div className="w-20 aspect-2/3 rounded-lg overflow-hidden bg-elevated">
                          <img 
                            src={resolvePoster(item.poster_path || item.posterPath, 'w200')}
                            alt={item.title}
                            loading="lazy"
                            onError={handlePosterError}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </Link>
                      
                      <div className="flex flex-col justify-center min-w-0">
                        <Link 
                          to={item.mediaType === 'tv' ? `/tv/${item.tmdbId}` : `/movies/${item.tmdbId}`}
                          className="text-text-primary font-bold hover:text-accent transition-colors truncate"
                        >
                          {item.title}
                        </Link>
                        <p className="text-text-muted text-xs mt-1 capitalize">{item.mediaType}</p>
                        <p className="text-[10px] text-text-muted mt-auto">
                          Watched at {new Date(item.watchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-secondary border border-border flex items-center justify-center mb-6">
            <FiClock size={40} className="text-text-muted" />
          </div>
          <h2 className="text-2xl font-display font-bold text-text-primary mb-2">History is Empty</h2>
          <p className="text-text-muted max-w-md mb-8">
            You haven't watched any movies or TV shows yet. Start your cinematic journey now!
          </p>
          <Link to="/" className="btn-primary py-3 px-8 rounded-xl font-bold flex items-center gap-2">
            <FiSearch /> Discover Content
          </Link>
        </motion.div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <Toast
        message="Clear your entire watch history?"
        type="info"
        isVisible={showClearConfirm}
        duration={0}
        className="bottom-16 md:bottom-20"
        onClose={() => setShowClearConfirm(false)}
        showClose={!isClearing}
        actions={[
          {
            label: 'Cancel',
            variant: 'neutral',
            onClick: () => setShowClearConfirm(false),
            disabled: isClearing,
          },
          {
            label: isClearing ? 'Clearing...' : 'Yes, Clear',
            variant: 'danger',
            onClick: handleClearHistory,
            disabled: isClearing,
          },
        ]}
      />
    </div>
  );
};

export default History;
