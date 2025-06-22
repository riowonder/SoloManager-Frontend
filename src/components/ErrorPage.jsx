import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-2xl flex flex-col items-center">
        <svg className="w-20 h-20 text-red-500 mb-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Oops! Something went wrong.</h1>
        <p className="text-gray-600 mb-6">The page you are looking for does not exist or you do not have access.</p>
        <button
          className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-900 transition cursor-pointer"
          onClick={() => navigate('/')}
        >
          Back
        </button>
      </div>
    </div>
  );
} 