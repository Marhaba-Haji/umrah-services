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

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("activities")
        .select("*")
        .eq("slug", slug)
        .single();
      setActivity(data);
      // Fetch related activities (same city, not this one, and not 'Umrah Tawaf and Sa\'i')
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

  // Features (example: parse from description or use static for now)
  const features = [
    "AC Vehicle",
    "Snacks Provided",
    "English/Urdu Guide",
    "VIP Access",
    "Flexible Timings",
    "Instant Booking",
  ];

  // Gallery (for now, just featured_image)
  const images = [activity.featured_image || "/public/placeholder.svg"];

  // Quick facts
  const quickFacts = [
    { icon: Clock, label: "Duration", value: activity.duration || "N/A" },
    {
      icon: Users,
      label: "Capacity",
      value:
        vehicles.length > 0
          ? Math.max(...vehicles.map((v) => v.capacity || 0))
          : "N/A",
    },
    { icon: Star, label: "Luxury", value: "Yes" },
    { icon: MapPin, label: "City", value: activity.city },
    {
      icon: Star,
      label: "Featured",
      value: activity.is_featured ? "Yes" : "No",
    },
  ];

  // Price
  const minPrice = activity.vehicle_prices
    ? Math.min(...Object.values(activity.vehicle_prices).map(Number))
    : activity.price;

  return (
    <div className="min-h-screen bg-[#f6f8f7]">
      <Header />
      {/* Hero Section */}
      <div className="relative w-full h-[320px] md:h-[420px] flex items-end bg-emerald-900/80 overflow-hidden shadow-sm">
        <img
          src={images[0]}
          alt={activity.name}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 p-8 w-full max-w-5xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
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
            </div>
          </div>
        </div>
      </div>
      {/* Trust Bar */}
      <div className="max-w-5xl mx-auto mt-[-1.5rem] relative z-20 px-4">
        <TrustBar />
      </div>
      {/* Description & Features */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 my-12 px-4">
        <div className="md:col-span-2">
          <div
            className="text-base text-gray-700 mb-6 leading-relaxed"
            style={{ wordBreak: "break-word" }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: activity.description || "" }}
            />
          </div>
          <FeatureGrid features={features} />
        </div>
        {/* Vehicle Options */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-50 p-6 flex flex-col gap-4 min-w-[270px] max-w-md mx-auto md:mx-0">
          <h3 className="text-lg font-bold text-emerald-900 mb-2">
            Available Vehicles
          </h3>
          {activity.vehicle_prices &&
            Object.entries(activity.vehicle_prices).map(
              ([vehicleId, price]) => {
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
                      ₹{Number(price).toLocaleString("en-IN")}
                    </div>
                  </label>
                );
              },
            )}
          <Button
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
            onClick={() => setBookingModalOpen(true)}
            disabled={!selectedVehicleId}
          >
            Book This Vehicle
          </Button>
        </div>
      </div>
      {/* Booking Modal */}
      <BookingModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        activity={activity}
        vehicles={vehicles}
        selectedVehicleId={selectedVehicleId}
        setSelectedVehicleId={setSelectedVehicleId}
      />
      {/* Reviews */}
      <ReviewsCarousel />
      {/* FAQ */}
      <FAQAccordion />
      {/* Related Activities */}
      <RelatedActivities related={related} />
      <Footer />
    </div>
  );
};

export default ZiarathActivityDetail;
