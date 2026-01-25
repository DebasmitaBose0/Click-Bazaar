import React from 'react';
import KnowledgeBaseSection from '../components/KnowledgeBaseSection';

const HelpPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-black mb-4">Help Center</h1>
        <p className="text-gray-700 mb-4">Find answers to common questions or start a chat with our support team.</p>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-black">FAQs</h3>
            <p className="text-sm text-gray-600">Shipping, returns, and payment questions answered here.</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-black">Knowledge Base</h3>
            <div className="mt-3"><KnowledgeBaseSection /></div>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-black">Start a Chat</h3>
            <p className="text-sm text-gray-600">Click the chat button on the page to connect with live support.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;