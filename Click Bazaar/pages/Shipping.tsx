import React from 'react';

const ShippingPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-black mb-4">Shipping Policy</h1>
        <p className="text-gray-700 mb-4">Standard shipping is free for orders above ₹1,500. Express options and estimated delivery times are shown at checkout.</p>
        <ul className="list-disc pl-6 text-sm text-gray-600">
          <li>Standard: 3-7 business days</li>
          <li>Express: 1-2 business days (charges apply)</li>
          <li>International: calculated at checkout</li>
        </ul>
      </div>
    </div>
  );
};

export default ShippingPage;