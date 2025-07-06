import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Support = () => (
  <>
    <Header />
    <section className="py-16 bg-gray-50 min-h-[60vh]">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-emerald-700 mb-6">
          Customer Support
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          We are here to help you with all your travel needs and ensure a smooth
          and spiritually fulfilling journey.
        </p>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            📞 Contact Support
          </h2>
          <div className="mb-2">
            <span className="font-medium">Phone Support:</span>
            <br />
            <span className="text-emerald-700 font-bold text-lg">
              📱 +91 78920 09800
            </span>
          </div>
          <div>
            <span className="font-medium">Email Support:</span>
            <br />
            <span className="text-emerald-700 font-bold text-lg">
              📧 support@marhabahaji.com
            </span>
          </div>
        </div>
        <div className="mb-8">
          <p className="text-gray-700 mb-2">
            Have questions about your booking, itinerary, payment, or visa
            process? Reach out to us and we'll be happy to assist you.
          </p>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            🕑 Support Timings
          </h2>
          <ul className="text-gray-700 space-y-1">
            <li>
              <span className="font-medium">Monday to Thursday:</span> ⏰ 10:00
              AM – 8:00 PM (IST)
            </li>
            <li>
              <span className="font-medium">Friday:</span> ⏰ 10:00 AM – 12:00
              PM and 3:00 PM – 8:00 PM (IST)
            </li>
            <li>
              <span className="font-medium">Saturday:</span> ⏰ 10:00 AM – 8:00
              PM (IST)
            </li>
            <li>
              <span className="font-medium">Sunday:</span>{" "}
              <span className="text-red-500">🚫 Closed</span>
            </li>
          </ul>
          <div className="mt-4">
            <span className="font-medium">Holiday Closures:</span>
            <ul className="list-disc list-inside text-gray-700 ml-4">
              <li>Eid al-Fitr (Ramadan Eid)</li>
              <li>Eid al-Adha (Bakrid)</li>
            </ul>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            ⚠️ Need Escalation?
          </h2>
          <p className="text-gray-700 mb-1">
            If your issue is urgent or unresolved, please escalate it directly
            to:
          </p>
          <span className="text-emerald-700 font-bold text-lg">
            📧 harab.rasheed@marhabahaji.com
          </span>
          <br />
          <span className="text-gray-600 text-sm">
            (Founder & Escalation Officer)
          </span>
        </div>
        <div className="mt-8">
          <p className="text-gray-800 font-medium">
            We value your trust and are committed to ensuring your satisfaction.
          </p>
        </div>
      </div>
    </section>
    <Footer />
  </>
);

export default Support;
