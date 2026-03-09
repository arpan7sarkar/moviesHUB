import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';

const faqs = [
  {
    question: "Is CinemaHub completely free to use?",
    answer: "Yes! CinemaHub is completely free for all users. You can create an account, build unlimited watchlists, and track your history without any subscription fees."
  },
  {
    question: "Do you have mobile apps available?",
    answer: "Currently, CinemaHub is a progressive web application (PWA). It is fully responsive and designed to work beautifully on your mobile browser, just like a native app."
  },
  {
    question: "Can I actually stream movies on CinemaHub?",
    answer: "No. CinemaHub is a tracking, discovery, and analytics platform for movies and TV shows, powered by TMDB. We do not host or provide streaming media content."
  },
  {
    question: "Can I import my data from other platforms like Letterboxd?",
    answer: "Data importing is on our roadmap for future updates! We understand how important it is to keep your existing watch history intact."
  },
  {
    question: "Where do you get your movie data from?",
    answer: "All of our movie, TV show, cast, and crew data is generously provided by The Movie Database (TMDB) API, ensuring you get the most accurate and up-to-date information available."
  }
];

const FAQItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={onClick}
        className="flex items-center justify-between w-full py-6 text-left focus:outline-none group cursor-pointer"
      >
        <span className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors pr-8">
          {faq.question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-accent text-primary' : 'bg-surface text-text-secondary group-hover:bg-accent/10 group-hover:text-accent'}`}>
          {isOpen ? <FiMinus /> : <FiPlus />}
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-text-secondary leading-relaxed pr-12">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LandingFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 bg-elevated border-y border-white/5">
      <div className="container-custom px-4 max-w-4xl mx-auto">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-black text-text-primary tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-text-secondary text-lg">
            Everything you need to know about the product and how it works.
          </p>
        </div>

        <div className="bg-surface/50 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-border/50 shadow-premium">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index} 
              faq={faq} 
              isOpen={index === openIndex} 
              onClick={() => setOpenIndex(index === openIndex ? -1 : index)} 
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default LandingFAQ;
