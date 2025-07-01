import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Plane, MapPin, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
// import emailjs from 'emailjs-com';

const GroupFlights = () => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengerCount, setPassengerCount] = useState("10");
  const [tripType, setTripType] = useState("round-trip");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [triedSubmit, setTriedSubmit] = React.useState(false);

  const popularRoutes = [
    { from: "Delhi", to: "Jeddah", price: "Starting from $450" },
    { from: "Mumbai", to: "Jeddah", price: "Starting from $420" },
    { from: "Bangalore", to: "Jeddah", price: "Starting from $480" },
    { from: "Hyderabad", to: "Jeddah", price: "Starting from $460" },
    { from: "Chennai", to: "Jeddah", price: "Starting from $470" },
    { from: "Ahmedabad", to: "Jeddah", price: "Starting from $440" },
    { from: "Calicut", to: "Jeddah", price: "Starting from $490" },
    { from: "Lucknow", to: "Jeddah", price: "Starting from $465" },
    { from: "Kolkata", to: "Jeddah", price: "Starting from $485" },
    { from: "Delhi", to: "Madinah", price: "Starting from $470" },
    { from: "Mumbai", to: "Madinah", price: "Starting from $440" },
    { from: "Bangalore", to: "Madinah", price: "Starting from $500" },
    { from: "Hyderabad", to: "Madinah", price: "Starting from $480" },
    { from: "Chennai", to: "Madinah", price: "Starting from $490" },
    { from: "Ahmedabad", to: "Madinah", price: "Starting from $460" },
    { from: "Calicut", to: "Madinah", price: "Starting from $510" },
    { from: "Lucknow", to: "Madinah", price: "Starting from $485" },
    { from: "Kolkata", to: "Madinah", price: "Starting from $505" },
  ];

  const handleRouteSelect = (route: { from: string; to: string }) => {
    setFromCity(route.from);
    setToCity(route.to);
  };

  // Date validation helpers
  function getMinDepartureDate() {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  }
  function getMinReturnDate() {
    if (!departureDate) return getMinDepartureDate();
    return departureDate;
  }

  const handleEnquire = async () => {
    setTriedSubmit(true);
    setLoading(true);
    setSuccess("");
    setError("");
    // Validation: required fields
    if (
      !fromCity.trim() ||
      !toCity.trim() ||
      !contactEmail.trim() ||
      !contactPhone.trim()
    ) {
      setError(
        "Please fill in all required fields: From, To, Email, and Phone number.",
      );
      return;
    }
    // Validate dates
    const today = new Date();
    const minDeparture = new Date();
    minDeparture.setDate(today.getDate() + 2);
    const depDate = new Date(departureDate);
    const retDate = returnDate ? new Date(returnDate) : null;
    if (depDate < minDeparture) {
      setError("Departure date must be at least 2 days from today.");
      setLoading(false);
      return;
    }
    if (tripType === "round-trip" && retDate && retDate < depDate) {
      setError("Return date cannot be earlier than departure date.");
      setLoading(false);
      return;
    }
    try {
      // Save to Supabase
      const { error: dbError } = await supabase
        .from("group_flight_inquiries")
        .insert({
          from_city: fromCity,
          to_city: toCity,
          departure_date: departureDate || null,
          return_date: returnDate || null,
          passenger_count: parseInt(passengerCount, 10),
          trip_type: tripType,
          contact_email: contactEmail,
          contact_phone: contactPhone,
        });
      if (dbError) throw dbError;
      // Call Supabase Edge Function to send email
      console.log("Calling edge function...");
      // Debug: log the anon key to ensure it's loaded from .env
      console.log(
        "VITE_SUPABASE_ANON_KEY:",
        import.meta.env.VITE_SUPABASE_ANON_KEY,
      );
      const emailRes = await fetch(
        "https://rjyhoikoqhephrkjgebo.supabase.co/functions/v1/send-group-flight-inquiry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            from_city: fromCity,
            to_city: toCity,
            departure_date: departureDate,
            return_date: returnDate,
            passenger_count: passengerCount,
            trip_type: tripType,
            contact_email: contactEmail,
            contact_phone: contactPhone,
          }),
        },
      );
      const emailResult = await emailRes.json();
      console.log("Edge function response:", emailResult);
      if (!emailResult.success)
        throw new Error(emailResult.error || "Email sending failed");
      setSuccess(
        "Your group flight inquiry has been submitted! Our team will contact you soon.",
      );
      setFromCity("");
      setToCity("");
      setDepartureDate("");
      setReturnDate("");
      setPassengerCount("10");
      setTripType("round-trip");
      setContactEmail("");
      setContactPhone("");
    } catch (err: unknown) {
      setError(
        "Sorry, there was a problem submitting your inquiry. Please try again.",
      );
      console.error("Inquiry error:", err);
    } finally {
      setLoading(false);
    }
  };

  function formatDateDisplay(dateStr: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Group Flight Bookings
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Special rates for group travel to Saudi Arabia for Umrah pilgrimage
          </p>
          <Badge className="bg-amber-100 text-amber-800 px-4 py-2 text-lg">
            ✈️ Minimum 10 Passengers Required
          </Badge>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plane className="w-6 h-6 text-emerald-600" />
              <span>Search Group Flights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Trip Type
                </label>
                <Select value={tripType} onValueChange={setTripType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round-trip">Round Trip</SelectItem>
                    <SelectItem value="one-way">One Way</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  From City <span className="text-red-600">*</span>
                </label>
                <Input
                  placeholder="Enter departure city"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className={
                    triedSubmit && !fromCity.trim() ? "border-red-500" : ""
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  To City <span className="text-red-600">*</span>
                </label>
                <Input
                  placeholder="Enter destination city"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className={
                    triedSubmit && !toCity.trim() ? "border-red-500" : ""
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Passengers
                </label>
                <Select
                  value={passengerCount}
                  onValueChange={setPassengerCount}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 41 }, (_, i) => i + 10).map(
                      (count) => (
                        <SelectItem
                          key={`passengers-${count}`}
                          value={count.toString()}
                        >
                          {count} Passengers
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Departure Date
                </label>
                <Input
                  type="date"
                  value={departureDate}
                  min={getMinDepartureDate()}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  required
                />
                {departureDate && (
                  <div className="text-xs text-gray-500 mt-1">
                    Selected: {formatDateDisplay(departureDate)}
                  </div>
                )}
              </div>

              {tripType === "round-trip" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Return Date
                  </label>
                  <Input
                    type="date"
                    value={returnDate}
                    min={getMinReturnDate()}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                  />
                  {returnDate && (
                    <div className="text-xs text-gray-500 mt-1">
                      Selected: {formatDateDisplay(returnDate)}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Contact Email <span className="text-red-600">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  className={
                    triedSubmit && !contactEmail.trim() ? "border-red-500" : ""
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Contact Phone <span className="text-red-600">*</span>
                </label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className={
                    triedSubmit && !contactPhone.trim() ? "border-red-500" : ""
                  }
                />
              </div>
            </div>

            <Button
              onClick={handleEnquire}
              className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 px-8 py-3"
              size="lg"
              disabled={loading}
            >
              <Plane className="w-5 h-5 mr-2" />
              Enquire Now
            </Button>
            {success && (
              <div className="text-green-600 text-sm mt-4">{success}</div>
            )}
            {error && <div className="text-red-600 text-sm mt-4">{error}</div>}
          </CardContent>
        </Card>

        {/* Popular Routes Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Popular Group Flight Routes
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Click on any route to automatically fill your search form
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularRoutes.map((route, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-emerald-500"
                onClick={() => handleRouteSelect(route)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-gray-900">
                        {route.from}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-gray-900">
                        {route.to}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-emerald-600 font-medium">
                    {route.price}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to select this route
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Group Discounts
              </h3>
              <p className="text-sm text-gray-600">
                Special discounted rates for groups of 10 or more passengers
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Flexible Dates
              </h3>
              <p className="text-sm text-gray-600">
                Choose from multiple departure dates that suit your group
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Direct Flights
              </h3>
              <p className="text-sm text-gray-600">
                Convenient direct flights to Jeddah and Madinah from major
                Indian cities
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GroupFlights;
