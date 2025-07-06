import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useCurrency } from "./Header";

const AdditionalServices = () => {
  const { currency } = useCurrency();

  // Currency conversion rates (base USD)
  const exchangeRates = {
    USD: 1,
    INR: 83.5,
    SAR: 3.75,
  };

  // Currency symbols
  const currencySymbols = {
    USD: "$",
    INR: "₹",
    SAR: "ر.س",
  };

  const currencySymbol = currencySymbols[currency] || "$";
  const rate = exchangeRates[currency] || 1;

  const services = [
    {
      icon: "🕋",
      title: "Makkah Hotel Booking",
      description: "Premium hotels near Masjid al-Haram with best rates",
      image:
        "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      features: [
        "Walking distance to Haram",
        "5-star accommodations",
        "Competitive rates",
        "Instant confirmation",
      ],
      basePrice: 1999,
    },
    {
      icon: "🕌",
      title: "Madinah Hotel Booking",
      description: "Comfortable stays near Masjid an-Nabawi",
      image:
        "https://images.unsplash.com/photo-1646424857576-2a66db82a65c?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      features: [
        "Close to Prophet's Mosque",
        "Modern amenities",
        "Halal certified",
        "Airport transfers included",
      ],
      basePrice: 120,
    },
    {
      icon: "✈️",
      title: "Group Flights",
      description: "Affordable group flight packages for Umrah pilgrims",
      image:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=200&fit=crop",
      features: [
        "Group discounts",
        "Direct flights",
        "Flexible dates",
        "Baggage included",
      ],
      basePrice: 800,
    },
    {
      icon: "📦",
      title: "Group Umrah Packages",
      description: "Complete Umrah packages for groups and families",
      image:
        "https://news.harvard.edu/gazette/wp-content/uploads/2023/02/Umrah-Gazette-group-shot.jpg",
      features: [
        "All-inclusive packages",
        "Group leader support",
        "Custom itineraries",
        "Best group rates",
      ],
      basePrice: 1200,
    },
    {
      icon: "⚡",
      title: "Short Umrah Packages",
      description: "Quick 5-7 day Umrah packages for busy schedules",
      image:
        "https://rjyhoikoqhephrkjgebo.supabase.co/storage/v1/object/public/lovable-uploads//family-umrah-package021524095728AM.jpg",
      features: [
        "Express processing",
        "Prime locations",
        "Compact itinerary",
        "Maximum spiritual benefit",
      ],
      basePrice: 899,
    },
    {
      icon: "🚗",
      title: "Cab Transport Booking",
      description: "Reliable transportation between cities and airports",
      image:
        "https://rjyhoikoqhephrkjgebo.supabase.co/storage/v1/object/public/lovable-uploads//Umrah-Cab-Services-1536x779.png",
      features: [
        "Licensed drivers",
        "Air-conditioned vehicles",
        "24/7 availability",
        "Fixed pricing",
      ],
      basePrice: 50,
    },
    {
      icon: "🎯",
      title: "Guide Services",
      description: "Expert Umrah guides for spiritual and historical guidance",
      image:
        "https://rjyhoikoqhephrkjgebo.supabase.co/storage/v1/object/public/guide-photos//guide_1751519440184_5lyf48.jpg",
      features: [
        "Experienced guides",
        "Multilingual support",
        "Religious instruction",
        "Historical insights",
      ],
      basePrice: 100,
    },
    {
      icon: "📍",
      title: "Makkah Ziyarath Tours",
      description: "Guided visits to historical and religious sites",
      image:
        "https://rjyhoikoqhephrkjgebo.supabase.co/storage/v1/object/public/activities-images//1751640110900-omtr29.jpg",
      features: [
        "Expert guides",
        "Historical sites",
        "Cave of Hira",
        "Jabal al-Nour",
      ],
      basePrice: 80,
    },
    {
      icon: "🏛️",
      title: "Madinah Ziyarath Tours",
      description: "Sacred sites and historical places in Madinah",
      image:
        "https://rjyhoikoqhephrkjgebo.supabase.co/storage/v1/object/public/activities-images//1751221822129-c0ifox.png",
      features: [
        "Quba Mosque",
        "Mount Uhud",
        "Qiblatain Mosque",
        "Islamic history",
      ],
      basePrice: 70,
    },
  ];

  const getServiceRoute = (serviceTitle) => {
    switch (serviceTitle) {
      case "Makkah Hotel Booking":
      case "Madinah Hotel Booking":
        return "/hotel";
      case "Group Flights":
        return "/group-flights";
      case "Group Umrah Packages":
        return "/group-packages";
      case "Short Umrah Packages":
        return "/custom-packages";
      case "Cab Transport Booking":
        return "/transport";
      case "Guide Services":
        return "/guide";
      case "Makkah Ziyarath Tours":
        return "/ziarath";
      case "Madinah Ziyarath Tours":
        return "/ziarath";
      default:
        return "/services";
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-emerald-100 text-emerald-800 mb-4 px-4 py-2">
            🎒 Travel Services
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Umrah Travel Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Make your pilgrimage seamless with our comprehensive travel
            services. From accommodation to guided tours, we've got everything
            covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-full md:max-w-7xl mx-auto">
          {services.map((service, index) => {
            let priceDisplay;
            const priceUnit =
              service.basePrice >= 800
                ? "/person"
                : service.basePrice >= 100
                  ? "/day"
                  : service.basePrice >= 50
                    ? "/trip"
                    : "/night";
            if (service.title === "Makkah Hotel Booking") {
              priceDisplay = "From ₹1,999/day";
            } else if (service.title === "Madinah Hotel Booking") {
              priceDisplay = "From ₹2,999/day";
            } else if (service.title === "Group Umrah Packages") {
              priceDisplay = "From ₹69,999/person";
            } else if (service.title === "Group Flights") {
              priceDisplay = "From ₹34,999/person";
            } else if (service.title === "Short Umrah Packages") {
              priceDisplay = "From ₹59,999/person";
            } else if (service.title === "Guide Services") {
              priceDisplay = "From ₹2,999/activity";
            } else {
              const convertedPrice = Math.round(service.basePrice * rate);
              priceDisplay = `From ${currencySymbol}${convertedPrice.toLocaleString()}${priceUnit}`;
            }

            return (
              <Card
                key={index}
                className="bg-white shadow-lg hover:shadow-xl transition-all overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300${service.title === "Guide Services" ? " object-top" : ""}`}
                  />
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <span className="text-xl">{service.icon}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-600 text-white">
                      {priceDisplay}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center space-x-2"
                      >
                        <span className="text-emerald-500 text-sm">✓</span>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={getServiceRoute(service.title)}>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto mt-16">
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-emerald-800 mb-4">
                🎁 Complete Umrah Package
              </h3>
              <p className="text-emerald-700 mb-6">
                Book your visa along with accommodation, transport, and tours
                for exclusive discounts. Save up to 25% on complete packages.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/umrah-packages">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    View Complete Packages
                  </Button>
                </Link>
                <Link to="/build-your-own-umrah">
                  <Button
                    variant="outline"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  >
                    Get Custom Quote
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdditionalServices;
