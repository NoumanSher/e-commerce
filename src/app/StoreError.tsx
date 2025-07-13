'use client'
import React from "react";

interface StoreErrorProps {
  message: string;
}

const StoreError: React.FC<StoreErrorProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-600 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong.</h1>
      <p className="text-lg mb-6">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
      >
        Retry
      </button>
    </div>
  );
};

export default StoreError;
