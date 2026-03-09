import React from 'react';
import { motion } from 'framer-motion';
import { FiMonitor, FiDatabase, FiCoffee } from 'react-icons/fi';

const useCases = [
  {
    icon: <FiCoffee className="w-6 h-6" />,
    title: "Casual Viewers",
    desc: "Just want a place to remember what you watched last weekend or save that movie a friend recommended? We've got you covered with a simple, distraction-free interface."
  },
  {
    icon: <FiMonitor className="w-6 h-6" />,
    title: "Cinephiles",
    desc: "Dive deep into the details. Explore extensive cast & crew information, view detailed genres, and keep track of every obscure indie film you've ever discovered."
  },
  {
    icon: <FiDatabase className="w-6 h-6" />,
    title: "Data Nerds",
    desc: "Love to track everything? Maintain meticulously organized watchlists, favorited collections, and a complete history of your cinematic consumption over time."
  }
];

const LandingUseCases = () => {
  return (
    <section className="py-24 bg-primary relative">
      <div className="container-custom px-4 max-w-5xl mx-auto">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-black text-text-primary tracking-tight mb-4">
            Built for everyone. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-accent/60">Optimized for you.</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Whether you watch one movie a month or three a day, CinemaHub adapts to your tracking habits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-4xl bg-white/2 border border-white/5 hover:bg-white/4 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 group-hover:bg-accent/20 transition-all">
                {useCase.icon}
              </div>
              <h3 className="text-xl font-display font-bold text-text-primary mb-3">
                {useCase.title}
              </h3>
              <p className="text-text-secondary leading-relaxed text-sm">
                {useCase.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LandingUseCases;
