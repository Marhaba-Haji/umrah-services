import React from "react";

const BecomeAgent = () => (
  <div className="container mx-auto px-4 py-16 min-h-[60vh]">
    <h1 className="text-3xl font-bold mb-4">Become Our Partner Agent</h1>
    <p className="mb-6 text-gray-700 max-w-2xl">
      Join Marhaba Haji as a partner agent and help pilgrims access the best
      Umrah and Hajj services. We welcome travel agents, agencies, and
      representatives who wish to collaborate with us. Fill out the form below
      or contact us to get started.
    </p>
    <div className="bg-gray-100 p-6 rounded shadow text-gray-500">
      [Agent application form coming soon. For now, please email{" "}
      <a
        href="mailto:support@marhabahaji.com"
        className="text-emerald-700 underline"
      >
        support@marhabahaji.com
      </a>{" "}
      to express your interest.]
    </div>
  </div>
);

export default BecomeAgent;
