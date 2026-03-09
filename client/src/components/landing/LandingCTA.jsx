import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const LandingCTA = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-primary pb-32">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full max-h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container-custom relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto rounded-[3rem] bg-linear-to-br from-surface/80 to-primary border border-white/5 p-10 md:p-16 text-center shadow-xl relative overflow-hidden"
        >
          {/* Inner decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-text-primary tracking-tight mb-6">
              Ready to build your <br />
              <span className="text-accent italic pr-2">cinematic</span> library?
            </h2>
            
            <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Join thousands of movie lovers. Create your free account today and start organizing your watch history.
            </p>

            <motion.div whileHover="hover" className="inline-flex">
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-accent text-primary font-bold rounded-2xl hover:opacity-90 hover:scale-105 active:scale-95 transition-all group cta-pulse overflow-hidden"
              >
                <span className="text-lg">Get Started Now — It's Free</span>
                <motion.div
                  variants={{
                    hover: { x: [0, 5, 0], transition: { repeat: Infinity, duration: 1, ease: "easeInOut" } }
                  }}
                >
                  <FiArrowRight />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingCTA;
