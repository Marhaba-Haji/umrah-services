import React, { useEffect, useState } from "react";
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
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCurrency } from "./Header";
import { convertFromINR } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  "Business Visa": Building,
  "Tourist Visa": MapPin,
  "Family Visit Visa": Users,
  "Transit Visa": Plane,
  // Add more mappings as needed
};

const OtherSaudiServices = () => {
  const { currency } = useCurrency();
  const [visas, setVisas] = useState<
    import("@/integrations/supabase/types").Database["public"]["Tables"]["saudi_visas"]["Row"][]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feePopoverOpen, setFeePopoverOpen] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVisas() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("saudi_visas")
        .select("*")
        .neq("visa_type", "Umrah Visa")
        .eq("status", "active");
      if (error) {
        setError(error.message);
        setVisas([]);
      } else {
        setVisas(data || []);
      }
      setLoading(false);
    }
    fetchVisas();
  }, []);

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

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading visa services...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : visas.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No visa services found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visas.map((visa) => {
              // Convert all price fields
              const { value: priceValue, symbol: priceSymbol } = convertFromINR(
                visa.price || 0,
                currency,
              );
              const { value: agencyValue, symbol: agencySymbol } =
                convertFromINR(visa.agency_fees || 0, currency);
              const { value: embassyValue, symbol: embassySymbol } =
                convertFromINR(visa.embassy_fees || 0, currency);
              return (
                <Card
                  key={visa.id}
                  className="relative overflow-hidden shadow-lg border-0 bg-white hover:shadow-2xl transition-all duration-300 rounded-2xl group"
                  style={{ minHeight: 420 }}
                >
                  {/* Featured Image with overlay tags */}
                  {visa.featured_image && (
                    <div className="h-48 w-full overflow-hidden bg-emerald-50 flex items-center justify-center border-b relative">
                      <img
                        src={visa.featured_image}
                        alt={visa.visa_type}
                        className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 flex gap-2 z-10">
                        {visa.visa_format && (
                          <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                            {visa.visa_format}
                          </span>
                        )}
                        {visa.approval_rate && (
                          <span className="bg-yellow-400 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full shadow">
                            {visa.approval_rate}% Approval
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Title and Price Row */}
                  <CardHeader className="pb-2 pt-6 px-6">
                    <div className="flex items-center justify-between w-full">
                      <CardTitle className="text-xl font-extrabold text-gray-900 tracking-tight mb-0 text-left">
                        {visa.visa_type}
                      </CardTitle>
                      <div className="flex items-start gap-1">
                        <span className="text-2xl font-bold text-emerald-600 text-right">
                          {priceSymbol}
                          {priceValue.toLocaleString()}
                        </span>
                        {(visa.agency_fees || visa.embassy_fees) && (
                          <Popover
                            open={feePopoverOpen === visa.id}
                            onOpenChange={(open) =>
                              setFeePopoverOpen(open ? visa.id : null)
                            }
                          >
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                className="ml-1 mt-0.5 text-emerald-600 hover:text-emerald-800 focus:outline-none"
                                onMouseEnter={() => setFeePopoverOpen(visa.id)}
                                onMouseLeave={() => setFeePopoverOpen(null)}
                                onFocus={() => setFeePopoverOpen(visa.id)}
                                onBlur={() => setFeePopoverOpen(null)}
                                onClick={() =>
                                  setFeePopoverOpen(
                                    feePopoverOpen === visa.id ? null : visa.id,
                                  )
                                }
                              >
                                <Info
                                  className="w-4 h-4 align-top"
                                  aria-label="Info about fees"
                                />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="text-sm max-w-xs">
                              <div className="font-semibold mb-1">
                                Fee Breakdown
                              </div>
                              {visa.agency_fees && (
                                <div>
                                  <span className="font-medium">
                                    Agency Fees:
                                  </span>{" "}
                                  {agencySymbol}
                                  {agencyValue.toLocaleString()}
                                </div>
                              )}
                              {visa.embassy_fees && (
                                <div>
                                  <span className="font-medium">
                                    Embassy Fees:
                                  </span>{" "}
                                  {embassySymbol}
                                  {embassyValue.toLocaleString()}
                                </div>
                              )}
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-2">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Processing:</span>{" "}
                        <span>{visa.processing_time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Validity:</span>{" "}
                        <span>{visa.visa_validity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Entries:</span>{" "}
                        <span>{visa.number_of_entries}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Stay Validity:</span>{" "}
                        <span>{visa.stay_validity}</span>
                      </div>
                      {visa.total_stay_allowed !== null && (
                        <div className="flex items-center gap-2 col-span-2">
                          <span className="font-medium">
                            Total Stay Allowed:
                          </span>{" "}
                          <span>{visa.total_stay_allowed} days</span>
                        </div>
                      )}
                      {visa.eligibility && (
                        <div className="flex items-center gap-2 col-span-2">
                          <span className="font-medium">Eligibility:</span>{" "}
                          <span>{visa.eligibility}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white font-semibold py-2 rounded-lg shadow-md mt-2"
                    >
                      <Link to="/saudi-visa-services#umrah-application-header">
                        Apply Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

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
                    Proven track record with thousands of successful
                    applications
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
                    7 days/ week support
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
