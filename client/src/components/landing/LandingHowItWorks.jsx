import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    num: "01",
    title: "Create Your Account",
    desc: "Sign up in seconds and get your personal cinematic hub ready for customization."
  },
  {
    num: "02",
    title: "Discover Content",
    desc: "Search TMDB's massive database, find trending shows, or use our roulette for suggestions."
  },
  {
    num: "03",
    title: "Start Tracking",
    desc: "Add movies to your watchlists, mark them as watched to build history, and heart your favorites."
  }
];

const LandingHowItWorks = () => {
  return (
    <section className="py-24 bg-elevated border-y border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-primary/80 to-transparent pointer-events-none" />
      
      <div className="container-custom relative z-10 px-4">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center max-w-6xl mx-auto">
          
          {/* Left Text */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-sm font-bold tracking-[0.2em] text-accent uppercase mb-4">How It Works</h2>
            <h3 className="text-4xl md:text-5xl lg:text-5xl font-display font-black text-text-primary tracking-tight mb-6">
              From discovery to <br /> your digital shelf.
            </h3>
            <p className="text-text-secondary text-lg max-w-md mx-auto lg:mx-0">
              We built CinemaHub to be perfectly intuitive. Get started immediately without a learning curve.
            </p>
          </div>

          {/* Right Steps */}
          <div className="flex-1 w-full max-w-lg">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-6 top-10 bottom-10 w-px bg-linear-to-b from-accent/50 via-border to-transparent hidden sm:block" />
              
              <div className="space-y-12">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="relative flex flex-col sm:flex-row gap-6 sm:gap-8 items-start"
                  >
                    {/* Number Circle */}
                    <div className="w-12 h-12 rounded-full bg-surface border-2 border-white/10 flex items-center justify-center shrink-0 shadow-lg relative z-10 backdrop-blur-md font-mono text-sm font-bold text-accent">
                      {step.num}
                    </div>
                    
                    {/* Content */}
                    <div className="pt-2">
                      <h4 className="text-xl font-display font-bold text-text-primary mb-2">{step.title}</h4>
                      <p className="text-text-secondary leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default LandingHowItWorks;
