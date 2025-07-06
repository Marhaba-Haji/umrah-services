import React from "react";
import { Mail, Phone } from "lucide-react";
const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src="/lovable-uploads/223b8d47-2e7e-4988-b125-a3f521fb817b.png"
                  alt="Marhaba Haji Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">Marhaba Haji</h3>
                <p className="text-sm text-gray-400">Umrah Visa Services</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for Umrah visa applications. Making spiritual
              journeys accessible with fast, secure, and reliable visa
              processing services.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>Support: +91-78920-09800</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@marhabahaji.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Our Services
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Visa Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Visa Information</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/requirements"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Visa Requirements
                </a>
              </li>
              <li>
                <a
                  href="/documents"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Required Documents
                </a>
              </li>
              <li>
                <a
                  href="/processing-times"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Processing Times
                </a>
              </li>
              <li>
                <a
                  href="/countries"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Country-Specific Info
                </a>
              </li>
              <li>
                <a
                  href="/travel-tips"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Travel Tips
                </a>
              </li>
              <li>
                <a
                  href="/covid-guidelines"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Health Guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support & Legal</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/support"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Customer Support
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/cancellation-and-refund"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cancellation & Refund
                </a>
              </li>
              <li>
                <a
                  href="/travel-terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Travel Terms & Responsibilities
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>
                &copy; 2024 Marhaba Haji Umrah Visa Services. All rights
                reserved.
              </p>
              <p className="mt-1">
                Licensed travel agency with official authorization for visa
                processing.
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-400">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-400">IATA Approved</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-400">ISO Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Footer Links */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-4">
              Related searches: umrah visa online, saudi arabia visa, umrah visa
              application, mecca visa, hajj visa, saudi visa online, umrah
              permit, religious visa saudi arabia
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <span className="text-gray-500">Umrah Visa for</span>
              <a href="/usa" className="text-gray-400 hover:text-white">
                USA
              </a>
              <span className="text-gray-500">|</span>
              <a href="/uk" className="text-gray-400 hover:text-white">
                UK
              </a>
              <span className="text-gray-500">|</span>
              <a href="/india" className="text-gray-400 hover:text-white">
                India
              </a>
              <span className="text-gray-500">|</span>
              <a href="/pakistan" className="text-gray-400 hover:text-white">
                Pakistan
              </a>
              <span className="text-gray-500">|</span>
              <a href="/bangladesh" className="text-gray-400 hover:text-white">
                Bangladesh
              </a>
              <span className="text-gray-500">|</span>
              <a href="/indonesia" className="text-gray-400 hover:text-white">
                Indonesia
              </a>
              <span className="text-gray-500">|</span>
              <a href="/malaysia" className="text-gray-400 hover:text-white">
                Malaysia
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
