import React from 'react';
import PageTransition from '../components/layout/PageTransition';

// Landing Sections
import LandingHero from '../components/landing/LandingHero';
import LandingSocialProof from '../components/landing/LandingSocialProof';
import LandingFeatures from '../components/landing/LandingFeatures';
import LandingHowItWorks from '../components/landing/LandingHowItWorks';
import LandingUseCases from '../components/landing/LandingUseCases';
import LandingFAQ from '../components/landing/LandingFAQ';
import LandingCTA from '../components/landing/LandingCTA';

const Landing = () => {
  return (
    <PageTransition>
      <main className="bg-primary overflow-x-clip selection:bg-accent/30 selection:text-text-primary">
        <LandingHero />
        <LandingSocialProof />
        <div id="features"><LandingFeatures /></div>
        <div id="process"><LandingHowItWorks /></div>
        <div id="use-cases"><LandingUseCases /></div>
        <div id="faq"><LandingFAQ /></div>
        <LandingCTA />
      </main>
    </PageTransition>
  );
};

export default Landing;
