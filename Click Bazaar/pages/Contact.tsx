import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-black mb-4">Contact Us</h1>
        <p className="text-gray-700 mb-4">Reach out to us for help with orders, returns, or partnerships.</p>
        <ul className="text-sm text-gray-600">
          <li>Email: <a className="text-indigo-600" href="mailto:dbose272@gmail.com">dbose272@gmail.com</a></li>
          <li>Phone: 1800-419-2026</li>
        </ul>
      </div>
    </div>
  );
};

export default ContactPage;