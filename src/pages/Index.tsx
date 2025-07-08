import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { CurrencyContext } from "../contexts/CurrencyContext";
import HeroSection from "../components/HeroSection";
import TrustIndicators from "../components/TrustIndicators";
import UmrahConditions from "../components/UmrahConditions";
import ServicesSection from "../components/ServicesSection";
import HowItWorks from "../components/HowItWorks";
import OtherSaudiServices from "../components/OtherSaudiServices";
import AdditionalServices from "../components/AdditionalServices";
import FAQSection from "../components/FAQSection";
import TestimonialsSection from "../components/TestimonialsSection";
import Footer from "../components/Footer";
import LeadCapturePopup from "../components/LeadCapturePopup";
import SmartWidget from "../components/SmartWidget";
import HomePageSEO from "../components/seo/HomePageSEO";

const Index = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [currency, setCurrency] = useState("INR");

  useEffect(() => {
    // Show popup after 15 seconds
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      <HomePageSEO />
      <div className="min-h-screen bg-white">
        <Header currency={currency} setCurrency={setCurrency} />
        <main>
          <HeroSection />
          <TrustIndicators />
          <UmrahConditions />
          <ServicesSection />
          <HowItWorks />
          <OtherSaudiServices />
          <AdditionalServices />
          <TestimonialsSection />
          <FAQSection />
        </main>
        <Footer />

        {/* Lead Capture Popup */}
        <LeadCapturePopup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
        />

        {/* Smart Widget - replaces WhatsApp Widget */}
        <SmartWidget />
      </div>
    </CurrencyContext.Provider>
  );
};

export default Index;
