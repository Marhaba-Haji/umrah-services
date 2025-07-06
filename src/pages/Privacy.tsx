import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Privacy = () => (
  <div className="min-h-screen bg-white flex flex-col justify-between">
    <Header />
    <main className="max-w-3xl mx-auto px-4 py-12 flex-1">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        Privacy Policy – Marhaba Haji
      </h1>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p>
          Marhaba Ventures Private Limited, a company registered in Bangalore,
          Karnataka, India, and operating under the brand name Marhaba Haji
          ("we", "our", or "us"), is committed to protecting the privacy and
          security of our customers' personal data. This Privacy Policy explains
          how we collect, use, store, share, and safeguard your information when
          you access our services via our website, mobile application, call
          centers, and other online or offline channels (collectively, "Sales
          Channels").
        </p>
        <p className="mt-2">
          By using our services, you consent to the practices outlined in this
          Privacy Policy. If you do not agree, please do not use our services.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Scope & Applicability</h2>
        <p>
          This Privacy Policy applies to all individuals who access, browse, or
          interact with our Sales Channels, including travelers, travel agents,
          and business partners.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          3. Information We Collect
        </h2>
        <h3 className="font-semibold mt-2">A. Personal Information:</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Name, gender, date of birth, nationality</li>
          <li>Email address, phone number, postal address</li>
          <li>
            Passport details, PAN details, Aadhar number or other KYC documents
          </li>
          <li>Travel preferences, special assistance requests</li>
        </ul>
        <h3 className="font-semibold mt-2">
          B. Transactional & Booking Information:
        </h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            Booking history for Umrah, Hajj, tourism, flights, hotels, visas,
            transport
          </li>
          <li>
            Payment methods (card/UPI/Net Banking, but not your complete
            financial data)
          </li>
          <li>Travel companions' data if you book on their behalf</li>
        </ul>
        <h3 className="font-semibold mt-2">C. Technical Data:</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>IP address, device identifiers, browser type/version</li>
          <li>Cookies, geo-location (with permission), operating system</li>
          <li>Session activity, page interactions, referring URLs</li>
        </ul>
        <h3 className="font-semibold mt-2">D. Communications:</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            Emails, customer support chats, call recordings (where applicable)
          </li>
          <li>Survey responses, reviews, or testimonials</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          4. How We Use Your Information
        </h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Process bookings, payments, and itinerary delivery</li>
          <li>Send confirmations, invoices, reminders, alerts</li>
          <li>Respond to customer service requests and resolve issues</li>
          <li>
            Personalize user experience and offer tailored recommendations
          </li>
          <li>Improve our website, app, and service quality</li>
          <li>Conduct research, analytics, audits, and reporting</li>
          <li>Send promotional or marketing messages (if opted in)</li>
          <li>Fulfill legal and regulatory requirements</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          5. Legal Basis for Processing
        </h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Contractual necessity: To complete bookings or transactions</li>
          <li>
            Legitimate interest: Fraud detection, analytics, service improvement
          </li>
          <li>
            Legal obligation: Compliance with tax, immigration, and consumer
            laws
          </li>
          <li>
            Consent: For marketing communications, location tracking, and
            surveys
          </li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          6. Sharing of Personal Information
        </h2>
        <h3 className="font-semibold mt-2">A. Travel & Service Providers</h3>
        <p>
          Airlines, hotels, transportation providers, visa facilitators, Ziyarat
          partners, and local DMCs to fulfill bookings
        </p>
        <h3 className="font-semibold mt-2">B. Third-Party Vendors</h3>
        <p>
          We may share data with service providers including but not limited to:
        </p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Payment processors (Razorpay, PayU, Stripe, etc.)</li>
          <li>Cloud hosting (AWS, Google Cloud, Azure)</li>
          <li>CRM, support & ticketing (Freshdesk, Zoho Desk, etc.)</li>
          <li>Analytics (Google Analytics, Mixpanel, Hotjar)</li>
          <li>
            Email/SMS/WhatsApp communication tools (Mailchimp, Twilio, Kaleyra)
          </li>
          <li>IT developers, security vendors, marketing and SEO agencies</li>
        </ul>
        <h3 className="font-semibold mt-2">
          C. Legal & Regulatory Authorities
        </h3>
        <p>When required by law, judicial order, or enforcement agencies</p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          7. International Data Transfers
        </h2>
        <p>
          Your data may be transferred to servers located outside India (e.g.,
          the UAE, Saudi Arabia, the US), where data protection laws may differ.
          We ensure that any such transfer is compliant with applicable Indian
          data protection regulations and international standards.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Data Retention</h2>
        <p>
          We retain your personal information for a period of 5 years from the
          date of your last interaction with us, or longer if required for
          compliance, dispute resolution, or legal enforcement.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Your Rights</h2>
        <p>Subject to applicable laws, you have the right to:</p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccuracies or update information</li>
          <li>Request deletion (subject to exceptions)</li>
          <li>Withdraw consent for marketing at any time</li>
          <li>Object to or restrict certain data uses</li>
        </ul>
        <p className="mt-2">
          To exercise any of these rights, email{" "}
          <a
            href="mailto:support@marhabahaji.com"
            className="text-primary underline"
          >
            support@marhabahaji.com
          </a>
          . We will respond within 30 days.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          10. Marketing Communications
        </h2>
        <p>
          You may choose to receive promotional offers, travel insights, and
          service updates from us via email, SMS, or WhatsApp. You can:
        </p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Opt-in while creating an account or making a booking</li>
          <li>
            Opt-out at any time by clicking "unsubscribe" in emails or by
            writing to{" "}
            <a
              href="mailto:support@marhabahaji.com"
              className="text-primary underline"
            >
              support@marhabahaji.com
            </a>
          </li>
        </ul>
        <p className="mt-2">
          We respect your choice and will act promptly on your request.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          11. Cookies & Tracking Technologies
        </h2>
        <p>We use cookies and similar technologies for:</p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Session management</li>
          <li>Preference storage</li>
          <li>Analytics and performance measurement</li>
          <li>Targeted advertising (where consent is provided)</li>
        </ul>
        <p className="mt-2">
          You can manage or disable cookies via browser settings, though some
          features may be unavailable.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">12. Data Security</h2>
        <p>
          We implement robust measures including encryption, firewalls, and
          access control to secure your data. Despite these efforts, no method
          of transmission over the Internet is 100% secure.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">13. Children's Privacy</h2>
        <p>
          Our services are not intended for individuals under the age of 18. We
          do not knowingly collect personal data from children. If we become
          aware of any such data, we will delete it promptly.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          14. Changes to This Policy
        </h2>
        <p>
          We may update this policy periodically. Any major changes will be
          notified through our website or email. Continued use of our services
          after updates implies your consent.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">15. Contact Us</h2>
        <p>
          For any questions, concerns, or requests related to this Privacy
          Policy, contact:
        </p>
        <p>
          Marhaba Ventures Private Limited
          <br />
          Email:{" "}
          <a
            href="mailto:support@marhabahaji.com"
            className="text-primary underline"
          >
            support@marhabahaji.com
          </a>
          <br />
          Registered Office: Bangalore, Karnataka, India
        </p>
      </section>
      <p className="text-xs text-gray-500 mt-8">Last updated: July 2024</p>
    </main>
    <Footer />
  </div>
);

export default Privacy;
