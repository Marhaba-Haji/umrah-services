import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

const SERVICE_TYPES = [
  { key: 'flight', label: 'Flight' },
  { key: 'hotel', label: 'Hotel' },
  { key: 'visa', label: 'Visa' },
  { key: 'transport', label: 'Transport' },
  { key: 'ziarath', label: 'Ziarath' },
  { key: 'guide', label: 'Guide' },
];

// Mock data for each service type
const MOCK_FLIGHTS = [
  { id: 'f1', from: 'JED', to: 'MED', date: '2024-08-01', airline: 'Saudia', price: 350 },
  { id: 'f2', from: 'JED', to: 'MED', date: '2024-08-01', airline: 'Flynas', price: 290 },
];
const MOCK_HOTELS = [
  { id: 'h1', city: 'Makkah', name: 'Hilton Suites', price: 120 },
  { id: 'h2', city: 'Madinah', name: 'Pullman Zamzam', price: 110 },
];
const MOCK_VISAS = [
  { id: 'v1', type: 'Umrah Visa', nationality: 'India', price: 100 },
  { id: 'v2', type: 'Umrah Visa', nationality: 'Pakistan', price: 110 },
];
const MOCK_TRANSPORTS = [
  { id: 't1', type: 'Private Car', route: 'JED-Makkah', price: 80 },
  { id: 't2', type: 'Bus', route: 'Makkah-Madinah', price: 50 },
];
const MOCK_ZIARATHS = [
  { id: 'z1', city: 'Makkah', name: 'Cave of Hira', price: 40 },
  { id: 'z2', city: 'Madinah', name: 'Uhud Mountain', price: 35 },
];
const MOCK_GUIDES = [
  { id: 'g1', language: 'English', name: 'Ahmed', price: 60 },
  { id: 'g2', language: 'Urdu', name: 'Bilal', price: 55 },
];

function useAirports() {
  const [airports, setAirports] = useState([]);
  useEffect(() => {
    fetch('/airports.json')
      .then(res => res.json())
      .then(setAirports);
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
      />
      {show && filtered.length > 0 && (
        <div className="absolute z-50 bg-white border w-full max-h-56 overflow-y-auto rounded shadow">
          {filtered.map(a => (
            <div
              key={a.code}
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
              onClick={() => {
                setInput(`${a.city} (${a.code}) - ${a.name}`);
                onChange(a.code);
                setShow(false);
              }}
            >
              <span className="font-semibold">{a.city} ({a.code})</span> <span className="text-gray-500">- {a.name}</span>
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

  const handleSearch = e => {
    e.preventDefault();
    // For demo, just show a mock result
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
      },
    ]);
  };

  return (
    <Card className="p-4 flex flex-col gap-2 bg-blue-50 border-blue-200">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Flight Search</span>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <form onSubmit={handleSearch} className="flex flex-col gap-2 mb-2">
        <div className="flex gap-2">
          <AirportAutoSuggest
            value={form.from}
            onChange={code => setForm(f => ({ ...f, from: code }))}
            airports={airports}
            placeholder="Departure City or Airport"
          />
          <AirportAutoSuggest
            value={form.to}
            onChange={code => setForm(f => ({ ...f, to: code }))}
            airports={airports}
            placeholder="Destination City or Airport"
          />
        </div>
        <div className="flex gap-2">
          <select
            className="border rounded px-2 py-1 text-sm"
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
            className="w-36"
          />
          {form.tripType === 'roundtrip' && (
            <Input
              type="date"
              value={form.returnDate}
              onChange={e => setForm(f => ({ ...f, returnDate: e.target.value }))}
              className="w-36"
            />
          )}
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            min={1}
            max={9}
            value={form.adults}
            onChange={e => setForm(f => ({ ...f, adults: Number(e.target.value) }))}
            className="w-20"
            placeholder="Adults"
          />
          <Input
            type="number"
            min={0}
            max={9}
            value={form.children}
            onChange={e => setForm(f => ({ ...f, children: Number(e.target.value) }))}
            className="w-20"
            placeholder="Children"
          />
          <Input
            type="number"
            min={0}
            max={9}
            value={form.infants}
            onChange={e => setForm(f => ({ ...f, infants: Number(e.target.value) }))}
            className="w-20"
            placeholder="Infants"
          />
          <select
            className="border rounded px-2 py-1 text-sm"
            value={form.flightClass}
            onChange={e => setForm(f => ({ ...f, flightClass: e.target.value }))}
          >
            <option value="economy">Economy</option>
            <option value="business">Business</option>
            <option value="first">First</option>
          </select>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={form.direct}
            onChange={e => setForm(f => ({ ...f, direct: e.target.value }))}
          >
            <option value="all">All</option>
            <option value="direct">Direct</option>
            <option value="connecting">Connecting</option>
          </select>
        </div>
        <Button type="submit" size="sm" className="w-fit">Search</Button>
      </form>
      {results.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {results.map(r => (
            <div key={r.id} className="flex items-center justify-between bg-white rounded p-2 border">
              <span>{r.airline} {r.from}→{r.to} ({r.departDate}{r.returnDate ? ' - ' + r.returnDate : ''}) - {r.flightClass} - ${r.price}</span>
              <Button size="sm" onClick={() => onAdd({ ...r, type: 'flight' })}>Add</Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function ServicePanel({ type, id, onAdd, onClose }) {
  if (type === 'flight') return <FlightPanel id={id} onAdd={onAdd} onClose={onClose} />;
  // State for search fields
  const [search, setSearch] = useState({});
  const [results, setResults] = useState([]);

  // Search logic per type
  const handleSearch = (e) => {
    e.preventDefault();
    let data = [];
    switch (type) {
      case 'hotel':
        data = MOCK_HOTELS.filter(h =>
          !search.city || h.city === search.city
        );
        break;
      case 'visa':
        data = MOCK_VISAS.filter(v =>
          !search.nationality || v.nationality === search.nationality
        );
        break;
      case 'transport':
        data = MOCK_TRANSPORTS.filter(t =>
          !search.type || t.type === search.type
        );
        break;
      case 'ziarath':
        data = MOCK_ZIARATHS.filter(z =>
          !search.city || z.city === search.city
        );
        break;
      case 'guide':
        data = MOCK_GUIDES.filter(g =>
          !search.language || g.language === search.language
        );
        break;
      default:
        data = [];
    }
    setResults(data);
  };

  // Render search form and results per type
  let formFields = null;
  let resultFields = null;
  switch (type) {
    case 'hotel':
      formFields = (
        <div className="flex gap-2">
          <Input placeholder="City" value={search.city || ''} onChange={e => setSearch(s => ({ ...s, city: e.target.value }))} />
        </div>
      );
      resultFields = r => `${r.name} (${r.city}) - $${r.price}`;
      break;
    case 'visa':
      formFields = (
        <div className="flex gap-2">
          <Input placeholder="Nationality" value={search.nationality || ''} onChange={e => setSearch(s => ({ ...s, nationality: e.target.value }))} />
        </div>
      );
      resultFields = r => `${r.type} (${r.nationality}) - $${r.price}`;
      break;
    case 'transport':
      formFields = (
        <div className="flex gap-2">
          <Input placeholder="Type (e.g. Bus)" value={search.type || ''} onChange={e => setSearch(s => ({ ...s, type: e.target.value }))} />
        </div>
      );
      resultFields = r => `${r.type} (${r.route}) - $${r.price}`;
      break;
    case 'ziarath':
      formFields = (
        <div className="flex gap-2">
          <Input placeholder="City" value={search.city || ''} onChange={e => setSearch(s => ({ ...s, city: e.target.value }))} />
        </div>
      );
      resultFields = r => `${r.name} (${r.city}) - $${r.price}`;
      break;
    case 'guide':
      formFields = (
        <div className="flex gap-2">
          <Input placeholder="Language" value={search.language || ''} onChange={e => setSearch(s => ({ ...s, language: e.target.value }))} />
        </div>
      );
      resultFields = r => `${r.name} (${r.language}) - $${r.price}`;
      break;
    default:
      formFields = null;
      resultFields = () => '';
  }

  return (
    <Card className="p-4 flex flex-col gap-2 bg-blue-50 border-blue-200">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold capitalize">{type}</span> service
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <form onSubmit={handleSearch} className="flex flex-col gap-2 mb-2">
        {formFields}
        <Button type="submit" size="sm" className="w-fit">Search</Button>
      </form>
      {results.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {results.map(r => (
            <div key={r.id} className="flex items-center justify-between bg-white rounded p-2 border">
              <span>{resultFields(r)}</span>
              <Button size="sm" onClick={() => onAdd({ ...r, type })}>Add</Button>
            </div>
          ))}
        </div>
      )}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r p-6 flex flex-col gap-4 sticky top-0 h-screen">
        <h2 className="text-lg font-bold mb-4">Add Services</h2>
        {SERVICE_TYPES.map((service) => (
          <Button key={service.key} className="w-full mb-2" onClick={() => handleAddService(service.key)}>
            + Add {service.label}
          </Button>
        ))}
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold mb-2">Build Your Own Umrah Package</h1>
        <p className="text-gray-600 mb-4">Add flights, hotels, visa, transport, ziarath, and guides to create your perfect Umrah journey. Each service can be added multiple times.</p>
        <div className="flex flex-col gap-4">
          {activePanels.length === 0 && (
            <div className="text-gray-400 italic">No services added yet. Use the sidebar to add a service.</div>
          )}
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
      </main>
      {/* Cart Summary */}
      <aside className="w-80 bg-white border-l p-6 flex flex-col gap-4 sticky top-0 h-screen">
        <h2 className="text-lg font-bold mb-4">Your Cart</h2>
        {cart.length === 0 ? (
          <div className="text-gray-400 italic">No services in cart yet.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {cart.map((item) => (
              <Card key={item.cartId} className="p-3 flex items-center justify-between gap-2">
                <span className="capitalize">{item.type}</span>
                <span className="text-xs text-gray-500">{item.name || item.airline || item.type || item.city}</span>
                <span className="font-semibold text-emerald-700">${item.price}</span>
                <Button size="icon" variant="ghost" onClick={() => handleRemoveFromCart(item.cartId)}>
                  <X className="w-4 h-4" />
                </Button>
              </Card>
            ))}
            <div className="flex justify-between items-center pt-4 border-t mt-2">
              <span className="font-bold">Total</span>
              <span className="text-lg font-bold text-emerald-700">${totalPrice}</span>
            </div>
            <Button className="w-full mt-4" disabled={cart.length === 0}>Proceed to Booking</Button>
          </div>
        )}
      </aside>
    </div>
  );
};

export default BuildYourOwnUmrah; 