import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Users, Plane, Hotel, Star, ChevronRight, Plus, Minus, Check, Clock, AlertCircle, CalendarDays, Bed, FileText, Car, UserCheck, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '@/integrations/supabase/client';
import FlightStep from '../components/FlightStep';

const BuildYourOwnUmrah = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [activities, setActivities] = useState([]);
  const [visas, setVisas] = useState([]);
  const [transports, setTransports] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [packageData, setPackageData] = useState({
    duration: 7,
    customDuration: '',
    travelers: {
      adults: 2,
      children: 0,
      infants: 0
    },
    departureCity: '',
    selectedHotels: { 
      makkah: null, 
      madinah: null 
    },
    hotelBookingDetails: {
      makkah: {
        rooms: 1,
        guestsPerRoom: 2,
        checkIn: '',
        checkOut: ''
      },
      madinah: {
        rooms: 1,
        guestsPerRoom: 2,
        checkIn: '',
        checkOut: ''
      }
    },
    flightSearch: {
      departure: '',
      destination: 'JED', // Jeddah default
      departureDate: '',
      returnDate: '',
      tripType: 'round-trip'
    },
    selectedFlight: null,
    selectedVisa: null,
    selectedTransports: [],
    selectedGuide: null,
    selectedActivities: [],
    mealPlan: 'breakfast',
    totalCost: 0
  });

  const steps = [
    { id: 1, title: 'Duration', icon: Calendar, desc: 'Pick your stay' },
    { id: 2, title: 'Travelers', icon: Users, desc: 'Group size' },
    { id: 3, title: 'Flights', icon: Plane, desc: 'Search flights' },
    { id: 4, title: 'Makkah Hotel', icon: Hotel, desc: 'Choose Makkah stay' },
    { id: 5, title: 'Madinah Hotel', icon: Hotel, desc: 'Choose Madinah stay' },
    { id: 6, title: 'Visa', icon: FileText, desc: 'Select visa type' },
    { id: 7, title: 'Transport', icon: Car, desc: 'Local transport' },
    { id: 8, title: 'Guide', icon: UserCheck, desc: 'Tour guide' },
    { id: 9, title: 'Activities', icon: MapPin, desc: 'Add experiences' },
    { id: 10, title: 'Review', icon: Check, desc: 'Finalize package' }
  ];

  useEffect(() => {
    fetchHotels();
    fetchActivities();
    fetchVisas();
    fetchTransports();
    fetchGuides();
  }, []);

  const fetchHotels = async () => {
    const { data } = await supabase.from('hotels').select('*').limit(10);
    if (data) setHotels(data);
  };

  const fetchActivities = async () => {
    const { data } = await supabase.from('activities').select('*').limit(8);
    if (data) setActivities(data);
  };

  const fetchVisas = async () => {
    const { data } = await supabase.from('saudi_visas').select('*').eq('status', 'active');
    if (data) setVisas(data);
  };

  const fetchTransports = async () => {
    const { data } = await supabase.from('transport_services').select('*').eq('is_active', true);
    if (data) setTransports(data);
  };

  const fetchGuides = async () => {
    const { data } = await supabase.from('guide_services').select('*').eq('status', 'active');
    if (data) setGuides(data);
  };

  const calculateTotalCost = () => {
    let baseCost = packageData.duration * (packageData.travelers.adults + packageData.travelers.children) * 150;
    if (packageData.selectedHotels.makkah) baseCost += 1000;
    if (packageData.selectedHotels.madinah) baseCost += 1000;
    if (packageData.selectedFlight) baseCost += parseFloat(packageData.selectedFlight.price?.total || 0);
    if (packageData.selectedVisa) baseCost += parseFloat(packageData.selectedVisa.price || 0);
    if (packageData.selectedTransports && packageData.selectedTransports.length > 0) baseCost += packageData.selectedTransports.reduce((sum, t) => sum + parseFloat(t.price || 0), 0);
    if (packageData.selectedGuide) baseCost += 500; // Base guide cost
    baseCost += packageData.selectedActivities.length * 200;
    return baseCost;
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const StepIndicator = () => {
    const step = steps[currentStep - 1];
    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
    const StepIcon = step.icon;
    return (
      <div className="sticky top-0 z-10 px-4 py-4 mb-4">
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-5 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl font-bold text-gray-900">Build Your Umrah</span>
            <span className="bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-full text-sm">Step {currentStep} of {steps.length}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
            <div className="h-2 bg-emerald-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <StepIcon className="w-7 h-7 text-emerald-600" />
            <span className="text-lg font-semibold text-gray-900">{step.title}</span>
          </div>
        </div>
      </div>
    );
  };

  const DurationStep = () => (
    <div className="px-4 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">How long is your journey?</h2>
        <p className="text-gray-600">Choose the perfect duration for your Umrah</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {[3, 5, 7, 10, 14, 21].map(days => (
          <button
            key={days}
            onClick={() => setPackageData({ ...packageData, duration: days, customDuration: '' })}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              packageData.duration === days && !packageData.customDuration
                ? 'border-emerald-500 bg-emerald-50 shadow-md scale-105'
                : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-900">{days}</div>
              <div className="text-sm text-gray-600">Days</div>
              <div className="text-xs text-emerald-600 mt-1">
                {days === 3 ? 'Quick' : days === 5 ? 'Short' : days === 7 ? 'Popular' : days === 10 ? 'Comfort' : days === 14 ? 'Complete' : 'Extended'}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Custom Duration</h4>
        <div className="flex items-center space-x-3">
          <Input
            type="number"
            placeholder="Enter days"
            value={packageData.customDuration}
            onChange={(e) => setPackageData({ 
              ...packageData, 
              customDuration: e.target.value,
              duration: parseInt(e.target.value) || 7
            })}
            className="flex-1"
            min="1"
            max="90"
          />
          <span className="text-sm text-gray-600">days</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Enter any number of days between 1-90</p>
      </div>

      <div className="bg-emerald-50 rounded-xl p-4 mt-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-emerald-900 text-sm">Recommended Duration</h4>
            <p className="text-emerald-700 text-sm leading-relaxed">
              10-14 days allows time for both Makkah and Madinah with comfortable Ziyarah visits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const TravelersStep = () => (
    <div className="px-4 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">Who's traveling?</h2>
        <p className="text-gray-600">Select your group size</p>
      </div>

      <div className="space-y-4">
        {/* Adults Counter */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Adults</h4>
              <p className="text-sm text-gray-600">Age 12+</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPackageData({ 
                  ...packageData, 
                  travelers: { 
                    ...packageData.travelers, 
                    adults: Math.max(1, packageData.travelers.adults - 1) 
                  }
                })}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-bold text-emerald-900 w-8 text-center">{packageData.travelers.adults}</span>
              <button
                onClick={() => setPackageData({ 
                  ...packageData, 
                  travelers: { 
                    ...packageData.travelers, 
                    adults: packageData.travelers.adults + 1 
                  }
                })}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Children Counter */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Children</h4>
              <p className="text-sm text-gray-600">Age 2-11 (without bed)</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPackageData({ 
                  ...packageData, 
                  travelers: { 
                    ...packageData.travelers, 
                    children: Math.max(0, packageData.travelers.children - 1) 
                  }
                })}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-bold text-emerald-900 w-8 text-center">{packageData.travelers.children}</span>
              <button
                onClick={() => setPackageData({ 
                  ...packageData, 
                  travelers: { 
                    ...packageData.travelers, 
                    children: packageData.travelers.children + 1 
                  }
                })}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Infants Counter */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Infants</h4>
              <p className="text-sm text-gray-600">Under 2 years</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPackageData({ 
                  ...packageData, 
                  travelers: { 
                    ...packageData.travelers, 
                    infants: Math.max(0, packageData.travelers.infants - 1) 
                  }
                })}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-bold text-emerald-900 w-8 text-center">{packageData.travelers.infants}</span>
              <button
                onClick={() => setPackageData({ 
                  ...packageData, 
                  travelers: { 
                    ...packageData.travelers, 
                    infants: packageData.travelers.infants + 1 
                  }
                })}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4">
          <div className="text-center">
            <h4 className="font-semibold text-emerald-900">Total Travelers</h4>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {packageData.travelers.adults + packageData.travelers.children + packageData.travelers.infants}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const FlightSearchStep = () => (
    <div className="px-4 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">Flights</h2>
        <p className="text-gray-600">Search and select your flights</p>
      </div>

      <FlightStep 
        onFlightSelect={(flight) => {
          setPackageData({ ...packageData, selectedFlight: flight });
          nextStep();
        }}
        initialAdults={packageData.travelers.adults}
        initialChildren={packageData.travelers.children}
        initialInfants={packageData.travelers.infants}
      />
    </div>
  );

  const HotelStep = ({ city, title, description }) => (
    <div className="px-4 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Room and Date Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Bed className="w-5 h-5 mr-2" />
          Room Configuration
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPackageData({
                  ...packageData,
                  hotelBookingDetails: {
                    ...packageData.hotelBookingDetails,
                    [city]: {
                      ...packageData.hotelBookingDetails[city],
                      rooms: Math.max(1, packageData.hotelBookingDetails[city].rooms - 1)
                    }
                  }
                })}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-lg font-semibold text-emerald-900 w-6 text-center">
                {packageData.hotelBookingDetails[city].rooms}
              </span>
              <button
                onClick={() => setPackageData({
                  ...packageData,
                  hotelBookingDetails: {
                    ...packageData.hotelBookingDetails,
                    [city]: {
                      ...packageData.hotelBookingDetails[city],
                      rooms: packageData.hotelBookingDetails[city].rooms + 1
                    }
                  }
                })}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Guests per Room</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPackageData({
                  ...packageData,
                  hotelBookingDetails: {
                    ...packageData.hotelBookingDetails,
                    [city]: {
                      ...packageData.hotelBookingDetails[city],
                      guestsPerRoom: Math.max(1, packageData.hotelBookingDetails[city].guestsPerRoom - 1)
                    }
                  }
                })}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-lg font-semibold text-emerald-900 w-6 text-center">
                {packageData.hotelBookingDetails[city].guestsPerRoom}
              </span>
              <button
                onClick={() => setPackageData({
                  ...packageData,
                  hotelBookingDetails: {
                    ...packageData.hotelBookingDetails,
                    [city]: {
                      ...packageData.hotelBookingDetails[city],
                      guestsPerRoom: packageData.hotelBookingDetails[city].guestsPerRoom + 1
                    }
                  }
                })}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
            <Input
              type="date"
              value={packageData.hotelBookingDetails[city].checkIn}
              onChange={(e) => setPackageData({
                ...packageData,
                hotelBookingDetails: {
                  ...packageData.hotelBookingDetails,
                  [city]: {
                    ...packageData.hotelBookingDetails[city],
                    checkIn: e.target.value
                  }
                }
              })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
            <Input
              type="date"
              value={packageData.hotelBookingDetails[city].checkOut}
              onChange={(e) => setPackageData({
                ...packageData,
                hotelBookingDetails: {
                  ...packageData.hotelBookingDetails,
                  [city]: {
                    ...packageData.hotelBookingDetails[city],
                    checkOut: e.target.value
                  }
                }
              })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Hotel Selection */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg text-emerald-900 capitalize flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Available Hotels
        </h3>
        <div className="space-y-3">
          {hotels.filter(hotel => hotel.city?.toLowerCase() === city).slice(0, 4).map(hotel => (
            <button
              key={hotel.id}
              onClick={() => setPackageData({
                ...packageData,
                selectedHotels: { ...packageData.selectedHotels, [city]: hotel }
              })}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                packageData.selectedHotels[city]?.id === hotel.id
                  ? 'border-emerald-500 bg-emerald-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3">
                <img
                  src={hotel.featured_image || '/placeholder.svg'}
                  alt={hotel.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = '/placeholder.svg'; }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-emerald-900 truncate">{hotel.name}</h4>
                  <div className="flex items-center mt-1">
                    {[...Array(hotel.rating || 3)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {hotel.distance_from_haram || hotel.distance_from_masjid_e_nabawi || 'Near Holy Site'}
                  </p>
                  <div className="text-sm font-semibold text-emerald-600 mt-1">
                    ₹{hotel.price_per_night || 5000}/night
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const VisaStep = () => (
    <div className="px-4 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">Select Visa Type</h2>
        <p className="text-gray-600">Choose the appropriate visa for your journey</p>
      </div>

      <div className="space-y-3">
        {visas.map(visa => (
          <button
            key={visa.id}
            onClick={() => setPackageData({ ...packageData, selectedVisa: visa })}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              packageData.selectedVisa?.id === visa.id
                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-emerald-900">{visa.visa_type}</h4>
                <p className="text-sm text-gray-600 mt-1">{visa.visa_category}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>⏱ {visa.processing_time}</span>
                  <span>📅 {visa.visa_validity}</span>
                  <span>🔁 {visa.number_of_entries}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-600">₹{visa.price}</div>
                {packageData.selectedVisa?.id === visa.id && (
                  <Check className="w-5 h-5 text-emerald-600 mt-1 ml-auto" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const TransportStep = () => (
    <div className="px-4 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">Local Transport</h2>
        <p className="text-gray-600">Choose your transportation options</p>
      </div>

      <div className="space-y-3">
        {transports.map(transport => {
          const isSelected = packageData.selectedTransports.some(t => t.id === transport.id);
          return (
            <button
              key={transport.id}
              onClick={() => {
                setPackageData({
                  ...packageData,
                  selectedTransports: isSelected
                    ? packageData.selectedTransports.filter(t => t.id !== transport.id)
                    : [...packageData.selectedTransports, transport]
                });
              }}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3">
                <img
                  src={transport.vehicle_image || '/placeholder.svg'}
                  alt={transport.vehicle_name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = '/placeholder.svg'; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-emerald-900">{transport.vehicle_name}</h4>
                      <p className="text-sm text-gray-600">{transport.route}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{transport.vehicle_type}</Badge>
                        <span className="text-xs text-gray-500">👥 {transport.capacity} people</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-600">₹{transport.price}</div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-emerald-600 mt-1" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const GuideStep = () => (
    <div className="px-4 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">Tour Guide</h2>
        <p className="text-gray-600">Choose an experienced guide for your journey</p>
      </div>

      <div className="space-y-3">
        {guides.map(guide => (
          <button
            key={guide.id}
            onClick={() => setPackageData({ ...packageData, selectedGuide: guide })}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              packageData.selectedGuide?.id === guide.id
                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start space-x-3">
              <img
                src={guide.guide_photo || '/placeholder.svg'}
                alt={guide.guide_name}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                onError={(e) => { e.target.src = '/placeholder.svg'; }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-emerald-900">{guide.guide_name}</h4>
                    <p className="text-sm text-gray-600">{guide.guide_city}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(Math.floor(guide.rating || 4))].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">({guide.rating || 4.0})</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {guide.languages?.slice(0, 2).map(lang => (
                        <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                  {packageData.selectedGuide?.id === guide.id && (
                    <Check className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const ActivitiesStep = () => (
    <div className="px-4 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">Add experiences</h2>
        <p className="text-gray-600">Enhance your spiritual journey</p>
      </div>

      <div className="space-y-3">
        {activities.map(activity => (
          <button
            key={activity.id}
            onClick={() => {
              const isSelected = packageData.selectedActivities.includes(activity.id);
              setPackageData({
                ...packageData,
                selectedActivities: isSelected
                  ? packageData.selectedActivities.filter(id => id !== activity.id)
                  : [...packageData.selectedActivities, activity.id]
              });
            }}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              packageData.selectedActivities.includes(activity.id)
                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start space-x-3">
              <img
                src={activity.featured_image || '/placeholder.svg'}
                alt={activity.name}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                onError={(e) => { e.target.src = '/placeholder.svg'; }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-emerald-900">{activity.name}</h4>
                  {packageData.selectedActivities.includes(activity.id) && (
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{activity.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="text-xs">{activity.city}</Badge>
                  <span className="text-sm font-semibold text-emerald-600">₹{activity.price || 200}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const ReviewStep = () => {
    const totalCost = calculateTotalCost();
    
    return (
      <div className="px-4 space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">Review your package</h2>
          <p className="text-gray-600">Confirm your custom Umrah journey</p>
        </div>

        <div className="space-y-4">
          {/* Duration Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Duration</h4>
                  <p className="text-sm text-gray-600">
                    {packageData.customDuration ? `${packageData.customDuration} days (custom)` : `${packageData.duration} days journey`}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)}>Edit</Button>
            </div>
          </div>

          {/* Travelers Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">Travelers</h4>
                  <p className="text-sm text-gray-600">
                    {packageData.travelers.adults} adults, {packageData.travelers.children} children, {packageData.travelers.infants} infants
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)}>Edit</Button>
            </div>
          </div>

          {/* Flight Summary */}
          {packageData.selectedFlight && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Plane className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Flight</h4>
                    <p className="text-sm text-gray-600">{packageData.selectedFlight.name}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentStep(3)}>Edit</Button>
              </div>
            </div>
          )}

          {/* Hotels Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Hotel className="w-5 h-5 text-emerald-600" />
                <h4 className="font-semibold text-gray-900">Hotels</h4>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(4)}>Edit</Button>
            </div>
            <div className="space-y-2">
              {packageData.selectedHotels.makkah === 'skip' ? (
                <p className="text-sm text-gray-600">Makkah: Skipped</p>
              ) : packageData.selectedHotels.makkah ? (
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Makkah: {packageData.selectedHotels.makkah.name}</p>
                  <p className="text-gray-600">
                    {packageData.hotelBookingDetails.makkah.rooms} room(s), {packageData.hotelBookingDetails.makkah.guestsPerRoom} guests each
                  </p>
                  {packageData.hotelBookingDetails.makkah.checkIn && (
                    <p className="text-gray-600">
                      {packageData.hotelBookingDetails.makkah.checkIn} to {packageData.hotelBookingDetails.makkah.checkOut}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">Makkah: Not selected</p>
              )}
              
              {packageData.selectedHotels.madinah === 'skip' ? (
                <p className="text-sm text-gray-600">Madinah: Skipped</p>
              ) : packageData.selectedHotels.madinah ? (
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Madinah: {packageData.selectedHotels.madinah.name}</p>
                  <p className="text-gray-600">
                    {packageData.hotelBookingDetails.madinah.rooms} room(s), {packageData.hotelBookingDetails.madinah.guestsPerRoom} guests each
                  </p>
                  {packageData.hotelBookingDetails.madinah.checkIn && (
                    <p className="text-gray-600">
                      {packageData.hotelBookingDetails.madinah.checkIn} to {packageData.hotelBookingDetails.madinah.checkOut}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">Madinah: Not selected</p>
              )}
            </div>
          </div>

          {/* Services Summary */}
          {(packageData.selectedVisa || (packageData.selectedTransports && packageData.selectedTransports.length > 0) || packageData.selectedGuide) && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Selected Services</h4>
              <div className="space-y-2 text-sm">
                {packageData.selectedVisa && (
                  <p><span className="font-medium">Visa:</span> {packageData.selectedVisa.visa_type}</p>
                )}
                {packageData.selectedTransports && packageData.selectedTransports.length > 0 && (
                  <p><span className="font-medium">Transport:</span> {packageData.selectedTransports.map(t => t.vehicle_name).join(', ')}</p>
                )}
                {packageData.selectedGuide && (
                  <p><span className="font-medium">Guide:</span> {packageData.selectedGuide.guide_name}</p>
                )}
              </div>
            </div>
          )}

          {/* Activities Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h4 className="font-semibold text-gray-900">Activities</h4>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(9)}>Edit</Button>
            </div>
            <p className="text-sm text-gray-600">{packageData.selectedActivities.length} experiences selected</p>
          </div>

          {/* Cost Summary */}
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
            <h4 className="font-semibold text-emerald-900 mb-3">Cost Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Base package ({packageData.customDuration || packageData.duration} days × {packageData.travelers.adults + packageData.travelers.children} travelers)</span>
                <span>₹{((packageData.customDuration ? parseInt(packageData.customDuration) : packageData.duration) * (packageData.travelers.adults + packageData.travelers.children) * 150).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Hotels</span>
                <span>₹{((packageData.selectedHotels.makkah && packageData.selectedHotels.makkah !== 'skip' ? 1000 : 0) + (packageData.selectedHotels.madinah && packageData.selectedHotels.madinah !== 'skip' ? 1000 : 0)).toLocaleString()}</span>
              </div>
              {packageData.selectedFlight && (
                <div className="flex justify-between text-sm">
                  <span>Flight</span>
                  <span>₹{parseFloat(packageData.selectedFlight.price?.total || 0).toLocaleString()}</span>
                </div>
              )}
              {packageData.selectedVisa && (
                <div className="flex justify-between text-sm">
                  <span>Visa</span>
                  <span>₹{parseFloat(packageData.selectedVisa.price || 0).toLocaleString()}</span>
                </div>
              )}
              {packageData.selectedTransports && packageData.selectedTransports.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Transport</span>
                  <span>₹{packageData.selectedTransports.reduce((sum, t) => sum + parseFloat(t.price || 0), 0).toLocaleString()}</span>
                </div>
              )}
              {packageData.selectedGuide && (
                <div className="flex justify-between text-sm">
                  <span>Guide</span>
                  <span>₹500</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Activities ({packageData.selectedActivities.length})</span>
                <span>₹{(packageData.selectedActivities.length * 200).toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg text-emerald-900">
                <span>Total</span>
                <span>₹{totalCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <DurationStep />;
      case 2: return <TravelersStep />;
      case 3: return <FlightSearchStep />;
      case 4: return <HotelStep city="makkah" title="Choose Makkah Hotel" description="Select your accommodation in the holy city" />;
      case 5: return <HotelStep city="madinah" title="Choose Madinah Hotel" description="Select your accommodation in the prophet's city" />;
      case 6: return <VisaStep />;
      case 7: return <TransportStep />;
      case 8: return <GuideStep />;
      case 9: return <ActivitiesStep />;
      case 10: return <ReviewStep />;
      default: return <DurationStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />
      
      <div className="pb-20"> {/* Bottom padding for fixed navigation */}
        <StepIndicator />
        
        <div className="max-w-lg mx-auto">
          {renderStep()}
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-pb">
        <div className="max-w-lg mx-auto flex space-x-3">
          {currentStep > 1 && (
            <Button 
              variant="outline" 
              onClick={prevStep}
              className="flex-1 py-3 text-lg font-semibold"
            >
              Back
            </Button>
          )}
          {/* Toggle Skip/Continue for each step */}
          {(() => {
            // Step mapping: step number to selection logic
            if (currentStep === 3) { // Flight
              return packageData.selectedFlight ? (
                <Button onClick={nextStep} className="flex-1 py-3 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90">Continue<ChevronRight className="w-5 h-5 ml-1" /></Button>
              ) : (
                <Button onClick={nextStep} variant="outline" className="flex-1 py-3 text-lg font-semibold">Skip<ChevronRight className="w-5 h-5 ml-1" /></Button>
              );
            }
            if (currentStep === 4) { // Makkah Hotel
              return packageData.selectedHotels.makkah ? (
                <Button onClick={nextStep} className="flex-1 py-3 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90">Continue<ChevronRight className="w-5 h-5 ml-1" /></Button>
              ) : (
                <Button onClick={nextStep} variant="outline" className="flex-1 py-3 text-lg font-semibold">Skip<ChevronRight className="w-5 h-5 ml-1" /></Button>
              );
            }
            if (currentStep === 5) { // Madinah Hotel
              return packageData.selectedHotels.madinah ? (
                <Button onClick={nextStep} className="flex-1 py-3 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90">Continue<ChevronRight className="w-5 h-5 ml-1" /></Button>
              ) : (
                <Button onClick={nextStep} variant="outline" className="flex-1 py-3 text-lg font-semibold">Skip<ChevronRight className="w-5 h-5 ml-1" /></Button>
              );
            }
            if (currentStep === 6) { // Visa
              return packageData.selectedVisa ? (
                <Button onClick={nextStep} className="flex-1 py-3 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90">Continue<ChevronRight className="w-5 h-5 ml-1" /></Button>
              ) : (
                <Button onClick={nextStep} variant="outline" className="flex-1 py-3 text-lg font-semibold">Skip<ChevronRight className="w-5 h-5 ml-1" /></Button>
              );
            }
            if (currentStep === 7) { // Transport
              return packageData.selectedTransports && packageData.selectedTransports.length > 0 ? (
                <Button onClick={nextStep} className="flex-1 py-3 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90">Continue<ChevronRight className="w-5 h-5 ml-1" /></Button>
              ) : (
                <Button onClick={nextStep} variant="outline" className="flex-1 py-3 text-lg font-semibold">Skip<ChevronRight className="w-5 h-5 ml-1" /></Button>
              );
            }
            if (currentStep === 8) { // Guide
              return packageData.selectedGuide ? (
                <Button onClick={nextStep} className="flex-1 py-3 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90">Continue<ChevronRight className="w-5 h-5 ml-1" /></Button>
              ) : (
                <Button onClick={nextStep} variant="outline" className="flex-1 py-3 text-lg font-semibold">Skip<ChevronRight className="w-5 h-5 ml-1" /></Button>
              );
            }
            if (currentStep === 9) { // Activities
              return packageData.selectedActivities && packageData.selectedActivities.length > 0 ? (
                <Button onClick={nextStep} className="flex-1 py-3 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90">Continue<ChevronRight className="w-5 h-5 ml-1" /></Button>
              ) : (
                <Button onClick={nextStep} variant="outline" className="flex-1 py-3 text-lg font-semibold">Skip<ChevronRight className="w-5 h-5 ml-1" /></Button>
              );
            }
            // Default for other steps
            return (
              <Button 
                onClick={currentStep === steps.length ? () => alert('Package created!') : nextStep}
                className="flex-1 py-3 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90"
              >
                {currentStep === steps.length ? 'Create Package' : 'Continue'}
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            );
          })()}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BuildYourOwnUmrah;
