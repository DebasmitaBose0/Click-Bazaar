import React from 'react';

export const TransactionLoader: React.FC<{ message?: string }> = ({ message = 'Processing transaction…' }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="transaction-loader fixed inset-0 z-[900] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 text-center">
        <svg
          className="mx-auto h-12 w-12 animate-spin text-indigo-600"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>

        <h3 className="mt-4 text-lg font-semibold text-gray-900">{message}</h3>
        <p className="mt-2 text-sm text-gray-600">Please do not close this window — payment is being processed.</p>

        <div className="mt-6 h-2 w-full bg-gray-100 rounded-full overflow-hidden" aria-hidden>
          <div className="h-full w-1/3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-progress" />
        </div>

        <style>{`
          @keyframes progress { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
          .animate-progress { animation: progress 1.8s linear infinite; }
        `}</style>
      </div>
    </div>
  );
};

export default TransactionLoader;
