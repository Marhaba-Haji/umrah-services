import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useCurrency } from "./Header";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const OtherSaudiServices = () => {
  const { currency } = useCurrency();
  const [visaServices, setVisaServices] = React.useState<unknown[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Currency conversion rates (base INR)
  const exchangeRates = {
    USD: 1 / 83.5,
    INR: 1,
    SAR: 1 / 22.3,
  };
  const currencySymbols = { USD: "$", INR: "₹", SAR: "ر.س" };
  const currencySymbol = currencySymbols[currency] || "₹";
  const rate = exchangeRates[currency] || 1;

  React.useEffect(() => {
    async function fetchVisas() {
      setLoading(true);
      const { data, error } = await supabase
        .from("saudi_visas")
        .select(
          "id, visa_type, visa_category, description, visa_validity, stay_validity, processing_time, price, requirements, featured_image, approval_rate, visa_format, agency_fees, embassy_fees, number_of_entries",
        )
        .order("visa_category");
      console.log("Visa fetch:", { data, error });
      if (!error && data) setVisaServices(data);
      setLoading(false);
    }
    fetchVisas();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 mb-4 px-4 py-2">
            🇸🇦 Saudi Arabia Services
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Other Saudi Visa Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Beyond Umrah, we offer comprehensive visa services for all types of
            travel to Saudi Arabia. Professional processing with guaranteed
            approval.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto overflow-visible">
          {loading ? (
            <div className="col-span-3 text-center py-8">
              Loading visa options...
            </div>
          ) : visaServices.length === 0 ? (
            <div className="col-span-3 text-center py-8 text-red-600 font-semibold">
              No visa data found. Check your database, filter, or permissions.
            </div>
          ) : (
            visaServices
              .filter((service) => service.visa_type !== "Umrah Visa")
              .map((service, index) => {
                const convertedPrice = Math.round((service.price || 0) * rate);
                // Handle requirements as array or string (for features display)
                let requirementsArr: string[] = [];
                if (Array.isArray(service.requirements)) {
                  requirementsArr = service.requirements;
                } else if (typeof service.requirements === "string") {
                  try {
                    requirementsArr = JSON.parse(service.requirements);
                  } catch {
                    requirementsArr = service.requirements
                      .split(",")
                      .map((f: string) => f.trim());
                  }
                }
                return (
                  <Card
                    key={service.id || index}
                    className="bg-white shadow-lg hover:shadow-xl transition-all hover:transform hover:scale-105 flex flex-col overflow-visible"
                  >
                    {service.featured_image && (
                      <div className="relative z-0 overflow-visible">
                        <img
                          src={service.featured_image}
                          alt={service.visa_type || service.visa_category}
                          className="w-full h-40 object-cover object-top rounded-t-lg"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {service.visa_format && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                              {service.visa_format}
                            </span>
                          )}
                          {service.approval_rate && (
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                              {service.approval_rate}% Approval
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <CardHeader className="pb-4 flex-1">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-gray-900">
                          {service.visa_type}
                        </CardTitle>
                        <span className="font-bold text-blue-600 text-lg flex items-start">
                          {currencySymbol}
                          {convertedPrice.toLocaleString()}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="ml-1 cursor-pointer text-blue-500 relative z-10">
                                  <Info size={14} />
                                </span>
                              </TooltipTrigger>
                              <TooltipPrimitive.Portal>
                                <TooltipContent className="max-w-xs text-left z-[9999]">
                                  <div className="mb-1">
                                    <b>Agency Fees:</b>{" "}
                                    {service.agency_fees
                                      ? `₹${Number(service.agency_fees).toLocaleString()}`
                                      : "-"}
                                  </div>
                                  <div>
                                    <b>Embassy Fees:</b>{" "}
                                    {service.embassy_fees
                                      ? `₹${Number(service.embassy_fees).toLocaleString()}`
                                      : "-"}
                                  </div>
                                </TooltipContent>
                              </TooltipPrimitive.Portal>
                            </Tooltip>
                          </TooltipProvider>
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            ⏰ Visa Validity:
                          </span>
                          <span className="font-medium">
                            {service.visa_validity}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            🗓️ Stay Validity:
                          </span>
                          <span className="font-medium">
                            {service.stay_validity}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">🔢 Entry Count:</span>
                          <span className="font-medium">
                            {service.number_of_entries || "-"}
                          </span>
                        </div>
                      </div>
                      <Link to="/other-visas" className="block w-full">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Apply Now
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })
          )}
        </div>
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Need a different type of visa or have special requirements?
          </p>
          <Button
            variant="outline"
            size="lg"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => {
              const message = `Hello, I need assistance with a Saudi visa. Please connect me with a visa expert.`;
              const whatsappUrl = `https://wa.me/919008447887?text=${encodeURIComponent(message)}`;
              window.open(whatsappUrl, "_blank");
            }}
          >
            📞 Contact Our Visa Experts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OtherSaudiServices;
