
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import TrustIndicators from '../components/TrustIndicators';
import ServicesSection from '../components/ServicesSection';
import HowItWorks from '../components/HowItWorks';
import PricingSection from '../components/PricingSection';
import FAQSection from '../components/FAQSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <TrustIndicators />
        <ServicesSection />
        <HowItWorks />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
