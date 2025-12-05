import { useEffect } from "react";
import { useStore } from "@/Context/storeContext";
import apiClient from "@/lib/apiClient";
import { toast } from "react-toastify";
import { BASE_URL_LIVE } from "@/appConst/appConst";

export const useSocialAuth = () => {
    const { setAuthToken, setIsAuthModalOpen, setUserId, setUserName } = useStore();

    const handleAuthSuccess = async (token: string) => {
        setAuthToken(token);
        try {
            const res = await apiClient.get("/auth/me");
            setUserId(res.data.data._id);
            setUserName(res.data.data.username);
            toast.success(res.data.message, { toastId: "auth-success" });
            setIsAuthModalOpen(false);
        } catch (error) {
            console.error("Error fetching user details:", error);
            toast.error("Failed to fetch user details");
        }
    };

    useEffect(() => {
        const handleMessage = async (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;

            if (event.data.type === "SOCIAL_AUTH_SUCCESS") {
                const { token } = event.data;
                if (token) {
                    await handleAuthSuccess(token);
                }
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [setAuthToken, setIsAuthModalOpen, setUserId, setUserName]);

    const openAuthPopup = (url: string, title: string) => {
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        window.open(
            url,
            title,
            `width=${width},height=${height},top=${top},left=${left}`
        );
    };

    const handleGoogleLogin = () => {
        openAuthPopup(`${BASE_URL_LIVE}/auth/google`, "google-login");
    };

    const handleLinkedInLogin = () => {
        openAuthPopup(`${BASE_URL_LIVE}/auth/linkedin`, "linkedin-login");
    };

    return {
        handleGoogleLogin,
        handleLinkedInLogin,
    };
};
