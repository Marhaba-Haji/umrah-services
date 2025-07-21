import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQSection from "../components/FAQSection";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";
import { Helmet } from "react-helmet-async";

const FAQ = () => {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://yourdomain.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "FAQs",
        item: "https://yourdomain.com/faq",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>
          Frequently Asked Questions | Umrah Visa, Packages, Services - Marhaba
          Haji
        </title>
        <meta
          name="description"
          content="Get answers to the most common questions about Umrah visas, packages, and services. Expert guidance, 24/7 support, and up-to-date information."
        />
        <meta
          property="og:title"
          content="Frequently Asked Questions | Marhaba Haji"
        />
        <meta
          property="og:description"
          content="Get answers to the most common questions about Umrah visas, packages, and services."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/faq" />
        <meta
          property="og:image"
          content="https://yourdomain.com/path/to/faq-banner.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://yourdomain.com/faq" />
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      </Helmet>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Find answers to the most common questions about Umrah visa
              applications, requirements, and our services. Get expert guidance
              for your spiritual journey.
            </p>
          </div>
        </section>

        {/* Quick Help Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Need Immediate Help?
              </h2>
              <p className="text-gray-600 mb-8">
                Can't find the answer you're looking for? Our experts are
                available 24/7 to assist you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Expert
                </Button>
                <Button
                  variant="outline"
                  className="border-amber-600 text-amber-600 hover:bg-amber-50"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call: +91-78920-09800
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <FAQSection page="faqs" />

        {/* Additional Help Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Browse by Category
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore specific topics to find detailed information about our
                services.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-xl">📋</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Visa Requirements
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete guide on documentation, eligibility, and requirements
                  for Umrah visa applications.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-600 text-amber-600"
                >
                  Learn More
                </Button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-xl">⏱️</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Processing Times</h3>
                <p className="text-gray-600 mb-4">
                  Information about visa processing durations, express services,
                  and delivery options.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-600 text-amber-600"
                >
                  Learn More
                </Button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Pricing & Payments
                </h3>
                <p className="text-gray-600 mb-4">
                  Detailed breakdown of visa fees, service charges, and
                  available payment methods.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-600 text-amber-600"
                >
                  Learn More
                </Button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-xl">🏨</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Hotel & Transport
                </h3>
                <p className="text-gray-600 mb-4">
                  Everything about accommodation booking, transport
                  arrangements, and travel packages.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-600 text-amber-600"
                >
                  Learn More
                </Button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-xl">🛡️</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Travel Insurance</h3>
                <p className="text-gray-600 mb-4">
                  Coverage options, health requirements, and insurance
                  recommendations for pilgrims.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-600 text-amber-600"
                >
                  Learn More
                </Button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-xl">📞</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Support & Assistance
                </h3>
                <p className="text-gray-600 mb-4">
                  24/7 customer support, emergency assistance, and how to track
                  your application.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-600 text-amber-600"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
