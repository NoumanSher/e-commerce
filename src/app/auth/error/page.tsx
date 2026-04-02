"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStore } from "@/context/storeContext";
import { AuthModal } from "@/components/AuthModal";
// Create a separate component effectively to be used within Suspense
const AuthErrorContent = () => {
    const { setIsAuthModalOpen } = useStore();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [errorMessage, setErrorMessage] = useState("Authentication failed");

    useEffect(() => {
        const error = searchParams.get("error");

        if (error) {
            setErrorMessage(decodeURIComponent(error));
        }

        if (window.opener) {
            window.opener.postMessage(
                {
                    type: "SOCIAL_AUTH_ERROR",
                    error: error || "Unknown error"
                },
                window.location.origin
            );
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                <div className="mb-4 text-red-500">
                    <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Authentication Failed
                </h2>
                <p className="text-gray-600 mb-6">
                    {errorMessage}
                </p>
                <div className="space-y-3">
                    <button
                        onClick={() => { window.close(), router.back() }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-200"
                    >
                        Close Window
                    </button>
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
};

const AuthError = () => {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <AuthErrorContent />
            <AuthModal />
        </Suspense>
    );
};

export default AuthError;
