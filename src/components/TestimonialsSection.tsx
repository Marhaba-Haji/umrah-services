
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ahmed Al-Rashid",
      country: "United States",
      rating: 5,
      text: "Excellent service! Got my Umrah visa in just 4 days. The team was very helpful throughout the process and answered all my questions promptly. Highly recommended for anyone planning their spiritual journey.",
      date: "November 2024",
      verified: true
    },
    {
      name: "Fatima Khan", 
      country: "United Kingdom",
      rating: 5,
      text: "Very smooth process from start to finish. I was worried about the document requirements but their team guided me perfectly. Received my visa on time and everything went according to plan.",
      date: "October 2024",
      verified: true
    },
    {
      name: "Mohammad Ibrahim",
      country: "India", 
      rating: 5,
      text: "Best visa service I've used! Fast processing, transparent pricing, and excellent customer support. They even helped me with travel tips for my first Umrah. May Allah bless their work.",
      date: "September 2024",
      verified: true
    },
    {
      name: "Aisha Begum",
      country: "Bangladesh",
      rating: 5,
      text: "Professional and reliable service. I needed my visa urgently for a family emergency and they processed it in 48 hours with their express service. Truly grateful for their help.",
      date: "November 2024", 
      verified: true
    },
    {
      name: "Omar Hassan",
      country: "Malaysia",
      rating: 5,
      text: "Third time using their services for my family's Umrah visas. Consistent quality and support every time. The multiple entry visa option is perfect for frequent pilgrims like us.",
      date: "October 2024",
      verified: true
    },
    {
      name: "Zainab Ali",
      country: "Canada",
      rating: 5,
      text: "I was hesitant about applying online but their secure process and regular updates gave me confidence. Received my visa exactly when they promised. Will definitely use again.",
      date: "September 2024",
      verified: true
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Pilgrims Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join over 50,000 satisfied pilgrims who have trusted us with their Umrah visa applications. 
            Read real reviews from fellow Muslims who have completed their spiritual journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-yellow-500">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-lg">⭐</span>
                    ))}
                  </div>
                  {testimonial.verified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                      ✓ Verified Review
                    </span>
                  )}
                </div>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">🌍 {testimonial.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{testimonial.date}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Statistics */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">50,000+</div>
                <div className="text-sm text-gray-600">Happy Pilgrims</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">99%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">4.9/5</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Expert Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Join our community of satisfied pilgrims
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <span>📱 Follow us on social media</span>
            <span>💬 Read more reviews</span>
            <span>🤝 Join our WhatsApp group</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
