'use client';

import React, { useState, useEffect } from 'react';
import { HiOutlineSignalSlash } from 'react-icons/hi2';

const OfflineIndicator = () => {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Initial check
        setIsOffline(!window.navigator.onLine);

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full animate-pulse">
                    <HiOutlineSignalSlash size={18} className="text-white" />
                </div>
                <div>
                    <p className="text-sm font-bold tracking-tight">You are offline</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Checking connection...</p>
                </div>
            </div>
        </div>
    );
};

export default OfflineIndicator;
