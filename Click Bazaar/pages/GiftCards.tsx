import React from 'react';

const GiftCardsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-black mb-4">Gift Cards</h1>
        <p className="text-gray-700 mb-4">Give the gift of choice — e-gift cards start at ₹500 and are redeemable across ClickBazaar.</p>
        <p className="text-sm text-gray-600">For corporate purchases or bulk orders, contact <a className="text-indigo-600" href="mailto:dbose272@gmail.com">dbose272@gmail.com</a>.</p>
      </div>
    </div>
  );
};

export default GiftCardsPage;