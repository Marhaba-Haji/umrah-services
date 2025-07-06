import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Careers = () => (
  <>
    <Header />
    <section className="py-16 bg-gray-50 min-h-[60vh]">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-emerald-700 mb-6">
          Careers at Marhaba Haji
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Join Us in Building the Future of Halal Travel
        </h2>

        <p className="text-lg text-gray-700 mb-8">
          At Marhaba Haji, we are on a mission to transform the global halal and
          religious tourism landscape with trust, technology, and transparency.
          As one of India's fastest-growing travel companies focused on Umrah,
          Hajj, and halal-friendly international holidays, we're looking for
          passionate professionals who want to make a difference in people's
          lives through purposeful travel.
        </p>

        <p className="text-lg text-gray-700 mb-12">
          Explore our open roles below and be part of a team that blends faith,
          innovation, and service.
        </p>

        <div className="mb-12">
          <h3 className="text-2xl font-bold text-emerald-700 mb-6">
            💼 Open Positions
          </h3>

          {/* Position 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              1. 🕋 Customer Sales Executive – B2C (Religious Travel)
            </h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="font-medium">Location:</span> Bangalore
                (Hybrid)
              </div>
              <div>
                <span className="font-medium">Experience:</span> 1–3 years
              </div>
            </div>
            <div className="mb-4">
              <h5 className="font-semibold text-gray-800 mb-2">
                Key Responsibilities:
              </h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>
                  Handle inbound and outbound customer inquiries for Umrah,
                  Hajj, and Islamic tours
                </li>
                <li>
                  Guide customers through packages, pricing, visa documentation,
                  and bookings
                </li>
                <li>
                  Maintain CRM records and follow up to maximize conversions
                </li>
                <li>
                  Offer compassionate and informed service with an understanding
                  of religious sensitivities
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">
                Preferred Skills:
              </h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Sales or customer support background in travel</li>
                <li>Strong verbal communication in Hindi, English, and Urdu</li>
                <li>Ability to explain religious package details clearly</li>
              </ul>
            </div>
          </div>

          {/* Position 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              2. 🧳 B2B Sales Manager – Travel Partner Relations
            </h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="font-medium">Location:</span> Bangalore /
                Remote (India-based)
              </div>
              <div>
                <span className="font-medium">Experience:</span> 3–6 years in
                travel B2B
              </div>
            </div>
            <div className="mb-4">
              <h5 className="font-semibold text-gray-800 mb-2">
                Key Responsibilities:
              </h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>
                  Build and manage relationships with travel agents, tour
                  operators, and sub-agents
                </li>
                <li>
                  Promote fixed departure packages and white-label group
                  services
                </li>
                <li>
                  Conduct webinars, product demos, and in-person presentations
                </li>
                <li>
                  Track partner performance, resolve escalations, and boost
                  repeat sales
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">
                Preferred Skills:
              </h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Prior experience in OTA, DMC, or consolidator model</li>
                <li>Proven sales track record in flight or Umrah visa sales</li>
                <li>Multilingual communication preferred</li>
              </ul>
            </div>
          </div>

          {/* Position 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              3. 📣 Digital Marketing Executive / Specialist
            </h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="font-medium">Location:</span> Bangalore
                (On-site preferred)
              </div>
              <div>
                <span className="font-medium">Experience:</span> 2–4 years
              </div>
            </div>
            <div className="mb-4">
              <h5 className="font-semibold text-gray-800 mb-2">
                Key Responsibilities:
              </h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>
                  Plan and execute SEO, SEM, email marketing, and WhatsApp
                  campaigns
                </li>
                <li>
                  Manage blog content, landing pages, and social media channels
                </li>
                <li>
                  Run paid ad campaigns for Umrah packages and group bookings
                </li>
                <li>
                  Monitor analytics, conversion tracking, and performance KPIs
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">
                Preferred Skills:
              </h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Hands-on with Google Ads, Meta Ads, Search Console, GA4</li>
                <li>Strong knowledge of religious/travel buyer personas</li>
                <li>
                  Experience in generating B2C leads for online travel companies
                </li>
              </ul>
            </div>
          </div>

          {/* Position 4 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              4. ✈️ Sourcing Manager – Flights & Hotels (Group & FIT)
            </h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="font-medium">Location:</span> Bangalore
                (Hybrid)
              </div>
              <div>
                <span className="font-medium">Experience:</span> 5+ years
              </div>
            </div>
            <div className="mb-4">
              <h5 className="font-semibold text-gray-800 mb-2">
                Key Responsibilities:
              </h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>
                  Negotiate group flight blocks and wholesale airfares with
                  airlines and consolidators
                </li>
                <li>
                  Contract hotel rates in Makkah, Madinah, and halal-friendly
                  destinations
                </li>
                <li>Manage supplier relationships and payment timelines</li>
                <li>
                  Ensure inventory and pricing alignment with Marhaba Haji
                  packages
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">
                Preferred Skills:
              </h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Excellent understanding of Middle East hotel supply</li>
                <li>Experience with Sabre, Amadeus, or group fare bookings</li>
                <li>Strong negotiation and vendor coordination skills</li>
              </ul>
            </div>
          </div>

          {/* Position 5 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              5. 🌍 International Holiday Sourcing Expert (Halal Travel)
            </h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="font-medium">Location:</span> Bangalore /
                Remote (India)
              </div>
              <div>
                <span className="font-medium">Experience:</span> 4+ years
              </div>
            </div>
            <div className="mb-4">
              <h5 className="font-semibold text-gray-800 mb-2">
                Key Responsibilities:
              </h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>
                  Curate halal-friendly tour packages to Turkey, Dubai,
                  Malaysia, Indonesia, Europe
                </li>
                <li>
                  Vet hotels, restaurants, and experiences for halal compliance
                </li>
                <li>
                  Identify and manage DMC partners in international markets
                </li>
                <li>
                  Maintain updated package catalog for B2C and B2B sales teams
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">
                Preferred Skills:
              </h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Familiarity with halal travel standards</li>
                <li>Network of global DMC and hotel contacts</li>
                <li>
                  Fluency in English and at least one foreign language is a plus
                </li>
              </ul>
            </div>
          </div>

          {/* Position 6 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              6. 🎫 Ticketing Agent (IATA Certified)
            </h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="font-medium">Location:</span> Bangalore
                (On-site)
              </div>
              <div>
                <span className="font-medium">Experience:</span> 2–5 years
              </div>
            </div>
            <div className="mb-4">
              <h5 className="font-semibold text-gray-800 mb-2">
                Key Responsibilities:
              </h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>
                  Issue, reissue, and cancel tickets using GDS platforms
                  (Amadeus/Sabre)
                </li>
                <li>Manage group PNRs and special fares</li>
                <li>
                  Ensure fare accuracy, baggage policy updates, and flight
                  changes
                </li>
                <li>
                  Support agents and customers with itinerary confirmations and
                  changes
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">
                Qualifications:
              </h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>IATA certification mandatory</li>
                <li>GDS proficiency required</li>
                <li>
                  Experience in religious travel or group ticketing preferred
                </li>
              </ul>
            </div>
          </div>

          {/* Position 7 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              7. 🛠 Service Delivery & Operations Lead
            </h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="font-medium">Location:</span> Bangalore
                (Full-time)
              </div>
              <div>
                <span className="font-medium">Experience:</span> 5–8 years
              </div>
            </div>
            <div className="mb-4">
              <h5 className="font-semibold text-gray-800 mb-2">
                Key Responsibilities:
              </h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>
                  Oversee end-to-end Umrah and international group operations
                </li>
                <li>
                  Coordinate flight, hotel, visa, ground transport, and guide
                  teams
                </li>
                <li>
                  Monitor SLA adherence, group satisfaction, and real-time
                  support
                </li>
                <li>
                  Lead post-travel feedback collection, refunds, and
                  documentation closure
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">
                Preferred Skills:
              </h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Operational leadership in a travel company</li>
                <li>Familiarity with Umrah travel SOPs</li>
                <li>
                  Strong crisis handling and escalation management ability
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-emerald-700 mb-4">
            🌟 Why Work With Us?
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              <span className="font-medium">Purpose-driven team:</span> Serve
              the Ummah and deliver value beyond tourism
            </li>
            <li>
              <span className="font-medium">Fast-growth environment:</span> Work
              with IIM grads, travel veterans, and faith-driven entrepreneurs
            </li>
            <li>
              <span className="font-medium">Real impact:</span> Your work
              directly enhances the pilgrim experience
            </li>
            <li>
              <span className="font-medium">Modern Islamic workplace:</span>{" "}
              Balanced, ethical, and spiritually conscious
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-2xl font-bold text-emerald-700 mb-4">
            📩 How to Apply
          </h3>
          <p className="text-gray-700 mb-4">
            Send your CV and a short cover letter to:
          </p>
          <p className="text-emerald-700 font-bold text-lg mb-4">
            📧 harab.rasheed@marhabahaji.com
          </p>
          <p className="text-gray-700">
            Mention the position in the subject line (e.g., Application –
            Digital Marketing Executive)
          </p>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-emerald-700 mb-4">
            🙌 Join Us in Redefining Halal Travel
          </h3>
          <p className="text-lg text-gray-700">
            Whether you're a seasoned travel professional or a passionate
            learner, we welcome talent that aligns with our values of service,
            sincerity, and excellence.
          </p>
        </div>
      </div>
    </section>
    <Footer />
  </>
);

export default Careers;
