
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Choose Your Service",
      description: "Select the Umrah visa service that best fits your travel plans and timeline",
      icon: "📋",
      details: [
        "Compare different visa types",
        "Check processing times",
        "Review pricing options",
        "Select additional services"
      ]
    },
    {
      number: "02", 
      title: "Upload Documents",
      description: "Securely upload your passport, photos, and required documentation",
      icon: "📄",
      details: [
        "Passport (6+ months validity)",
        "Recent passport-size photos",
        "Travel itinerary",
        "Vaccination certificates"
      ]
    },
    {
      number: "03",
      title: "Expert Review",
      description: "Our visa specialists review and verify all your documents for accuracy",
      icon: "🔍",
      details: [
        "Document verification",
        "Form completion check",
        "Photo compliance review",
        "Requirements validation"
      ]
    },
    {
      number: "04",
      title: "Application Submission",
      description: "We submit your application to Saudi authorities and track the progress",
      icon: "🚀",
      details: [
        "Official submission",
        "Government processing",
        "Status monitoring",
        "Real-time updates"
      ]
    },
    {
      number: "05",
      title: "Receive Your Visa",
      description: "Get your approved visa delivered digitally with travel instructions",
      icon: "✅",
      details: [
        "Digital visa delivery",
        "Travel guidelines",
        "Entry requirements",
        "24/7 support access"
      ]
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How to Get Your Umrah Visa
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined 5-step process makes getting your Umrah visa simple and stress-free. 
            From application to approval, we handle everything for you.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <div className="text-3xl font-bold text-emerald-600 mb-2">{step.number}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                    
                    <div className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="text-xs text-gray-500 flex items-center justify-center">
                          <span className="w-1 h-1 bg-emerald-500 rounded-full mr-2"></span>
                          {detail}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 text-sm">→</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline for mobile */}
        <div className="md:hidden mt-12">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-px h-12 bg-emerald-200 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="text-lg font-bold text-emerald-600 mb-1">{step.number}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  <div className="space-y-1">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="text-sm text-gray-500 flex items-center">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full mr-2"></span>
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-emerald-50 to-amber-50 rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Start Your Umrah Journey?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of pilgrims who have trusted us with their Umrah visa applications. 
              Start your application today and take the first step towards your spiritual journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Start Application Now
              </button>
              <button className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-lg font-medium transition-colors">
                Get Free Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
