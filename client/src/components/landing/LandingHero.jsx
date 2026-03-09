import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPlay, FiArrowRight } from 'react-icons/fi';

const LandingHero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep background color already handled by bg-primary on main */}
        
        {/* Large soft glowing orbs for that premium SaaS feel, strictly using muted palette */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/3 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/2 blur-[100px]" />
        
        {/* Subtle grid pattern for texture */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
          }}
        />
      </div>

      <div className="container-custom relative z-10 px-4 md:px-8 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Eyebrow badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/3 border border-white/10 mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-text-muted uppercase">The Ultimate Movie Hub V2</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-text-primary tracking-tight leading-[1.1] mb-6">
            Your Personal <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-text-primary via-accent to-accent/50">
               Cinematic Universe
            </span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover, track, and curate your movie and TV show journey. 
            A beautiful, distraction-[free] platform designed for true cinephiles and casual viewers alike.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <motion.div whileHover="hover" className="w-full sm:w-auto">
              <Link 
                to="/register" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-accent text-primary font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all group overflow-hidden relative"
              >
                <span className="relative z-10">Start For Free</span>
                <motion.div
                  variants={{
                    hover: { x: [0, 5, 0], transition: { repeat: Infinity, duration: 1, ease: "easeInOut" } }
                  }}
                >
                  <FiArrowRight className="relative z-10" />
                </motion.div>
              </Link>
            </motion.div>
            
            <Link 
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/3 border border-white/10 text-text-primary font-bold rounded-xl hover:bg-white/8 transition-colors group"
            >
              <FiPlay className="text-accent group-hover:scale-110 transition-transform" fill="currentColor" />
              <span>See How It Works</span>
            </Link>
          </div>

          {/* Social Proof snippet below CTA */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-12 flex items-center justify-center gap-4 text-sm text-text-muted"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-surface overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-start">
              <div className="flex text-accent gap-0.5 mb-0.5">
                {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-[10px]">★</span>)}
              </div>
              <span className="text-xs">Joined by 10k+ movie lovers</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-primary to-transparent pointer-events-none" />
    </section>
  );
};

export default LandingHero;
