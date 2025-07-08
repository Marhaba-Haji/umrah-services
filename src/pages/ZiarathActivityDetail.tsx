import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Star,
  Users,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { format as formatDate } from "date-fns";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BookingModal } from "./ZiarathBooking";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog } from "@/components/ui/dialog";
import { useCurrency } from "../contexts/CurrencyContext";
import { convertFromINR } from "@/lib/utils";

// --- Helper Components ---
const QuickFact = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 bg-emerald-50 rounded px-3 py-1 text-emerald-900 text-sm font-medium">
    <Icon className="w-4 h-4 text-emerald-400" />
    <span>{label}:</span>
    <span className="font-semibold">{value}</span>
  </div>
);

const TrustBar = () => (
  <div className="flex flex-wrap gap-3 justify-center py-4 bg-white rounded-xl shadow-sm mb-8 border border-emerald-50">
    <Badge className="bg-emerald-100 text-emerald-700 px-4 py-2 text-base font-medium">
      Licensed Guides
    </Badge>
    <Badge className="bg-yellow-100 text-yellow-700 px-4 py-2 text-base font-medium">
      Best Price Guarantee
    </Badge>
    <Badge className="bg-emerald-100 text-emerald-700 px-4 py-2 text-base font-medium">
      5-Star Reviews
    </Badge>
    <Badge className="bg-yellow-100 text-yellow-700 px-4 py-2 text-base font-medium">
      24/7 Support
    </Badge>
  </div>
);

const FeatureGrid = ({ features }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
    {features.map((f, i) => (
      <div
        key={i}
        className="flex items-center gap-2 bg-emerald-50 rounded-lg shadow-sm p-3 border border-emerald-100"
      >
        <CheckCircle className="w-5 h-5 text-emerald-400" />
        <span className="font-medium text-emerald-900">{f}</span>
      </div>
    ))}
  </div>
);

const ReviewsCarousel = () => {
  // Placeholder reviews
  const reviews = [
    {
      name: "Ayesha K.",
      text: "Absolutely unforgettable experience! The guide was knowledgeable and the vehicle was luxurious.",
      rating: 5,
    },
    {
      name: "Mohammed S.",
      text: "Booking was seamless and the support team was always available. Highly recommend!",
      rating: 5,
    },
    {
      name: "Fatima R.",
      text: "The Ziarath tour exceeded all expectations. Will book again!",
      rating: 5,
    },
  ];
  const [idx, setIdx] = useState(0);
  return (
    <div className="my-10 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-emerald-900">
          What Our Guests Say
        </h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIdx((idx - 1 + reviews.length) % reviews.length)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIdx((idx + 1) % reviews.length)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <div className="flex justify-center mb-2">
          {"★".repeat(reviews[idx].rating)}
        </div>
        <div className="text-lg text-gray-700 mb-2">“{reviews[idx].text}”</div>
        <div className="text-sm text-emerald-700 font-semibold">
          {reviews[idx].name}
        </div>
      </div>
    </div>
  );
};

const FAQAccordion = () => {
  // Placeholder FAQs
  const faqs = [
    {
      q: "Is the guide licensed?",
      a: "Yes, all our guides are fully licensed and experienced.",
    },
    {
      q: "Can I customize my Ziarath tour?",
      a: "Absolutely! Contact us for custom requests.",
    },
    {
      q: "What is the cancellation policy?",
      a: "Full refund if cancelled 48 hours before the tour.",
    },
  ];
  const [open, setOpen] = useState(null);
  return (
    <div className="my-10 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold text-emerald-900 mb-4">
        Frequently Asked Questions
      </h3>
      {faqs.map((faq, i) => (
        <div key={i} className="mb-2">
          <button
            className="w-full text-left font-semibold text-emerald-800 bg-emerald-50 rounded p-3 focus:outline-none"
            onClick={() => setOpen(open === i ? null : i)}
          >
            {faq.q}
          </button>
          {open === i && (
            <div className="bg-white rounded-b p-3 text-gray-700 border-t">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const RelatedActivities = ({ related }) => (
  <div className="my-12 max-w-5xl mx-auto">
    <h3 className="text-xl font-bold text-emerald-900 mb-4">
      You May Also Like
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {related.map((a) => (
        <div
          key={a.id}
          className="bg-white rounded-xl shadow-sm border border-emerald-50 hover:shadow-md transition overflow-hidden flex flex-col"
        >
          <img
            src={a.featured_image || "/public/placeholder.svg"}
            alt={a.name}
            className="w-full h-40 object-cover"
          />
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="font-bold text-lg text-emerald-900 mb-1">
                {a.name}
              </div>
              <div className="text-sm text-gray-500 mb-2">{a.city}</div>
            </div>
            <Button
              size="sm"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2 rounded"
              onClick={() => (window.location.href = `/ziarath/${a.slug}`)}
            >
              View Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Main Page ---
const ZiarathActivityDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [related, setRelated] = useState([]);
  const [enlargedImg, setEnlargedImg] = useState<string | null>(null);
  const { currency } = useCurrency();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("activities")
        .select("*")
        .eq("slug", slug)
        .single();
      setActivity(data);
      // Fetch related activities (same city, not this one, and not 'Umrah Tawaf and Sa'i')
      if (data) {
        const { data: rel } = await supabase
          .from("activities")
          .select("id, name, city, slug, featured_image")
          .eq("city", data.city)
          .neq("id", data.id)
          .neq("name", "Umrah Tawaf and Sa'i")
          .limit(3);
        setRelated(
          (rel || []).filter((a) => a.name !== "Umrah Tawaf and Sa'i"),
        );
      }
    })();
    (async () => {
      const { data } = await supabase.from("vehicles").select("*");
      setVehicles(data || []);
    })();
  }, [slug]);

  if (!activity)
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-700 text-xl">
        Loading...
      </div>
    );

  // Gallery images
  const galleryImages =
    activity.gallery && activity.gallery.length > 0
      ? activity.gallery
      : [activity.featured_image || "/public/placeholder.svg"];

  // Inclusions/Exclusions as arrays
  const inclusions = (activity.inclusions || "").split(/\r?\n/).filter(Boolean);
  const exclusions = (activity.exclusions || "").split(/\r?\n/).filter(Boolean);
  // Features as array
  const features = (activity.features || "")
    .split(/,|\n/)
    .map((f) => f.trim())
    .filter(Boolean);
  // Sites to visit as array
  const sites = (activity.sites || "").split(/\r?\n/).filter(Boolean);
  // FAQs
  const faqs = Array.isArray(activity.faqs) ? activity.faqs : [];

  // Price
  const minPrice = activity.vehicle_prices
    ? Math.min(...Object.values(activity.vehicle_prices).map(Number))
    : activity.price;
  const { value: convertedMinPrice, symbol: convertedSymbol } = convertFromINR(
    minPrice || 0,
    currency,
  );

  return (
    <div className="min-h-screen bg-[#f6f8f7]">
      <Header />
      <div className="max-w-5xl mx-auto py-8 px-4">
        {/* Hero Section with Gallery Carousel (first image only) */}
        <div className="relative w-full h-[340px] md:h-[440px] flex items-end bg-emerald-900/80 overflow-hidden shadow-sm mb-0">
          <img
            src={galleryImages[0]}
            alt={activity.name}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            style={{ zIndex: 1 }}
          />
          <div className="relative z-10 p-8 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-white drop-shadow tracking-tight">
                {activity.name}
              </h1>
              <div className="flex flex-wrap gap-3 mb-2">
                <Badge className="bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold">
                  {activity.city}
                </Badge>
                {activity.is_featured && (
                  <Badge className="bg-yellow-100 text-yellow-700 px-3 py-1 text-xs font-bold">
                    Featured
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <QuickFact
                  icon={Clock}
                  label="Duration"
                  value={activity.duration || "N/A"}
                />
                <QuickFact
                  icon={Star}
                  label="Price"
                  value={
                    minPrice
                      ? `${convertedSymbol}${convertedMinPrice.toLocaleString()}`
                      : "N/A"
                  }
                />
              </div>
            </div>
          </div>
        </div>
        {/* Tabs and Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-0">
          {/* Main Content: Tabs (2/3 width) */}
          <div className="md:col-span-2 flex flex-col">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="flex flex-wrap gap-2 mb-6 mt-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="sites">Sites</TabsTrigger>
                <TabsTrigger value="inclusions">
                  Inclusions & Exclusions
                </TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
                <TabsTrigger value="terms">Terms & Disclaimer</TabsTrigger>
              </TabsList>
              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="flex flex-col gap-8 mt-8">
                  {/* TrustBar (now above Features) */}
                  <TrustBar />
                  {/* Features (now after TrustBar) */}
                  {features.length > 0 && (
                    <section>
                      <h3 className="font-semibold text-emerald-800 mb-2">
                        Features
                      </h3>
                      <FeatureGrid features={features} />
                    </section>
                  )}
                  {/* Description */}
                  <section>
                    <h2 className="text-xl font-bold text-emerald-900 mb-2">
                      About this Activity
                    </h2>
                    <div
                      className="text-base text-gray-700 leading-relaxed"
                      style={{ wordBreak: "break-word" }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: activity.description || "",
                        }}
                      />
                    </div>
                  </section>
                </div>
              </TabsContent>
              {/* Gallery Tab */}
              <TabsContent value="gallery">
                <section>
                  <h3 className="font-semibold text-emerald-800 mb-4">
                    Gallery
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={activity.name}
                        className="w-full h-48 object-cover rounded-xl cursor-pointer transition-transform hover:scale-105"
                        onClick={() => setEnlargedImg(img)}
                      />
                    ))}
                  </div>
                  <Dialog
                    open={enlargedImg !== null}
                    onOpenChange={() => setEnlargedImg(null)}
                  >
                    {enlargedImg !== null && (
                      <div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
                        onClick={() => setEnlargedImg(null)}
                      >
                        <div
                          className="relative flex items-center justify-center"
                          style={{ maxHeight: "90vh", maxWidth: "90vw" }}
                        >
                          <img
                            src={enlargedImg}
                            alt="Enlarged"
                            className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-lg border-4 border-white"
                            onClick={(e) => e.stopPropagation()}
                          />
                          {/* Close button */}
                          <button
                            aria-label="Close"
                            className="absolute top-3 right-3 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-black bg-opacity-60 shadow-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-white transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEnlargedImg(null);
                            }}
                            title="Close"
                          >
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                          {/* Left arrow */}
                          <button
                            aria-label="Previous image"
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-black bg-opacity-60 shadow-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-white transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              const idx = galleryImages.indexOf(enlargedImg);
                              setEnlargedImg(
                                galleryImages[
                                  (idx - 1 + galleryImages.length) %
                                    galleryImages.length
                                ],
                              );
                            }}
                            title="Previous"
                          >
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="15 18 9 12 15 6" />
                            </svg>
                          </button>
                          {/* Right arrow */}
                          <button
                            aria-label="Next image"
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-black bg-opacity-60 shadow-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-white transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              const idx = galleryImages.indexOf(enlargedImg);
                              setEnlargedImg(
                                galleryImages[(idx + 1) % galleryImages.length],
                              );
                            }}
                            title="Next"
                          >
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </Dialog>
                </section>
              </TabsContent>
              {/* Sites Tab */}
              <TabsContent value="sites">
                {sites.length > 0 ? (
                  <section>
                    <h3 className="font-semibold text-emerald-800 mb-4">
                      Sites to Visit
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-emerald-900">
                      {sites.map((site, i) => (
                        <li key={i}>{site}</li>
                      ))}
                    </ul>
                  </section>
                ) : (
                  <div className="text-gray-500 text-center">
                    No sites listed for this activity.
                  </div>
                )}
              </TabsContent>
              {/* Inclusions & Exclusions Tab */}
              <TabsContent value="inclusions">
                {inclusions.length > 0 || exclusions.length > 0 ? (
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {inclusions.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-emerald-800 mb-2">
                          Inclusions
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-emerald-900">
                          {inclusions.map((inc, i) => (
                            <li key={i}>{inc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {exclusions.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-rose-700 mb-2">
                          Exclusions
                        </h3>
                        <ul className="list-disc pl-5 space-y-1 text-rose-800">
                          {exclusions.map((exc, i) => (
                            <li key={i}>{exc}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </section>
                ) : (
                  <div className="text-gray-500 text-center">
                    No inclusions or exclusions listed for this activity.
                  </div>
                )}
              </TabsContent>
              {/* FAQs Tab */}
              <TabsContent value="faqs">
                {faqs.length > 0 ? (
                  <section className="max-w-2xl mx-auto">
                    <h3 className="font-semibold text-emerald-800 mb-4">
                      Frequently Asked Questions
                    </h3>
                    <Accordion type="single" collapsible>
                      {faqs.map((faq, i) => (
                        <AccordionItem value={String(i)} key={i}>
                          <AccordionTrigger>{faq.q}</AccordionTrigger>
                          <AccordionContent>{faq.a}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </section>
                ) : (
                  <div className="text-gray-500 text-center">
                    No FAQs available.
                  </div>
                )}
              </TabsContent>
              {/* Terms & Disclaimer Tab */}
              <TabsContent value="terms">
                <section className="max-w-2xl mx-auto">
                  {activity.terms_and_conditions && (
                    <Accordion type="single" collapsible defaultValue="terms">
                      <AccordionItem value="terms">
                        <AccordionTrigger>
                          Terms and Conditions
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="text-gray-700 whitespace-pre-line">
                            {activity.terms_and_conditions}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                  {activity.disclaimer && (
                    <Accordion
                      type="single"
                      collapsible
                      defaultValue="disclaimer"
                    >
                      <AccordionItem value="disclaimer">
                        <AccordionTrigger>Disclaimer</AccordionTrigger>
                        <AccordionContent>
                          <div className="text-gray-700 whitespace-pre-line">
                            {activity.disclaimer}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                  {!(activity.terms_and_conditions || activity.disclaimer) && (
                    <div className="text-gray-500 text-center">
                      No terms or disclaimer available.
                    </div>
                  )}
                </section>
              </TabsContent>
            </Tabs>
          </div>
          {/* Sidebar: Vehicle Options & Booking (always visible) */}
          <div className="bg-white rounded-xl shadow-sm border border-emerald-50 p-6 flex flex-col gap-4 min-w-[270px] max-w-md mx-auto md:mx-0 mt-8 md:mt-0">
            <h3 className="text-lg font-bold text-emerald-900 mb-4">
              Available Vehicles
            </h3>
            {activity.vehicle_prices &&
              Object.entries(activity.vehicle_prices)
                .sort((a, b) => Number(a[1]) - Number(b[1])) // Sort by price ascending
                .map(([vehicleId, price]) => {
                  const vehicle = vehicles.find((v) => v.id === vehicleId);
                  if (!vehicle) return null;
                  return (
                    <label
                      key={vehicleId}
                      className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition ${selectedVehicleId === vehicleId ? "border-emerald-600 bg-emerald-50" : "border-gray-200 bg-white hover:bg-emerald-50/60"}`}
                    >
                      <input
                        type="radio"
                        name="vehicle"
                        value={vehicleId}
                        checked={selectedVehicleId === vehicleId}
                        onChange={() => setSelectedVehicleId(vehicleId)}
                        className="accent-emerald-600 w-5 h-5"
                      />
                      {vehicle.vehicle_image && (
                        <img
                          src={vehicle.vehicle_image}
                          alt={vehicle.vehicle_name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-emerald-900">
                          {vehicle.vehicle_name}{" "}
                          <span className="text-xs text-gray-500">
                            ({vehicle.capacity} people)
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {vehicle.vehicle_type}
                        </div>
                      </div>
                      <div className="text-base font-bold text-yellow-700">
                        {convertFromINR(Number(price) || 0, currency).symbol}
                        {convertFromINR(
                          Number(price) || 0,
                          currency,
                        ).value.toLocaleString()}
                      </div>
                    </label>
                  );
                })}
            <Button
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
              onClick={() => setBookingModalOpen(true)}
              disabled={!selectedVehicleId}
            >
              Book This Vehicle
            </Button>
            <BookingModal
              open={bookingModalOpen}
              onOpenChange={setBookingModalOpen}
              activity={activity}
              vehicles={vehicles}
              selectedVehicleId={selectedVehicleId}
              setSelectedVehicleId={setSelectedVehicleId}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ZiarathActivityDetail;
