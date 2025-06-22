import React, { useState } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top bar */}
      <div className="bg-emerald-700 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>24/7 Support: +1-234-567-8900</span>
              </span>
              <span className="flex items-center space-x-1">
                <Mail className="w-3 h-3" />
                <span>info@marhabahaji.com</span>
              </span>
            </div>
            <div className="hidden md:block">
              <span>✈️ Fast Processing | 🛡️ Secure Payment | 🎯 99% Success Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🕌</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Marhaba Haji</h1>
              <p className="text-sm text-emerald-600">Umrah Visa Services</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-700 hover:text-emerald-600 transition-colors">Services</a>
            <Link to="/hotel" className="text-gray-700 hover:text-emerald-600 transition-colors">Book Hotel</Link>
            <Link to="/transport" className="text-gray-700 hover:text-emerald-600 transition-colors">Book Transport</Link>
            <a href="#pricing" className="text-gray-700 hover:text-emerald-600 transition-colors">Pricing</a>
            <a href="#faq" className="text-gray-700 hover:text-emerald-600 transition-colors">FAQ</a>
            <a href="#contact" className="text-gray-700 hover:text-emerald-600 transition-colors">Contact</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              Track Application
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Apply Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <a href="#services" className="text-gray-700 hover:text-emerald-600 transition-colors">Services</a>
              <Link to="/hotel" className="text-gray-700 hover:text-emerald-600 transition-colors">Book Hotel</Link>
              <Link to="/transport" className="text-gray-700 hover:text-emerald-600 transition-colors">Book Transport</Link>
              <a href="#pricing" className="text-gray-700 hover:text-emerald-600 transition-colors">Pricing</a>
              <a href="#faq" className="text-gray-700 hover:text-emerald-600 transition-colors">FAQ</a>
              <a href="#contact" className="text-gray-700 hover:text-emerald-600 transition-colors">Contact</a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" className="border-emerald-600 text-emerald-600">
                  Track Application
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Apply Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
