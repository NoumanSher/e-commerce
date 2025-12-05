"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthSuccess = () => {
    const router = useRouter();

    useEffect(() => {
        // Extract token from hash
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.replace("#", "?"));
        const token = params.get("token");

        if (token) {
            // Send message to opener
            if (window.opener) {
                window.opener.postMessage(
                    { type: "SOCIAL_AUTH_SUCCESS", token },
                    window.location.origin
                );
                window.close();
            } else {
                // Fallback if not opened in popup (e.g. direct navigation)
                // You might want to store token and redirect to home
                console.warn("No opener window found");
                router.push("/");
            }
        } else {
            // Handle error or missing token
            console.error("No token found in URL");
            // router.push("/auth/error"); // Optional
            window.close();
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p>Authenticating...</p>
        </div>
    );
};

export default AuthSuccess;
