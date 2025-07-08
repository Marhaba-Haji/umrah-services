import React, { useState, useRef, useEffect } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { CurrencyContext, useCurrency } from "../contexts/CurrencyContext";

const Header = () => {
  const { currency, setCurrency } = useCurrency();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(window.scrollY);
  const ticking = useRef(false);
  const navigate = useNavigate();
  const currencies = [
    {
      code: "USD",
      symbol: "$",
      name: "US Dollar",
    },
    {
      code: "INR",
      symbol: "₹",
      name: "Indian Rupee",
    },
    {
      code: "SAR",
      symbol: "ر.س",
      name: "Saudi Riyal",
    },
  ];
  const handleNavigation = (path: string) => {
    navigate(path);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
    setIsMenuOpen(false);
  };
  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (isMenuOpen) {
          setShowHeader(true);
        } else if (currentScrollY < 40) {
          setShowHeader(true);
        } else if (currentScrollY > lastScrollY.current) {
          // Scrolling down
          setShowHeader(false);
        } else if (currentScrollY < lastScrollY.current) {
          // Scrolling up
          setShowHeader(true);
        }
        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);
  return (
    <header
      className={`sticky top-0 z-50 bg-white shadow-lg border-b border-[#023f3a]/10 transition-transform duration-300 will-change-transform ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
    >
      {/* Top bar with currency selection */}
      <div className="bg-[#023f3a] text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>+91-78920-09800</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <span>
                  ✈️ Fast Processing | 🛡️ Secure Payment | 🎯 99% Success Rate
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-20 h-6 text-xs bg-[#023f3a]/80 border-[#023f3a]/60 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
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
          <button
            onClick={() => handleNavigation("/")}
            className="flex items-center space-x-3"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg">
              <img
                src="/lovable-uploads/223b8d47-2e7e-4988-b125-a3f521fb817b.png"
                alt="Marhaba Haji Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#023f3a]">
                Marhaba Haji
              </h1>
              <p className="text-sm text-gray-600">Umrah Services</p>
            </div>
          </button>

          {/* Desktop Navigation - Reordered with Services before Contact and Contact after Blog */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleNavigation("/umrah-packages")}
              className="text-gray-700 hover:text-[#023f3a] transition-colors font-medium"
            >
              Umrah Packages
            </button>
            <button
              onClick={() => handleNavigation("/hotel")}
              className="text-gray-700 hover:text-[#023f3a] transition-colors font-medium"
            >
              Hotel
            </button>
            <button
              onClick={() => handleNavigation("/transport")}
              className="text-gray-700 hover:text-[#023f3a] transition-colors font-medium"
            >
              Transport
            </button>
            <button
              onClick={() => handleNavigation("/ziarath")}
              className="text-gray-700 hover:text-[#023f3a] transition-colors font-medium"
            >
              Ziarath
            </button>
            <button
              onClick={() => handleNavigation("/guide")}
              className="text-gray-700 hover:text-[#023f3a] transition-colors font-medium"
            >
              Guide
            </button>
            <button
              onClick={() => handleNavigation("/saudi-visa-services")}
              className="text-gray-700 hover:text-[#023f3a] transition-colors font-medium"
            >
              Visa
            </button>
            <button
              onClick={() => handleNavigation("/group-flights")}
              className="text-gray-700 hover:text-[#023f3a] transition-colors font-medium"
            >
              Group Flights
            </button>
            <button
              onClick={() => handleNavigation("/blog-post")}
              className="text-gray-700 hover:text-[#023f3a] transition-colors font-medium"
            >
              Blog
            </button>
            <button
              onClick={() => handleNavigation("/contact")}
              className="text-gray-700 hover:text-[#023f3a] transition-colors font-medium"
            >
              Contact
            </button>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={() => handleNavigation("/apply-umrah-visa-online")}
              className="bg-[#023f3a] hover:bg-[#023f3a]/90 text-white shadow-lg"
            >
              Apply Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation - Also reordered */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#023f3a]/10">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => handleNavigation("/about")}
                className="text-gray-700 hover:text-[#023f3a] transition-colors text-left"
              >
                About Us
              </button>
              <button
                onClick={() => handleNavigation("/umrah-packages")}
                className="text-gray-700 hover:text-[#023f3a] transition-colors text-left"
              >
                Umrah Packages
              </button>
              <button
                onClick={() => handleNavigation("/hotel")}
                className="text-gray-700 hover:text-[#023f3a] transition-colors text-left"
              >
                Hotel
              </button>
              <button
                onClick={() => handleNavigation("/transport")}
                className="text-gray-700 hover:text-[#023f3a] transition-colors text-left"
              >
                Transport
              </button>
              <button
                onClick={() => handleNavigation("/ziarath")}
                className="text-gray-700 hover:text-[#023f3a] transition-colors text-left"
              >
                Ziarath
              </button>
              <button
                onClick={() => handleNavigation("/guide")}
                className="text-gray-700 hover:text-[#023f3a] transition-colors text-left"
              >
                Guide
              </button>
              <button
                onClick={() => handleNavigation("/saudi-visa-services")}
                className="text-gray-700 hover:text-[#023f3a] transition-colors text-left"
              >
                Visa
              </button>
              <button
                onClick={() => handleNavigation("/group-flights")}
                className="text-gray-700 hover:text-[#023f3a] transition-colors text-left"
              >
                Group Flights
              </button>
              <button
                onClick={() => handleNavigation("/blog-post")}
                className="text-gray-700 hover:text-[#023f3a] transition-colors text-left"
              >
                Blog
              </button>
              <button
                onClick={() => handleNavigation("/contact")}
                className="text-gray-700 hover:text-[#023f3a] transition-colors text-left"
              >
                Contact
              </button>
              <button
                onClick={() => handleNavigation("/faq")}
                className="text-gray-700 hover:text-[#023f3a] transition-colors text-left"
              >
                FAQ
              </button>

              <div className="flex flex-col space-y-2 pt-4">
                <Button
                  onClick={() => handleNavigation("/apply-umrah-visa-online")}
                  className="bg-[#023f3a] hover:bg-[#023f3a]/90 w-full"
                >
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
