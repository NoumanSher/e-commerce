"use client";
import { createContext, useState, useContext, useEffect, useMemo, useCallback, type ReactNode } from "react";
import { storageApi, STORAGE_KEYS } from "@/lib/storageApi";
import { clearAuthToken } from "@/lib/apiClient";

interface AuthContextProps {
  userId: string;
  userName: string;
  authToken: string;
  isHydrated: boolean;
  setUserId: (value: string) => void;
  setUserName: (value: string) => void;
  setAuthToken: (value: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthTokenState] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setUserName(storageApi.get(STORAGE_KEYS.userName) ?? "");
    setAuthTokenState(storageApi.get(STORAGE_KEYS.token) ?? "");
    setUserId(storageApi.get(STORAGE_KEYS.userId) ?? "");
    setIsHydrated(true);
  }, []);

  const setAuthToken = useCallback((token: string) => {
    setAuthTokenState(token);
    if (token) {
      storageApi.set(STORAGE_KEYS.token, token);
    } else {
      // Clear all user data from localStorage immediately on logout
      storageApi.remove(STORAGE_KEYS.token);
      storageApi.remove(STORAGE_KEYS.refreshToken);
      storageApi.remove(STORAGE_KEYS.userId);
      storageApi.remove(STORAGE_KEYS.userName);
      storageApi.remove(STORAGE_KEYS.productDetails);
      setUserId("");
      setUserName("");
      clearAuthToken();
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    userId ? storageApi.set(STORAGE_KEYS.userId, userId) : storageApi.remove(STORAGE_KEYS.userId);
    userName ? storageApi.set(STORAGE_KEYS.userName, userName) : storageApi.remove(STORAGE_KEYS.userName);
  }, [userId, userName, isHydrated]);

  const value = useMemo(() => ({
    userId, setUserId, userName, setUserName, authToken, setAuthToken, isHydrated
  }), [userId, userName, authToken, isHydrated, setAuthToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
