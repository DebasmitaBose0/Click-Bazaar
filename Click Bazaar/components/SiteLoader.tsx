import React from 'react';

export const SiteLoader: React.FC<{ message?: string }> = ({ message = 'Loading…' }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="site-loader flex flex-col items-center justify-center py-20 text-center"
    >
      <svg
        className="animate-spin h-8 w-8 text-gray-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <div className="mt-3 text-sm text-gray-600">{message}</div>
    </div>
  );
};

export default SiteLoader;
