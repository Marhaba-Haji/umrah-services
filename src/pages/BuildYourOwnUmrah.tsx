
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Plane, Building2, FileText, Car, MapPin, User, CheckCircle, Star, Calendar, Users, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SERVICE_TYPES = [
  { 
    key: 'flight', 
    label: 'Flights', 
    icon: Plane, 
    description: 'Round-trip & one-way flights',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100'
  },
  { 
    key: 'hotel', 
    label: 'Hotels', 
    icon: Building2, 
    description: 'Makkah & Madinah accommodations',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100'
  },
  { 
    key: 'visa', 
    label: 'Visa', 
    icon: FileText, 
    description: 'Umrah visa processing',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100'
  },
  { 
    key: 'transport', 
    label: 'Transport', 
    icon: Car, 
    description: 'Airport transfers & intercity travel',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100'
  },
  { 
    key: 'ziarath', 
    label: 'Ziarath Tours', 
    icon: MapPin, 
    description: 'Historical & religious site visits',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50 hover:bg-teal-100'
  },
  { 
    key: 'guide', 
    label: 'Guide Services', 
    icon: User, 
    description: 'Professional multilingual guides',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100'
  },
];

// Mock data for each service type
const MOCK_FLIGHTS = [
  { id: 'f1', from: 'JED', to: 'MED', date: '2024-08-01', airline: 'Saudia', price: 350, duration: '1h 30m', type: 'Direct' },
  { id: 'f2', from: 'JED', to: 'MED', date: '2024-08-01', airline: 'Flynas', price: 290, duration: '2h 15m', type: '1 Stop' },
];
const MOCK_HOTELS = [
  { id: 'h1', city: 'Makkah', name: 'Hilton Suites Makkah', price: 120, rating: 4.8, distance: '200m from Haram' },
  { id: 'h2', city: 'Madinah', name: 'Pullman Zamzam Madinah', price: 110, rating: 4.6, distance: '150m from Prophet\'s Mosque' },
];
const MOCK_VISAS = [
  { id: 'v1', type: 'Umrah Visa', nationality: 'India', price: 100, processing: '3-5 days' },
  { id: 'v2', type: 'Umrah Visa', nationality: 'Pakistan', price: 110, processing: '5-7 days' },
];
const MOCK_TRANSPORTS = [
  { id: 't1', type: 'Private Car', route: 'JED Airport - Makkah', price: 80, capacity: '4 passengers' },
  { id: 't2', type: 'Luxury Bus', route: 'Makkah - Madinah', price: 50, capacity: '45 passengers' },
];
const MOCK_ZIARATHS = [
  { id: 'z1', city: 'Makkah', name: 'Cave of Hira Tour', price: 40, duration: '4 hours' },
  { id: 'z2', city: 'Madinah', name: 'Uhud Mountain & Battlefield', price: 35, duration: '3 hours' },
];
const MOCK_GUIDES = [
  { id: 'g1', language: 'English', name: 'Ahmed Al-Saudi', price: 60, experience: '5+ years', rating: 4.9 },
  { id: 'g2', language: 'Urdu', name: 'Bilal Hassan', price: 55, experience: '3+ years', rating: 4.7 },
];

function useAirports() {
  const [airports, setAirports] = useState([]);
  useEffect(() => {
    fetch('/airports.json')
      .then(res => res.json())
      .then(setAirports)
      .catch(() => setAirports([]));
  }, []);
  return airports;
}

function AirportAutoSuggest({ value, onChange, airports, placeholder }) {
  const [input, setInput] = useState(value || '');
  const [show, setShow] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const ref = useRef();

  useEffect(() => {
    if (input.length < 2) {
      setFiltered([]);
      return;
    }
    const q = input.toLowerCase();
    setFiltered(
      airports.filter(a =>
        a.code.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q)
      ).slice(0, 10)
    );
  }, [input, airports]);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setShow(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Input
        value={input}
        placeholder={placeholder}
        onChange={e => {
          setInput(e.target.value);
          onChange('');
          setShow(true);
        }}
        onFocus={() => setShow(true)}
        autoComplete="off"
        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
      />
      {show && filtered.length > 0 && (
        <div className="absolute z-50 bg-white border border-gray-200 w-full max-h-56 overflow-y-auto rounded-lg shadow-xl mt-1">
          {filtered.map(a => (
            <div
              key={a.code}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
              onClick={() => {
                setInput(`${a.city} (${a.code}) - ${a.name}`);
                onChange(a.code);
                setShow(false);
              }}
            >
              <div className="font-semibold text-gray-900">{a.city} ({a.code})</div>
              <div className="text-gray-500 text-xs mt-1">{a.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FlightPanel({ id, onAdd, onClose }) {
  const airports = useAirports();
  const [form, setForm] = useState({
    tripType: 'oneway',
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    flightClass: 'economy',
    direct: 'all',
  });
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = e => {
    e.preventDefault();
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setResults([
        {
          id: 'f1',
          from: form.from,
          to: form.to,
          airline: 'Saudia',
          departDate: form.departDate,
          returnDate: form.returnDate,
          price: 350 + (form.adults + form.children * 0.75 + form.infants * 0.5) * 100,
          tripType: form.tripType,
          flightClass: form.flightClass,
          direct: form.direct,
          passengers: form.adults + form.children + form.infants,
          duration: '1h 30m',
          type: 'Direct'
        },
      ]);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-blue-100">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">Flight Search</CardTitle>
              <p className="text-sm text-gray-600">Find the best flights for your journey</p>
            </div>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose} className="hover:bg-white/50">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AirportAutoSuggest
              value={form.from}
              onChange={code => setForm(f => ({ ...f, from: code }))}
              airports={airports}
              placeholder="From: Departure City"
            />
            <AirportAutoSuggest
              value={form.to}
              onChange={code => setForm(f => ({ ...f, to: code }))}
              airports={airports}
              placeholder="To: Destination City"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
              value={form.tripType}
              onChange={e => setForm(f => ({ ...f, tripType: e.target.value }))}
            >
              <option value="oneway">One-way</option>
              <option value="roundtrip">Round-trip</option>
              <option value="multicity">Multi-city</option>
            </select>
            <Input
              type="date"
              value={form.departDate}
              onChange={e => setForm(f => ({ ...f, departDate: e.target.value }))}
              className="border-gray-200 focus:border-blue-500"
            />
            {form.tripType === 'roundtrip' && (
              <Input
                type="date"
                value={form.returnDate}
                onChange={e => setForm(f => ({ ...f, returnDate: e.target.value }))}
                className="border-gray-200 focus:border-blue-500"
              />
            )}
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Adults</label>
              <Input
                type="number"
                min={1}
                max={9}
                value={form.adults}
                onChange={e => setForm(f => ({ ...f, adults: Number(e.target.value) }))}
                className="border-gray-200 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Children</label>
              <Input
                type="number"
                min={0}
                max={9}
                value={form.children}
                onChange={e => setForm(f => ({ ...f, children: Number(e.target.value) }))}
                className="border-gray-200 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Infants</label>
              <Input
                type="number"
                min={0}
                max={9}
                value={form.infants}
                onChange={e => setForm(f => ({ ...f, infants: Number(e.target.value) }))}
                className="border-gray-200 focus:border-blue-500"
              />
            </div>
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
              value={form.flightClass}
              onChange={e => setForm(f => ({ ...f, flightClass: e.target.value }))}
            >
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </select>
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
              value={form.direct}
              onChange={e => setForm(f => ({ ...f, direct: e.target.value }))}
            >
              <option value="all">All Flights</option>
              <option value="direct">Direct Only</option>
            </select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-3"
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search Flights'}
          </Button>
        </form>
        
        {results.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold text-gray-900 mb-3">Available Flights</h4>
            {results.map(r => (
              <div key={r.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs">{r.airline}</Badge>
                      <Badge variant="outline" className="text-xs">{r.type}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {r.from} → {r.to} • {r.departDate} • {r.duration} • {r.flightClass}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600">${r.price}</div>
                    <Button size="sm" onClick={() => onAdd({ ...r, type: 'flight' })} className="mt-2">
                      Add to Package
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ServicePanel({ type, id, onAdd, onClose }) {
  if (type === 'flight') return <FlightPanel id={id} onAdd={onAdd} onClose={onClose} />;
  
  const [search, setSearch] = useState({});
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const serviceConfig = SERVICE_TYPES.find(s => s.key === type);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    setTimeout(() => {
      let data = [];
      switch (type) {
        case 'hotel':
          data = MOCK_HOTELS.filter(h => !search.city || h.city === search.city);
          break;
        case 'visa':
          data = MOCK_VISAS.filter(v => !search.nationality || v.nationality === search.nationality);
          break;
        case 'transport':
          data = MOCK_TRANSPORTS.filter(t => !search.type || t.type === search.type);
          break;
        case 'ziarath':
          data = MOCK_ZIARATHS.filter(z => !search.city || z.city === search.city);
          break;
        case 'guide':
          data = MOCK_GUIDES.filter(g => !search.language || g.language === search.language);
          break;
        default:
          data = [];
      }
      setResults(data);
      setIsSearching(false);
    }, 1000);
  };

  const getSearchFields = () => {
    switch (type) {
      case 'hotel':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              placeholder="City (Makkah/Madinah)" 
              value={search.city || ''} 
              onChange={e => setSearch(s => ({ ...s, city: e.target.value }))}
              className="border-gray-200 focus:border-emerald-500"
            />
            <Input 
              placeholder="Check-in Date" 
              type="date"
              value={search.checkin || ''} 
              onChange={e => setSearch(s => ({ ...s, checkin: e.target.value }))}
              className="border-gray-200 focus:border-emerald-500"
            />
          </div>
        );
      case 'visa':
        return (
          <Input 
            placeholder="Your Nationality" 
            value={search.nationality || ''} 
            onChange={e => setSearch(s => ({ ...s, nationality: e.target.value }))}
            className="border-gray-200 focus:border-purple-500"
          />
        );
      case 'transport':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              placeholder="Transport Type (Car/Bus)" 
              value={search.type || ''} 
              onChange={e => setSearch(s => ({ ...s, type: e.target.value }))}
              className="border-gray-200 focus:border-orange-500"
            />
            <Input 
              placeholder="Route/Destination" 
              value={search.route || ''} 
              onChange={e => setSearch(s => ({ ...s, route: e.target.value }))}
              className="border-gray-200 focus:border-orange-500"
            />
          </div>
        );
      case 'ziarath':
        return (
          <Input 
            placeholder="City (Makkah/Madinah)" 
            value={search.city || ''} 
            onChange={e => setSearch(s => ({ ...s, city: e.target.value }))}
            className="border-gray-200 focus:border-teal-500"
          />
        );
      case 'guide':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              placeholder="Preferred Language" 
              value={search.language || ''} 
              onChange={e => setSearch(s => ({ ...s, language: e.target.value }))}
              className="border-gray-200 focus:border-indigo-500"
            />
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white"
              value={search.duration || ''}
              onChange={e => setSearch(s => ({ ...s, duration: e.target.value }))}
            >
              <option value="">Select Duration</option>
              <option value="half-day">Half Day</option>
              <option value="full-day">Full Day</option>
              <option value="multi-day">Multi Day</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  const renderResult = (r) => {
    switch (type) {
      case 'hotel':
        return (
          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{r.name}</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{r.rating}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-1">{r.city}</div>
                <div className="text-xs text-emerald-600">{r.distance}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">${r.price}</div>
                <div className="text-xs text-gray-500">per night</div>
                <Button size="sm" onClick={() => onAdd({ ...r, type })} className="mt-2">
                  Add to Package
                </Button>
              </div>
            </div>
          </div>
        );
      case 'visa':
        return (
          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{r.type}</h4>
                <div className="text-sm text-gray-600 mb-1">Nationality: {r.nationality}</div>
                <div className="flex items-center space-x-1 text-xs text-blue-600">
                  <Clock className="w-3 h-3" />
                  <span>Processing: {r.processing}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">${r.price}</div>
                <Button size="sm" onClick={() => onAdd({ ...r, type })} className="mt-2">
                  Add to Package
                </Button>
              </div>
            </div>
          </div>
        );
      case 'transport':
        return (
          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{r.type}</h4>
                <div className="text-sm text-gray-600 mb-1">{r.route}</div>
                <div className="flex items-center space-x-1 text-xs text-orange-600">
                  <Users className="w-3 h-3" />
                  <span>{r.capacity}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-600">${r.price}</div>
                <Button size="sm" onClick={() => onAdd({ ...r, type })} className="mt-2">
                  Add to Package
                </Button>
              </div>
            </div>
          </div>
        );
      case 'ziarath':
        return (
          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{r.name}</h4>
                <div className="text-sm text-gray-600 mb-1">{r.city}</div>
                <div className="flex items-center space-x-1 text-xs text-teal-600">
                  <Calendar className="w-3 h-3" />
                  <span>Duration: {r.duration}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-teal-600">${r.price}</div>
                <Button size="sm" onClick={() => onAdd({ ...r, type })} className="mt-2">
                  Add to Package
                </Button>
              </div>
            </div>
          </div>
        );
      case 'guide':
        return (
          <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-gray-900">{r.name}</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{r.rating}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-1">Language: {r.language}</div>
                <div className="text-xs text-indigo-600">Experience: {r.experience}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">${r.price}</div>
                <div className="text-xs text-gray-500">per day</div>
                <Button size="sm" onClick={() => onAdd({ ...r, type })} className="mt-2">
                  Add to Package
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={`shadow-xl border-0 bg-gradient-to-br ${serviceConfig?.color === 'from-emerald-500 to-emerald-600' ? 'from-emerald-50 to-emerald-100' : serviceConfig?.color === 'from-purple-500 to-purple-600' ? 'from-purple-50 to-purple-100' : serviceConfig?.color === 'from-orange-500 to-orange-600' ? 'from-orange-50 to-orange-100' : serviceConfig?.color === 'from-teal-500 to-teal-600' ? 'from-teal-50 to-teal-100' : 'from-indigo-50 to-indigo-100'}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${serviceConfig?.color} flex items-center justify-center`}>
              <serviceConfig.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">{serviceConfig?.label}</CardTitle>
              <p className="text-sm text-gray-600">{serviceConfig?.description}</p>
            </div>
          </div>
          <Button size="icon" variant="ghost" onClick={onClose} className="hover:bg-white/50">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          {getSearchFields()}
          <Button 
            type="submit" 
            className={`w-full bg-gradient-to-r ${serviceConfig?.color} hover:opacity-90 py-3`}
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : `Search ${serviceConfig?.label}`}
          </Button>
        </form>
        
        {results.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold text-gray-900 mb-3">Available Options</h4>
            {results.map(renderResult)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const BuildYourOwnUmrah = () => {
  const [activePanels, setActivePanels] = useState([]);
  const [cart, setCart] = useState([]);

  const handleAddService = (type) => {
    setActivePanels(prev => [...prev, { type, id: Date.now() + Math.random() }]);
  };

  const handleRemovePanel = (id) => {
    setActivePanels(prev => prev.filter(p => p.id !== id));
  };

  const handleAddToCart = (item, panelId) => {
    setCart(prev => [...prev, { ...item, cartId: Date.now() + Math.random() }]);
    handleRemovePanel(panelId);
  };

  const handleRemoveFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="bg-white/20 text-white border-white/30 mb-4 px-4 py-2">
            ✨ Premium Custom Packages
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Build Your Perfect Umrah Journey
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Create a personalized Umrah package by selecting from our premium services. 
            From flights and accommodation to guided tours and transport - design your spiritual journey exactly as you envision it.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <CheckCircle className="w-4 h-4" />
              <span>Custom Itinerary</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <CheckCircle className="w-4 h-4" />
              <span>Flexible Booking</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
              <CheckCircle className="w-4 h-4" />
              <span>Best Price Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row min-h-screen -mt-8 relative z-10">
        {/* Service Selection Sidebar */}
        <aside className="lg:w-80 bg-white shadow-2xl lg:sticky lg:top-0 lg:h-screen overflow-y-auto">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Add Services</h2>
            <p className="text-sm text-gray-600">Select services to build your custom package</p>
          </div>
          
          <div className="p-6 space-y-4">
            {SERVICE_TYPES.map((service) => (
              <button
                key={service.key}
                onClick={() => handleAddService(service.key)}
                className={`w-full p-4 rounded-xl border-2 border-gray-100 ${service.bgColor} transition-all duration-200 hover:border-gray-200 hover:shadow-md group`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 group-hover:text-gray-700">
                      <Plus className="w-4 h-4 inline mr-2" />
                      {service.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{service.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Popular Combinations */}
          <div className="p-6 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Popular Combinations</h3>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  handleAddService('flight');
                  handleAddService('hotel');
                  handleAddService('visa');
                }}
                className="w-full text-left p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200"
              >
                <div className="text-sm font-medium text-emerald-800">Essential Package</div>
                <div className="text-xs text-emerald-600">Flight + Hotel + Visa</div>
              </button>
              <button 
                onClick={() => {
                  handleAddService('flight');
                  handleAddService('hotel');
                  handleAddService('visa');
                  handleAddService('transport');
                  handleAddService('ziarath');
                }}
                className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <div className="text-sm font-medium text-blue-800">Complete Package</div>
                <div className="text-xs text-blue-600">Everything + Tours</div>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {activePanels.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <Plus className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Start Building Your Package</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Select services from the sidebar to begin creating your personalized Umrah journey. 
                  Mix and match to create the perfect experience for you.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SERVICE_TYPES.slice(0, 3).map((service) => (
                    <Badge key={service.key} variant="outline" className="px-3 py-1">
                      {service.label}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {activePanels.map((panel) => (
                  <ServicePanel
                    key={panel.id}
                    type={panel.type}
                    id={panel.id}
                    onAdd={item => handleAddToCart(item, panel.id)}
                    onClose={() => handleRemovePanel(panel.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Cart Summary Sidebar */}
        <aside className="lg:w-96 bg-white shadow-2xl lg:sticky lg:top-0 lg:h-screen overflow-y-auto">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your Package</h2>
            <p className="text-sm text-gray-600">Review your selected services</p>
          </div>
          
          <div className="p-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-sm text-gray-500">Add services to see them here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.cartId} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {item.type}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.name || item.airline || item.type || `${item.type} Service`}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.city || item.route || item.language || item.nationality || 'Service details'}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-emerald-600">${item.price}</div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleRemoveFromCart(item.cartId)}
                          className="mt-1 h-6 w-6 hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-gray-900">Total Package Cost</span>
                    <span className="text-2xl font-bold text-emerald-600">${totalPrice}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Services</span>
                      <span>{cart.length} items</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & Fees</span>
                      <span>Included</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 py-4 text-lg font-semibold shadow-lg" 
                    disabled={cart.length === 0}
                  >
                    Proceed to Booking
                  </Button>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                      <CheckCircle className="w-3 h-3" />
                      <span>Free cancellation within 24 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
      
      <Footer />
    </div>
  );
};

export default BuildYourOwnUmrah;
