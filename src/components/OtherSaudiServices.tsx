
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Plane,
  Building,
  Car,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const OtherSaudiServices = () => {
  const services = [
    {
      id: 1,
      title: "Business Visa",
      description: "For business meetings, conferences, and commercial activities",
      price: "₹8,500",
      processing: "3-5 working days",
      validity: "90 days",
      entries: "Multiple",
      icon: Building,
      features: [
        "Business invitation letter support",
        "Commercial registration assistance",
        "Meeting arrangement support",
        "Priority processing available",
      ],
      popular: false,
    },
    {
      id: 2,
      title: "Tourist Visa",
      description: "Explore Saudi Arabia's heritage sites and modern attractions",
      price: "₹6,200",
      processing: "2-4 working days",
      validity: "1 year",
      entries: "Multiple",
      icon: MapPin,
      features: [
        "Visit historical sites",
        "Modern entertainment cities",
        "Cultural experiences",
        "Flexible travel dates",
      ],
      popular: true,
    },
    {
      id: 3,
      title: "Family Visit Visa",
      description: "Visit family members residing in Saudi Arabia",
      price: "₹4,800",
      processing: "5-7 working days",
      validity: "90 days",
      entries: "Single/Multiple",
      icon: Users,
      features: [
        "Family sponsorship support",
        "Relationship documentation",
        "Extended stay options",
        "Multiple entry available",
      ],
      popular: false,
    },
    {
      id: 4,
      title: "Transit Visa",
      description: "For travelers transiting through Saudi Arabia",
      price: "₹2,500",
      processing: "1-2 working days",
      validity: "4 days",
      entries: "Single",
      icon: Plane,
      features: [
        "Quick processing",
        "Airport transit facility",
        "Short stay permitted",
        "Connecting flight support",
      ],
      popular: false,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Other Saudi Arabia Visa Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive visa solutions for all your travel needs to Saudi
            Arabia. Professional service with guaranteed results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card
                key={service.id}
                className={`relative hover:shadow-lg transition-all duration-300 ${
                  service.popular
                    ? "border-emerald-500 ring-2 ring-emerald-200"
                    : "border-gray-200"
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-emerald-600 text-white px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {service.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm mt-2">
                    {service.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">
                      {service.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      All-inclusive fee
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Processing: {service.processing}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Validity: {service.validity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Entries: {service.entries}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      What's Included:
                    </h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-xs text-gray-600"
                        >
                          <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    asChild
                    className={`w-full ${
                      service.popular
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-gray-900 hover:bg-gray-800"
                    } text-white`}
                  >
                    <Link to="/other-saudi-visas">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Why Choose Our Saudi Visa Services?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    99% Success Rate
                  </h4>
                  <p className="text-gray-600">
                    Proven track record with thousands of successful applications
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Expert Guidance
                  </h4>
                  <p className="text-gray-600">
                    Professional visa consultants with years of experience
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    24/7 Support
                  </h4>
                  <p className="text-gray-600">
                    Round-the-clock customer support for all your queries
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OtherSaudiServices;
