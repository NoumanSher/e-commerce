'use client';

import React, { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('App Error Boundary caught:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-white">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <svg 
                    className="w-10 h-10 text-black" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                    />
                </svg>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                Something went wrong!
            </h2>
            
            <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
                An unexpected error occurred while loading this page. Our team has been notified.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => reset()}
                    className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm"
                >
                    Try again
                </button>
                <button
                    onClick={() => window.location.href = '/'}
                    className="border border-gray-200 text-gray-600 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors uppercase tracking-widest text-sm"
                >
                    Go to Home
                </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-12 p-4 bg-gray-50 rounded text-left max-w-2xl overflow-auto border border-gray-100">
                    <p className="text-xs font-mono text-red-500 mb-2 font-bold uppercase tracking-wider">Debug Info:</p>
                    <pre className="text-[10px] text-gray-500 font-mono">
                        {error.message}
                        {error.stack && `\n\n${error.stack}`}
                    </pre>
                </div>
            )}
        </div>
    );
}
