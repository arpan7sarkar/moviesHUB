import React from 'react';
import { motion } from 'framer-motion';
import { FiTv, FiList, FiTrendingUp, FiHeart } from 'react-icons/fi';

const features = [
  {
    icon: <FiList size={24} />,
    title: "Curate Your Watchlist",
    description: "Never forget a movie again. Organize what you want to see, and track what you've already watched.",
    colSpan: "md:col-span-2",
    bgColor: "bg-surface/50",
    illustration: (
      <div className="absolute right-0 bottom-0 top-12 left-1/3 md:left-1/2 rounded-tl-2xl bg-linear-to-br from-elevated to-primary border-t border-l border-white/5 p-4 overflow-hidden">
         {/* UI Mockup line graph or list item */}
         <div className="space-y-3 opacity-60">
            <div className="h-4 w-3/4 rounded bg-white/5" />
            <div className="h-4 w-1/2 rounded bg-white/5" />
            <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                <div className="h-8 w-8 rounded-full bg-accent/20" />
                <div className="h-8 w-8 rounded-full bg-white/5" />
            </div>
         </div>
      </div>
    )
  },
  {
    icon: <FiTv size={24} />,
    title: "Movie Roulette",
    description: "Can't decide? Let our Funzone Roulette pick the perfect movie for your night based on your favorite genre.",
    colSpan: "md:col-span-1",
    bgColor: "bg-elevated/40 text-center items-center",
    illustration: (
      <div className="mt-8 flex justify-center opacity-40 group-hover:opacity-80 transition-opacity">
        <div className="w-24 h-24 rounded-full border-[6px] border-accent/20 border-t-accent animate-spin" style={{ animationDuration: '3s' }} />
      </div>
    )
  },
  {
    icon: <FiTrendingUp size={24} />,
    title: "Deep Dive Analytics",
    description: "Track your watch history. See how much time you've spent immersed in cinema and analyze your favorite genres.",
    colSpan: "md:col-span-1",
    bgColor: "bg-linear-to-br from-surface/50 to-primary/80",
    illustration: null
  },
  {
    icon: <FiHeart size={24} />,
    title: "Build Your Favorites",
    description: "Keep a hall-of-fame of your absolute favorite films and TV shows. Share your impeccable taste with the world.",
    colSpan: "md:col-span-2",
    bgColor: "bg-surface/30",
    illustration: (
      <div className="absolute right-0 bottom-0 w-3/4 h-3/4 rounded-tl-[3rem] bg-linear-to-t from-primary to-accent/5 border-t border-l border-accent/10 flex items-center justify-center">
         <FiHeart size={64} className="text-accent/20" />
      </div>
    )
  }
];

const LandingFeatures = () => {
  return (
    <section className="py-24 bg-primary relative">
      <div className="container-custom relative z-10 px-4">
        
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-black text-text-primary tracking-tight mb-4">
            Everything you need <br />
            <span className="text-text-muted">to manage your movies.</span>
          </h2>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative overflow-hidden group rounded-4xl border border-white/5 p-8 md:p-10 ${feature.colSpan} ${feature.bgColor} flex flex-col min-h-[300px] shadow-sm hover:shadow-glow transition-shadow`}
            >
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-accent mb-6 backdrop-blur-sm border border-white/10 ${feature.bgColor.includes('items-center') ? 'mx-auto' : ''}`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-display font-bold text-text-primary mb-3">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed max-w-md">
                  {feature.description}
                </p>
              </div>
              
              {/* Decorative Illustration */}
              {feature.illustration}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LandingFeatures;
