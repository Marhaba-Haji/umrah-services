import React from "react";

const BecomeSupplier = () => (
  <div className="container mx-auto px-4 py-16 min-h-[60vh]">
    <h1 className="text-3xl font-bold mb-4">Become Our Supplier</h1>
    <p className="mb-6 text-gray-700 max-w-2xl">
      Are you a supplier of Umrah/Hajj packages, visas, hotels, transport,
      guides, or activities? Partner with Marhaba Haji to offer your services to
      thousands of pilgrims. Fill out the form below or contact us to join our
      supplier network.
    </p>
    <div className="bg-gray-100 p-6 rounded shadow text-gray-500">
      [Supplier application form coming soon. For now, please email{" "}
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

export default BecomeSupplier;
