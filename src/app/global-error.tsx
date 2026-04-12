'use client';

import React from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className="bg-white">
                <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-6">
                        <span className="text-white text-4xl font-bold">!</span>
                    </div>
                    
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter uppercase">
                        Application Error
                    </h2>
                    
                    <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                        A critical error occurred in the core application layout. Please try refreshing the page.
                    </p>
                    
                    <button
                        onClick={() => reset()}
                        className="bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition-all uppercase tracking-widest text-sm active:scale-95 shadow-lg shadow-black/10"
                    >
                        Reload Application
                    </button>

                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-12 p-6 bg-gray-50 rounded-xl text-left max-w-2xl overflow-auto border border-gray-100 shadow-sm">
                            <p className="text-xs font-mono text-black mb-2 font-bold uppercase tracking-wider">System Trace:</p>
                            <pre className="text-[10px] text-gray-500 font-mono">
                                {error.message}
                                {error.stack && `\n\n${error.stack}`}
                            </pre>
                        </div>
                    )}
                </div>
            </body>
        </html>
    );
}
