import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiSmile, FiTarget } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import MovieRoulette from '../components/funzone/MovieRoulette';

const Funzone = () => {
  const [activeTab, setActiveTab] = useState('roulette');

  const tabs = [
    { id: 'roulette', label: 'Movie Roulette', icon: FiTarget, description: 'Let the wheel decide your genre' },
    { id: 'mood', label: 'Mood Matcher', icon: FiSmile, description: 'Find a movie based on how you feel' },
    { id: 'hiddengems', label: 'Hidden Gems', icon: FiTrendingUp, description: 'Discover highly rated obscure films' },
  ];

  return (
    <PageTransition>
      <main className="min-h-screen bg-primary pt-24 pb-16">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4 flex items-center justify-center gap-3">
              <span className="text-4xl">🍿</span> Funzone
            </h1>
            <p className="text-text-secondary text-lg">
              Can't decide what to watch? Explore these fun ways to discover your next favorite movie.
            </p>
          </div>

          {/* Feature Selector */}
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-16">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative p-6 rounded-2xl flex-1 max-w-sm border transition-all duration-300 text-left cursor-pointer overflow-hidden group ${
                  activeTab === tab.id
                    ? 'bg-accent/10 border-accent/40 shadow-glow'
                    : 'bg-secondary/40 border-border/40 hover:bg-secondary/80 hover:border-accent/30'
                }`}
              >
                {/* Active Background Glow */}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none"
                    initial={false}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                <div className="relative z-10 flex items-start gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${
                     activeTab === tab.id ? 'bg-accent/20 text-accent' : 'bg-elevated text-text-secondary group-hover:text-text-primary'
                  }`}>
                    <tab.icon size={24} />
                  </div>
                  <div>
                    <h3 className={`font-display font-semibold text-xl mb-1 transition-colors ${
                      activeTab === tab.id ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
                    }`}>
                      {tab.label}
                    </h3>
                    <p className={`text-sm transition-colors ${
                      activeTab === tab.id ? 'text-text-secondary' : 'text-text-muted group-hover:text-text-secondary'
                    }`}>
                      {tab.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Feature Content Area */}
          <div className="bg-secondary/30 border border-border/30 rounded-3xl p-6 md:p-12 min-h-[500px] relative overflow-hidden backdrop-blur-sm">
            <AnimatePresence mode="wait">
              {activeTab === 'roulette' && (
                <motion.div
                  key="roulette"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MovieRoulette />
                </motion.div>
              )}
              {activeTab === 'mood' && (
                <motion.div
                  key="mood"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center min-h-[400px]"
                >
                  <div className="text-center">
                    <FiSmile size={64} className="text-accent/50 mx-auto mb-4" />
                    <h2 className="text-2xl font-display font-bold text-text-primary mb-2">Mood Matcher</h2>
                    <p className="text-text-muted">Coming soon in step 2!</p>
                  </div>
                </motion.div>
              )}
              {activeTab === 'hiddengems' && (
                <motion.div
                  key="hiddengems"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center min-h-[400px]"
                >
                  <div className="text-center">
                    <FiTrendingUp size={64} className="text-accent/50 mx-auto mb-4" />
                    <h2 className="text-2xl font-display font-bold text-text-primary mb-2">Hidden Gems</h2>
                    <p className="text-text-muted">Coming soon in step 3!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default Funzone;
