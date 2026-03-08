import React from 'react';
import { motion } from 'framer-motion';

const SectionTitle = ({ title, subtitle, icon, className = "" }) => {
  return (
    <div className={`mb-10 ${className}`}>
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 mb-2"
      >
        {icon && (
          <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-accent shadow-premium">
            {icon}
          </div>
        )}
        <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary tracking-tight">
          {title}
        </h2>
      </motion.div>
      
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-text-muted text-base md:text-lg max-w-2xl border-l-2 border-accent/30 pl-4 py-1"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionTitle;
