import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Terms = () => (
  <div className="min-h-screen bg-white flex flex-col justify-between">
    <Header />
    <main className="max-w-3xl mx-auto px-4 py-12 flex-1">
      <h1 className="text-3xl font-bold mb-6 text-primary">Terms of Use</h1>
      <section className="mb-6">
        <p>
          Welcome to Marhaba Haji, a brand of Marhaba Ventures Private Limited,
          based in Bangalore, India. These Terms of Use ("Terms") govern your
          access to and use of our website, mobile applications, call center
          services, and other digital platforms (collectively, the "Platform").
        </p>
        <p className="mt-2">
          By using our Platform, you agree to be bound by these Terms. If you do
          not accept these Terms, please do not use our services.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Definitions</h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            "We", "us", "our" refer to Marhaba Ventures Private Limited (Marhaba
            Haji).
          </li>
          <li>
            "User", "you", "your" refers to any individual, agent, tour
            operator, or corporate entity accessing our Platform.
          </li>
          <li>
            "Services" refer to travel-related products offered, including
            Umrah/Hajj packages, flights, hotels, visa processing, transport,
            ziyarah tours, and travel assistance.
          </li>
          <li>
            "Third-party provider" refers to airlines, hotels, visa agents,
            local transport providers, tour operators, and others whose services
            we facilitate.
          </li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
        <p>
          You must be at least 18 years of age and legally competent to use our
          services. By using the Platform, you represent and warrant that you
          meet this eligibility requirement.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Use of the Platform</h2>
        <p>You agree to:</p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Use the Platform in compliance with all applicable laws</li>
          <li>
            Provide accurate and updated information while registering or
            booking
          </li>
          <li>Maintain the confidentiality of your account credentials</li>
          <li>
            Accept full responsibility for all activities conducted under your
            account
          </li>
        </ul>
        <p className="mt-2">You agree not to:</p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            Use the Platform for unlawful, fraudulent, or harmful purposes
          </li>
          <li>
            Post or transmit content that is offensive, defamatory, or infringes
            on any third-party rights
          </li>
          <li>
            Attempt to breach, hack, reverse-engineer, or tamper with any part
            of the Platform
          </li>
          <li>Use bots or automated scripts to book or scrape data</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Booking & Payments</h2>
        <h3 className="font-semibold mt-2">A. Booking Process:</h3>
        <p>
          All bookings are subject to availability, pricing, and confirmation by
          the relevant service providers. We reserve the right to decline or
          cancel bookings in case of fraud, mispricing, or operational issues.
        </p>
        <h3 className="font-semibold mt-2">B. Payment:</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            You agree to pay all applicable charges at the time of booking,
            including base fare, taxes, surcharges, service fees, and processing
            fees.
          </li>
          <li>
            Payments can be made via credit/debit cards, UPI, net banking, or
            wallet services.
          </li>
          <li>
            Bookings will only be confirmed upon successful receipt of full or
            advance payment as specified.
          </li>
        </ul>
        <h3 className="font-semibold mt-2">C. Cancellations and Refunds:</h3>
        <p>
          Refer to our Cancellation and Refund Policy for specific terms
          regarding cancellation timelines, penalties, and refund processing.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Services Offered</h2>
        <p>
          We operate as a travel intermediary and booking facilitator. We do not
          own or control airlines, hotels, or visa centers. The service quality
          and fulfillment responsibility lies with the respective third-party
          providers.
        </p>
        <p>
          We ensure coordination and best-effort facilitation but are not liable
          for delays, cancellations, overbooking, service disruptions, or
          changes made by external vendors.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. User Responsibilities</h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Obtain valid travel documents (passport, visa) before travel</li>
          <li>
            Adhere to airline, hotel, and country-specific rules and
            requirements
          </li>
          <li>
            Provide accurate information for bookings (e.g., names as per
            passport)
          </li>
          <li>Cooperate with verification and KYC processes, where required</li>
          <li>
            Comply with the religious, cultural, and legal norms of Saudi Arabia
            or any destination country
          </li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          7. Communication & Marketing
        </h2>
        <p>By using our services, you consent to receive:</p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            Booking confirmations, updates, and alerts via email, SMS, or
            WhatsApp
          </li>
          <li>
            Marketing communication (offers, new packages, content) if opted in
          </li>
        </ul>
        <p className="mt-2">
          You may opt out of marketing communication anytime by contacting
          support@marhabahaji.com or using the "unsubscribe" link in emails.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Intellectual Property</h2>
        <p>
          All content on the Platform—including text, visuals, logos,
          trademarks, software code, videos, and documents—is the intellectual
          property of Marhaba Ventures Private Limited or its licensors.
        </p>
        <p>
          You may not reproduce, modify, distribute, or use our content for
          commercial purposes without prior written consent.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Third-Party Links</h2>
        <p>
          Our Platform may contain links to third-party websites or services.
          These are provided for convenience and do not signify our endorsement.
          We are not responsible for the content, privacy practices, or policies
          of such third-party platforms.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          10. Limitation of Liability
        </h2>
        <p>
          To the fullest extent permitted by law, Marhaba Haji shall not be
          liable for:
        </p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            Any direct, indirect, incidental, special, or consequential damages
          </li>
          <li>Loss of data, profits, or goodwill</li>
          <li>Service interruptions or failure of travel partners</li>
          <li>Visa rejection, border issues, or immigration denials</li>
          <li>Natural calamities, pandemics, or acts of God</li>
        </ul>
        <p>
          Our total liability in any circumstance shall not exceed the amount
          you paid us for the affected booking.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">11. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Marhaba Ventures Pvt. Ltd.
          and its affiliates, employees, officers, and agents from any claims,
          liabilities, losses, damages, costs, or expenses arising out of:
        </p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Your misuse of the Platform</li>
          <li>Your violation of these Terms</li>
          <li>Any breach of laws or third-party rights</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">12. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to the
          Platform or your account at our sole discretion for any violation of
          these Terms, suspected fraud, or unlawful behavior.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          13. Governing Law & Jurisdiction
        </h2>
        <p>
          These Terms are governed by the laws of India. Any dispute arising
          under or related to these Terms shall be subject to the exclusive
          jurisdiction of courts in Bangalore, Karnataka.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">14. Updates to the Terms</h2>
        <p>
          We may modify these Terms from time to time. Continued use of the
          Platform after such changes constitutes acceptance of the revised
          Terms. The most current version will always be available on our
          website.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">15. Contact Us</h2>
        <p>
          For any questions, feedback, or complaints regarding these Terms,
          contact:
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

export default Terms;
