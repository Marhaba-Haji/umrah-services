
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const UmrahConditions = () => {
  const conditions = [
    {
      icon: '🏨',
      title: 'Confirmed Hotel Booking',
      description: 'Valid hotel reservation from approved accommodations in Mecca and Medina',
      details: ['Must be from approved hotel list', 'Confirmation voucher required', 'Full payment or booking guarantee needed']
    },
    {
      icon: '✈️',
      title: 'Return Flight Booking',
      description: 'Confirmed round-trip flight tickets with valid dates',
      details: ['Return ticket mandatory', 'Valid for visa duration', 'Travel dates must match visa period']
    },
    {
      icon: '🚗',
      title: 'Airport Transfer',
      description: 'Pre-arranged transportation from approved transport companies',
      details: ['Licensed transport providers only', 'Airport pickup/drop-off included', 'Advance booking required']
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-amber-100 text-amber-800 mb-4 px-4 py-2">
            📋 Important Requirements
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🕋 Umrah Visa Conditions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Before applying for your Umrah visa, ensure you have these mandatory requirements. 
            All conditions must be fulfilled for visa approval.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {conditions.map((condition, index) => (
            <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-amber-500">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{condition.icon}</span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                  {condition.title}
                </CardTitle>
                <p className="text-gray-600">{condition.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {condition.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center space-x-2">
                      <span className="text-amber-500 text-sm">✓</span>
                      <span className="text-sm text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-gradient-to-r from-amber-100 to-orange-100 border-amber-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-amber-800 mb-4">
                ⚠️ Important Notice
              </h3>
              <p className="text-amber-700 mb-4">
                All three conditions above are mandatory for Umrah visa approval. Failure to provide 
                confirmed bookings from approved providers may result in visa rejection.
              </p>
              <p className="text-sm text-amber-600">
                We can assist you with approved hotel bookings and transport arrangements. 
                Contact our experts for complete travel packages.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UmrahConditions;
