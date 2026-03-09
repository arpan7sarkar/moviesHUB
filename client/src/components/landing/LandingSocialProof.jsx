import React from 'react';
import { motion } from 'framer-motion';

const LandingSocialProof = () => {
  const logos = [
    { name: 'TMDB', label: 'Powered by TMDB API' },
    { name: 'Cinephile', label: 'Cinephile Approved' },
    { name: 'Trackt', label: 'Trackt Alternative' },
    { name: 'IMDb', label: 'Data Synced' },
    { name: 'Letterboxd', label: 'Import Ready' },
  ];

  return (
    <section className="py-12 border-y border-white/2 bg-primary relative overflow-hidden">
      <div className="container-custom relative z-10 px-4">
        
        <p className="text-center text-xs font-bold tracking-[0.2em] text-text-muted uppercase mb-8">
          Trusted by the community & powered by the best
        </p>

        {/* Marquee/Logo Grid */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-center gap-2"
            >
              {/* Abstract shapes representing logos to keep it clean and fictional/SaaS-like */}
              <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center font-display font-black text-primary text-xs">
                {logo.name.charAt(0)}
              </div>
              <span className="font-display font-bold text-text-primary text-lg tracking-tight">
                {logo.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingSocialProof;
