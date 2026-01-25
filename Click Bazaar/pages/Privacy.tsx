import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-black mb-4">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">We respect your privacy and store minimal data necessary for service. We comply with applicable data protection laws.</p>
        <p className="text-sm text-gray-600">Read the full policy for details on cookies, data retention, and third-party services.</p>
      </div>
    </div>
  );
};

export default PrivacyPage;