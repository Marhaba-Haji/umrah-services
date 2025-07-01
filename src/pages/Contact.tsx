import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    const name = `${form.firstName} ${form.lastName}`.trim();
    try {
      const { error } = await supabase.from("contact_inquiries").insert({
        name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
      });
      if (error) throw error;
      setSuccess("Thank you! Your inquiry has been submitted.");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: unknown) {
      setError(
        "Sorry, there was a problem submitting your inquiry. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white py-16 mb-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Get in touch with our Umrah visa experts. We're here to help make
              your spiritual journey smooth and hassle-free.
            </p>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Information */}
              <div className="space-y-10 pr-0 lg:pr-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Get In Touch
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    Our experienced team is available 24/7 to assist you with
                    your Umrah visa application, hotel bookings, transport
                    arrangements, and all your pilgrimage needs.
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Each contact method */}
                  <div className="flex items-start space-x-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Phone Support
                      </h3>
                      <p className="text-gray-600">+91-78920-09800</p>
                      <p className="text-gray-600">+91-90084-47887</p>
                      <p className="text-sm text-gray-500">Available 24/7</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Email Support
                      </h3>
                      <p className="text-gray-600">support@marhabahaji.com</p>
                      <p className="text-gray-600">info@marhabahaji.com</p>
                      <p className="text-sm text-gray-500">
                        Response within 2 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        WhatsApp Support
                      </h3>
                      <p className="text-gray-600">+91-90084-47887</p>
                      <p className="text-sm text-gray-500">
                        Instant messaging support
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Business Hours
                      </h3>
                      <p className="text-gray-600">Monday - Sunday: 24/7</p>
                      <p className="text-sm text-gray-500">
                        Emergency support available
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gray-50 p-10 rounded-2xl shadow-md">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">
                  Send us a Message
                </h3>
                <form className="space-y-7" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <Input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <Input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <Input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="What can we help you with?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <Textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  {success && (
                    <div className="text-green-600 text-sm mt-2">{success}</div>
                  )}
                  {error && (
                    <div className="text-red-600 text-sm mt-2">{error}</div>
                  )}
                  <Button
                    type="submit"
                    className="w-full mt-2 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Services */}
        <section className="py-16 bg-gray-50 mt-8">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quick Services
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Need immediate assistance? Use our quick service options for
                faster support.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-xl shadow-lg text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full flex items-center justify-center mb-6">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Emergency Support
                </h3>
                <p className="text-gray-600 mb-6">
                  24/7 emergency assistance for urgent visa matters
                </p>
                <Button
                  variant="outline"
                  className="border-amber-600 text-amber-600 hover:bg-amber-50"
                  onClick={() => window.open("tel:+917892009800")}
                >
                  Call Now
                </Button>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full flex items-center justify-center mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-6">
                  Instant messaging with our visa experts
                </p>
                <Button
                  variant="outline"
                  className="border-amber-600 text-amber-600 hover:bg-amber-50"
                  onClick={() =>
                    window.open(
                      "https://wa.me/919008447887?text=Hello%2C%20I%20need%20urgent%20visa%20assistance",
                    )
                  }
                >
                  Start Chat
                </Button>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-yellow-500 rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Priority Email</h3>
                <p className="text-gray-600 mb-6">
                  Get priority response within 30 minutes
                </p>
                <Button
                  variant="outline"
                  className="border-amber-600 text-amber-600 hover:bg-amber-50"
                  onClick={() =>
                    window.open(
                      "mailto:support@marhabahaji.com?subject=Priority%20Visa%20Support",
                    )
                  }
                >
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
