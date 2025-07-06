import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Package,
  IdCard,
  Plane,
  Hotel,
  Car,
  Map,
  User,
  FileText,
} from "lucide-react";

const Services = () => {
  const services = [
    {
      title: "Umrah Group Package",
      description:
        "Complete Umrah packages for groups with accommodation, transport, and guided tours",
      icon: Users,
      route: "/group-packages",
      gradient: "from-emerald-500 to-teal-600",
      features: ["Group discounts", "Guided tours", "All-inclusive"],
      popular: false,
    },
    {
      title: "Umrah Custom Package",
      description:
        "Personalized Umrah packages tailored to your specific needs and preferences",
      icon: Package,
      route: "/custom-packages",
      gradient: "from-blue-500 to-indigo-600",
      features: ["Customizable", "Flexible dates"],
      popular: true,
    },
    {
      title: "Build Your Own Umrah Package",
      description:
        "Design a fully personalized Umrah experience by selecting your own hotels, flights, transport, and add-ons.",
      icon: Package,
      route: "/build-your-own-umrah",
      gradient: "from-cyan-500 to-emerald-600",
      features: [
        "Fully customizable",
        "Choose hotels & flights",
        "Add-ons available",
      ],
      popular: false,
    },
    {
      title: "Umrah Visa",
      description:
        "Fast and reliable Umrah visa processing with expert assistance",
      icon: IdCard,
      route: "/apply",
      gradient: "from-purple-500 to-pink-600",
      features: ["Quick processing", "Expert support", "High success rate"],
      popular: false,
    },
    {
      title: "Group Flights",
      description:
        "Special group flight bookings for Umrah pilgrims with competitive rates",
      icon: Plane,
      route: "/group-flights",
      gradient: "from-orange-500 to-red-600",
      features: ["Group rates", "Flexible booking", "24/7 support"],
      popular: false,
    },
    {
      title: "Hotel Booking",
      description:
        "Premium hotel accommodations near Haram with verified reviews",
      icon: Hotel,
      route: "/hotel",
      gradient: "from-green-500 to-emerald-600",
      features: ["Near Haram", "Verified hotels", "Best rates"],
      popular: false,
    },
    {
      title: "Transport Booking",
      description:
        "Comfortable and reliable transport services throughout your journey",
      icon: Car,
      route: "/transport",
      gradient: "from-yellow-500 to-orange-600",
      features: ["Airport transfers", "City tours", "24/7 availability"],
      popular: false,
    },
    {
      title: "Ziarath Booking",
      description:
        "Guided visits to historical and religious sites in Makkah and Madinah",
      icon: Map,
      route: "/ziarath",
      gradient: "from-indigo-500 to-purple-600",
      features: ["Expert guides", "Historical sites", "Group tours"],
      popular: false,
    },
    {
      title: "Guide Booking",
      description:
        "Professional multilingual guides for your spiritual journey",
      icon: User,
      route: "/guide",
      gradient: "from-pink-500 to-rose-600",
      features: ["Multilingual", "Religious knowledge", "Personal attention"],
      popular: false,
    },
    {
      title: "Other Saudi Visas",
      description: "Business, tourist, and family visit visas for Saudi Arabia",
      icon: FileText,
      route: "/other-visas",
      gradient: "from-teal-500 to-cyan-600",
      features: ["Multiple types", "Fast processing", "Documentation help"],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-700">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Complete Umrah Services
          </h1>
          <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto">
            Everything you need for your spiritual journey, all in one place
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white"
              >
                {service.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-yellow-500 text-yellow-900 font-semibold">
                      Popular
                    </Badge>
                  </div>
                )}

                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <CardHeader className="relative z-10 pb-4">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {service.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </CardHeader>

                <CardContent className="relative z-10">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <Badge
                        key={featureIndex}
                        variant="outline"
                        className="text-xs border-emerald-200 text-emerald-700"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <Link to={service.route}>
                    <Button
                      className={`w-full bg-gradient-to-r ${service.gradient} hover:opacity-90 transform transition-all duration-200 hover:scale-105 shadow-lg`}
                      size="lg"
                    >
                      Explore Service
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
