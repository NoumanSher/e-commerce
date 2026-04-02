import { useEffect, useCallback } from "react";
import { useStore } from "@/context/storeContext";
import apiClient from "@/lib/apiClient";
import { BASE_URL_LIVE } from "@/config/env";
import { toast } from "react-toastify";

const POPUP_DIMENSIONS = { width: 500, height: 600 } as const;

export const useSocialAuth = () => {
  const { setAuthToken, setIsAuthModalOpen, setUserId, setUserName } = useStore();

  const openAuthPopup = useCallback((url: string, windowName: string) => {
    const left = window.screen.width / 2 - POPUP_DIMENSIONS.width / 2;
    const top = window.screen.height / 2 - POPUP_DIMENSIONS.height / 2;
    window.open(
      url,
      windowName,
      `width=${POPUP_DIMENSIONS.width},height=${POPUP_DIMENSIONS.height},top=${top},left=${left}`
    );
  }, []);

  const handleAuthSuccess = useCallback(
    async (token: string) => {
      setAuthToken(token);
      try {
        const res = await apiClient.get("/auth/me");
        setUserId(res.data.data._id);
        setUserName(res.data.data.username);
        toast.success(res.data.message, { toastId: "auth-success" });
        setIsAuthModalOpen(false);
      } catch {
        toast.error("Failed to fetch user details");
      }
    },
    [setAuthToken, setIsAuthModalOpen, setUserId, setUserName]
  );

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "SOCIAL_AUTH_SUCCESS" && event.data?.token) {
        await handleAuthSuccess(event.data.token);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleAuthSuccess]);

  const handleGoogleLogin = useCallback(
    () => openAuthPopup(`${BASE_URL_LIVE}/auth/google`, "google-login"),
    [openAuthPopup]
  );

  const handleLinkedInLogin = useCallback(
    () => openAuthPopup(`${BASE_URL_LIVE}/auth/linkedin`, "linkedin-login"),
    [openAuthPopup]
  );

  return { handleGoogleLogin, handleLinkedInLogin };
};
