
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import TrustIndicators from '../components/TrustIndicators';
import UmrahConditions from '../components/UmrahConditions';
import ServicesSection from '../components/ServicesSection';
import HowItWorks from '../components/HowItWorks';
import PricingSection from '../components/PricingSection';
import OtherSaudiServices from '../components/OtherSaudiServices';
import AdditionalServices from '../components/AdditionalServices';
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
        <UmrahConditions />
        <ServicesSection />
        <HowItWorks />
        <PricingSection />
        <OtherSaudiServices />
        <AdditionalServices />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
