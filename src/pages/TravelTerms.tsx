import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const TravelTerms = () => (
  <div className="min-h-screen bg-white flex flex-col justify-between">
    <Header />
    <main className="max-w-3xl mx-auto px-4 py-12 flex-1">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        Traveler Responsibilities, Disclaimers & Travel Insurance Advisory
      </h1>
      <section className="mb-6">
        <p>
          This document outlines the expectations, responsibilities,
          disclaimers, and insurance advisories for all travelers booking
          services with Marhaba Ventures Private Limited, operating under the
          brand name Marhaba Haji.
        </p>
        <p className="mt-2">
          By using our services, you confirm that you have read, understood, and
          agreed to abide by these terms.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Section A: Traveler Responsibilities
        </h2>
        <h3 className="font-semibold mt-2">1. Provide Accurate Information</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            Submit correct and complete personal details at the time of booking.
          </li>
          <li>
            Ensure your name matches exactly as it appears on your passport.
          </li>
          <li>
            Disclose medical conditions or special requirements in advance.
          </li>
        </ul>
        <h3 className="font-semibold mt-2">2. Carry Valid Documentation</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Hold a valid passport (minimum 6 months validity).</li>
          <li>Obtain all necessary visas, permits, and approvals.</li>
          <li>
            Carry originals and photocopies of your travel documents at all
            times.
          </li>
        </ul>
        <h3 className="font-semibold mt-2">3. Adhere to Group Guidelines</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Follow the itinerary and time schedules strictly.</li>
          <li>Maintain punctuality at reporting locations.</li>
          <li>Avoid causing delays or disruptions to the group.</li>
        </ul>
        <h3 className="font-semibold mt-2">4. Conduct Respectfully</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            Show respect to fellow travelers, staff, local communities, and
            religious sites.
          </li>
          <li>
            Dress modestly and maintain decorum in Makkah, Madinah, and other
            sacred places.
          </li>
          <li>
            Do not photograph individuals without permission or enter restricted
            zones.
          </li>
        </ul>
        <h3 className="font-semibold mt-2">5. Maintain Personal Health</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Ensure you are physically and mentally fit to travel.</li>
          <li>Carry personal medication and basic first-aid.</li>
          <li>
            Follow hygiene practices, especially in shared accommodations and
            public areas.
          </li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Section B: Legal & Financial Responsibilities
        </h2>
        <h3 className="font-semibold mt-2">
          1. Immigration & Legal Compliance
        </h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            You are solely responsible for meeting all visa, immigration, and
            health entry requirements.
          </li>
          <li>
            Marhaba Haji is not liable for deportation, denial of entry, or
            detainment by immigration authorities.
          </li>
        </ul>
        <h3 className="font-semibold mt-2">2. Financial Liabilities</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            You are responsible for additional charges due to upgrades, baggage
            excess, room service, or damages.
          </li>
          <li>
            Paying fines or penalties imposed by airlines, authorities, or
            service providers due to your actions.
          </li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Section C: Disclaimers</h2>
        <h3 className="font-semibold mt-2">1. Third-Party Services</h3>
        <p>
          Marhaba Haji acts as a booking intermediary. We do not own airlines,
          hotels, transport, or visa centers. We are not liable for:
        </p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Flight delays or cancellations</li>
          <li>Hotel issues (like overbooking, mismanagement)</li>
          <li>Visa rejections or embassy delays</li>
          <li>Transportation breakdowns or driver behavior</li>
        </ul>
        <p>However, we will assist in resolution on a best-effort basis.</p>
        <h3 className="font-semibold mt-2">2. Force Majeure</h3>
        <p>
          We are not responsible for service disruptions or cancellations due
          to:
        </p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Natural disasters (earthquakes, floods)</li>
          <li>Political unrest or government restrictions</li>
          <li>Pandemics or epidemics</li>
          <li>Airline or hotel labor strikes</li>
          <li>War, terrorism, or civil emergencies</li>
        </ul>
        <p>
          No refunds, reimbursements, or alternative arrangements will be
          offered in such cases.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Section D: Indemnification
        </h2>
        <p>
          You agree to indemnify and hold harmless Marhaba Ventures Private
          Limited, its directors, employees, agents, and affiliates from any:
        </p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Claims or disputes arising from your violation of this policy</li>
          <li>Misconduct, unlawful activity, or negligence during the trip</li>
          <li>
            Damages to property, vehicles, or service assets caused by you
          </li>
          <li>Third-party complaints due to your actions</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Section E: Travel Insurance Advisory & Waiver
        </h2>
        <h3 className="font-semibold mt-2">
          1. Strong Recommendation for Travel Insurance
        </h3>
        <p>
          We strongly advise all travelers to purchase comprehensive travel
          insurance that covers:
        </p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Trip cancellation or curtailment</li>
          <li>Medical emergencies and hospitalization</li>
          <li>Loss of passport, baggage, or valuables</li>
          <li>Flight delays, missed connections, or rebookings</li>
          <li>Repatriation costs in case of emergency</li>
        </ul>
        <p>You can either:</p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Purchase insurance independently from any licensed provider</li>
          <li>
            Request recommendations from Marhaba Haji for third-party insurance
            options
          </li>
        </ul>
        <p className="mt-2 text-xs">
          Note: Marhaba Haji does not underwrite or sell insurance policies. We
          only facilitate referrals and do not guarantee approval, coverage, or
          claims.
        </p>
        <h3 className="font-semibold mt-2">
          2. Voluntary Waiver of Liability (If Insurance Not Taken)
        </h3>
        <p>
          If you choose not to purchase travel insurance, you acknowledge and
          accept that:
        </p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            You bear full responsibility for any medical, legal, or financial
            emergency.
          </li>
          <li>
            You will not hold Marhaba Haji liable for any uncovered loss,
            damage, delay, injury, or hospitalization.
          </li>
          <li>
            You waive any right to claim compensation or reimbursement from
            Marhaba Haji for risks that would otherwise have been covered under
            a travel insurance policy.
          </li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Section F: Code of Conduct Violations
        </h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Marhaba Haji reserves the right to:</li>
          <li>
            Remove any traveler from the group without refund if they pose a
            threat to the safety, dignity, or discipline of the group.
          </li>
          <li>
            Report misconduct to relevant authorities or community
            organizations.
          </li>
          <li>Ban the individual from future group travel or services.</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Section G: Feedback & Reporting
        </h2>
        <p>We encourage all travelers to report:</p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Misconduct by staff or vendors</li>
          <li>Safety issues or emergencies</li>
          <li>Service failures or unethical behavior</li>
        </ul>
        <p className="mt-2">
          Email:{" "}
          <a
            href="mailto:support@marhabahaji.com"
            className="text-primary underline"
          >
            support@marhabahaji.com
          </a>
          <br />
          Office: Bangalore, Karnataka, India
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Final Acknowledgment</h2>
        <p>
          By confirming a booking or using any service of Marhaba Haji, you
          acknowledge and agree to the above terms in full.
        </p>
      </section>
      <p className="text-xs text-gray-500 mt-8">Last updated: July 2024</p>
    </main>
    <Footer />
  </div>
);

export default TravelTerms;
