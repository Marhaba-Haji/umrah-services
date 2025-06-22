
import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Get in touch with our Umrah visa experts. We're here to help make your spiritual journey smooth and hassle-free.
            </p>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Our experienced team is available 24/7 to assist you with your Umrah visa application, 
                    hotel bookings, transport arrangements, and all your pilgrimage needs.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                      <p className="text-gray-600">+91-78920-09800</p>
                      <p className="text-gray-600">+91-90084-47887</p>
                      <p className="text-sm text-gray-500">Available 24/7</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                      <p className="text-gray-600">support@marhabahaji.com</p>
                      <p className="text-gray-600">info@marhabahaji.com</p>
                      <p className="text-sm text-gray-500">Response within 2 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">WhatsApp Support</h3>
                      <p className="text-gray-600">+91-90084-47887</p>
                      <p className="text-sm text-gray-500">Instant messaging support</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                      <p className="text-gray-600">Monday - Sunday: 24/7</p>
                      <p className="text-sm text-gray-500">Emergency support available</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <Input placeholder="Enter your first name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <Input placeholder="Enter your last name" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input type="email" placeholder="Enter your email address" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input placeholder="Enter your phone number" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <Input placeholder="What can we help you with?" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <Textarea 
                      placeholder="Tell us more about your inquiry..." 
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Services */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Need immediate assistance? Use our quick service options for faster support.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Emergency Support</h3>
                <p className="text-gray-600 mb-4">24/7 emergency assistance for urgent visa matters</p>
                <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                  Call Now
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">Instant messaging with our visa experts</p>
                <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                  Start Chat
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Priority Email</h3>
                <p className="text-gray-600 mb-4">Get priority response within 30 minutes</p>
                <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                  Send Email
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
