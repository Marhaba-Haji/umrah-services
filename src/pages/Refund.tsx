import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Refund = () => (
  <div className="min-h-screen bg-white flex flex-col justify-between">
    <Header />
    <main className="max-w-3xl mx-auto px-4 py-12 flex-1">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        Cancellation & Refund Policy
      </h1>
      <section className="mb-6">
        <p>
          Marhaba Ventures Private Limited ("we", "us", "our"), operating under
          the brand Marhaba Haji, strives to offer transparent and fair
          cancellation and refund practices. This policy governs all bookings
          made via our website, app, call centers, or partner agents.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Covered Services</h2>
        <p>This policy applies to cancellations and refunds for:</p>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Umrah/Hajj tour packages (group/individual)</li>
          <li>Flights (domestic/international, individual/group)</li>
          <li>Hotels and accommodations</li>
          <li>Visa services</li>
          <li>Ground transport: Car, bus, train bookings</li>
          <li>Ziyarah tours, activities, and day excursions</li>
          <li>Guide services</li>
          <li>Add-ons and special services</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          2. Cancellation Timelines & Charges
        </h2>
        <table className="w-full mb-4 border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1 text-left">
                Notice Period (before departure/service date)
              </th>
              <th className="border px-2 py-1 text-left">Cancellation Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-2 py-1">More than 45 days</td>
              <td className="border px-2 py-1">
                ₹5,000 or 10% (whichever higher)
              </td>
            </tr>
            <tr>
              <td className="border px-2 py-1">30–44 days</td>
              <td className="border px-2 py-1">25% of total cost</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">15–29 days</td>
              <td className="border px-2 py-1">50% of total cost</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">7–14 days</td>
              <td className="border px-2 py-1">75% of total cost</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">Less than 7 days / No-show</td>
              <td className="border px-2 py-1">100% (no refund)</td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-600 mb-2">
          Note: Visa fees, airline tickets, and non-refundable
          hotel/transport/activity bookings will be additionally deducted
          regardless of timing.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          3. Service-Specific Cancellation Conditions
        </h2>
        <h3 className="font-semibold mt-2">A. Flights</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Airline cancellation terms apply once tickets are issued.</li>
          <li>Marhaba Haji service charges are non-refundable.</li>
          <li>No refund if the passenger is marked as a No Show.</li>
        </ul>
        <h3 className="font-semibold mt-2">B. Visa Services</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            Fully non-refundable once application is submitted or payment made
            to authorities.
          </li>
          <li>
            Rejected visa fees are not refunded, though other unused components
            may be, minus actual costs.
          </li>
        </ul>
        <h3 className="font-semibold mt-2">C. Hotels</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            If hotel is booked under non-refundable or early bird rates, no
            refund is possible.
          </li>
          <li>
            Refund for refundable hotel bookings as per hotel policy and after
            deducting service fee.
          </li>
        </ul>
        <h3 className="font-semibold mt-2">D. Transport (Car, Bus, Train)</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>More than 5 days before pickup/departure: 90% refund</li>
          <li>3–5 days before: 50% refund</li>
          <li>Less than 3 days before or No-show: No refund</li>
          <li>
            Train tickets (if booked by us) follow Indian Railways rules. Tatkal
            & Premium Tatkal are non-refundable.
          </li>
          <li>
            In case of chauffeur-driven car rentals, delays in start time by
            more than 1 hour from your side may result in cancellation without
            refund.
          </li>
        </ul>
        <h3 className="font-semibold mt-2">
          E. Ziyarah Tours & Religious Activities
        </h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Cancellable up to 72 hours before tour start: 80% refund</li>
          <li>
            Less than 72 hours: No refund due to operational planning, vehicle
            arrangements, and guide assignments
          </li>
          <li>
            Ziyarah bundled within a package follows package cancellation
            timeline
          </li>
        </ul>
        <h3 className="font-semibold mt-2">F. Guide Bookings</h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            Private or group guide services are refundable up to 3 days before
            the scheduled time.
          </li>
          <li>Less than 72 hours' notice: 50% refund</li>
          <li>No-show: No refund</li>
        </ul>
        <h3 className="font-semibold mt-2">
          G. Activities (Excursions, cultural tours, etc.)
        </h3>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Governed by the service provider's policy</li>
          <li>Generally:</li>
          <li>72 hrs before: 80% refund</li>
          <li>48–72 hrs: 50% refund</li>
          <li>&lt;48 hrs or No-show: No refund</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          4. Force Majeure & Exceptional Cases
        </h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            No refund will be provided for cancellations or service
            interruptions due to:
          </li>
          <li>Acts of God (floods, earthquakes, etc.)</li>
          <li>Political unrest, curfews, or government-imposed restrictions</li>
          <li>Sudden visa bans, travel bans, or border closures</li>
          <li>Airline or hotel strikes</li>
          <li>Pandemic/epidemic travel disruptions</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Refund Process</h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Refunds are processed within 15–30 business days.</li>
          <li>All refunds will be made to the original payment method.</li>
          <li>
            For group bookings, refunds are issued to the booking agent or group
            organizer only.
          </li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          6. Refund Denial Scenarios
        </h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>No refunds will be granted if:</li>
          <li>
            The traveler is denied visa due to incomplete/inaccurate documents
          </li>
          <li>
            The traveler fails to comply with immigration or airline
            requirements
          </li>
          <li>Services are partially used (e.g., midway return)</li>
          <li>
            The traveler misuses services, causes damage, or is removed due to
            misconduct
          </li>
          <li>The traveler requests cancellation after departure</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Travel Insurance</h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>
            Travelers are encouraged to purchase comprehensive travel insurance
            covering:
          </li>
          <li>Trip cancellation</li>
          <li>Medical emergencies</li>
          <li>Loss of passport/luggage</li>
          <li>Missed flights or delays</li>
        </ul>
        <p className="mt-2">
          Refunds from insurance providers must be claimed directly with them.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
        <p>For cancellations or refund requests, contact us at:</p>
        <p>
          Email:{" "}
          <a
            href="mailto:support@marhabahaji.com"
            className="text-primary underline"
          >
            support@marhabahaji.com
          </a>
          <br />
          Phone: [Insert number]
          <br />
          Office: Bangalore, Karnataka, India
        </p>
      </section>
      <p className="text-xs text-gray-500 mt-8">Last updated: July 2024</p>
    </main>
    <Footer />
  </div>
);

export default Refund;
