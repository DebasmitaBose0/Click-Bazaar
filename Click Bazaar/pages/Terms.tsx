import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-black mb-4">Terms & Conditions</h1>
        <p className="text-gray-700 mb-4">These terms govern your use of ClickBazaar. Please review them carefully before using the site.</p>
        <p className="text-sm text-gray-600">By using ClickBazaar you agree to our terms, service limits, and dispute resolution policy.</p>
      </div>
    </div>
  );
};

export default TermsPage;