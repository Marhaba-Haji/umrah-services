
import React, { useState, createContext, useContext } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

// Currency Context for global state management
export const CurrencyContext = createContext({
  currency: 'INR',
  setCurrency: (currency: string) => {}
});

export const useCurrency = () => useContext(CurrencyContext);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currency, setCurrency] = useState('INR');
  
  const currencies = [{
    code: 'USD',
    symbol: '$',
    name: 'US Dollar'
  }, {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee'
  }, {
    code: 'SAR',
    symbol: 'ر.س',
    name: 'Saudi Riyal'
  }];

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-[#023f3a]/10">
        {/* Top bar with currency selection */}
        <div className="bg-[#023f3a] text-white py-2">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>Support: +91-78920-09800</span>
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <span>✈️ Fast Processing | 🛡️ Secure Payment | 🎯 99% Success Rate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs">Currency:</span>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-20 h-6 text-xs bg-[#023f3a]/80 border-[#023f3a]/60 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(curr => (
                        <SelectItem key={curr.code} value={curr.code}>
                          {curr.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
                <img src="/lovable-uploads/223b8d47-2e7e-4988-b125-a3f521fb817b.png" alt="Marhaba Haji Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#023f3a]">
                  Marhaba Haji
                </h1>
                <p className="text-sm text-gray-600">Umrah Services</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/services" className="text-gray-700 hover:text-[#023f3a] transition-colors font-medium">Services</Link>
              <Link to="/umrah-packages" className="text-gray-700 hover:text-[#023f3a] transition-colors font-medium">Umrah Packages</Link>
              <Link to="/hotel" className="text-gray-700 hover:text-[#023f3a] transition-colors font-medium">Book Hotel</Link>
              <Link to="/transport" className="text-gray-700 hover:text-[#023f3a] transition-colors font-medium">Book Transport</Link>
              <Link to="/group-flights" className="text-gray-700 hover:text-[#023f3a] transition-colors font-medium">Group Flights</Link>
              <Link to="/blog-post" className="text-gray-700 hover:text-[#023f3a] transition-colors font-medium">Blog</Link>
              <Link to="/contact" className="text-gray-700 hover:text-[#023f3a] transition-colors font-medium">Contact</Link>
              <Link to="/faq" className="text-gray-700 hover:text-[#023f3a] transition-colors font-medium">FAQ</Link>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/apply">
                <Button className="bg-[#023f3a] hover:bg-[#023f3a]/90 text-white shadow-lg">
                  Apply Now
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-[#023f3a]/10">
              <nav className="flex flex-col space-y-4">
                <Link to="/services" className="text-gray-700 hover:text-[#023f3a] transition-colors">Services</Link>
                <Link to="/umrah-packages" className="text-gray-700 hover:text-[#023f3a] transition-colors">Umrah Packages</Link>
                <Link to="/hotel" className="text-gray-700 hover:text-[#023f3a] transition-colors">Book Hotel</Link>
                <Link to="/transport" className="text-gray-700 hover:text-[#023f3a] transition-colors">Book Transport</Link>
                <Link to="/group-flights" className="text-gray-700 hover:text-[#023f3a] transition-colors">Group Flights</Link>
                <Link to="/blog-post" className="text-gray-700 hover:text-[#023f3a] transition-colors">Blog</Link>
                <Link to="/contact" className="text-gray-700 hover:text-[#023f3a] transition-colors">Contact</Link>
                <Link to="/faq" className="text-gray-700 hover:text-[#023f3a] transition-colors">FAQ</Link>
                
                <div className="flex flex-col space-y-2 pt-4">
                  <Link to="/apply">
                    <Button className="bg-[#023f3a] hover:bg-[#023f3a]/90 w-full">
                      Apply Now
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </CurrencyContext.Provider>
  );
};

export default Header;
