import Link from 'next/link';
import React from 'react';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-white">
            <h1 className="text-9xl font-black text-gray-100 tracking-tighter relative">
                404
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl md:text-3xl text-black font-bold tracking-normal whitespace-nowrap">
                    Page Not Found
                </span>
            </h1>
            
            <div className="max-w-md mt-8">
                <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                
                <Link 
                    href="/" 
                    className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm"
                >
                    Back to Homepage
                </Link>
            </div>
            
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-30 grayscale pointer-events-none select-none">
                {/* Visual filler to make the page feel less empty */}
                <div className="hidden md:block w-32 h-40 bg-gray-200 rounded" />
                <div className="w-32 h-40 bg-gray-300 rounded" />
                <div className="w-32 h-40 bg-gray-200 rounded" />
                <div className="hidden md:block w-32 h-40 bg-gray-300 rounded" />
            </div>
        </div>
    );
};

export default NotFound;
