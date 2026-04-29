"use client";
import { createContext, useState, useContext, useEffect, useMemo, useCallback, type ReactNode } from "react";
import { storageApi, STORAGE_KEYS } from "@/lib/storageApi";
import { ProductDetailData } from "@/types";

interface AppUIContextProps {
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (value: boolean) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  selectedCategory: string | null;
  updateSelectedCategory: (categoryId: string) => void;
  productDetail: ProductDetailData | null;
  updateProductDetailData: (data: ProductDetailData) => void;
  isHydrated: boolean;
}

const AppUIContext = createContext<AppUIContextProps | undefined>(undefined);

export const AppUIProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [productDetail, setProductDetail] = useState<ProductDetailData | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Migration for legacy typo just in case
    const legacy = localStorage.getItem("productDeatails");
    if (legacy) {
      storageApi.set("productDetails", legacy);
      localStorage.removeItem("productDeatails");
    }
    
    setSelectedCategory(storageApi.get(STORAGE_KEYS.selectedCategory) ?? null);
    setProductDetail(storageApi.getJSON<ProductDetailData | null>(STORAGE_KEYS.productDetails, null));
    setIsHydrated(true);
  }, []);

  const updateSelectedCategory = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    storageApi.set(STORAGE_KEYS.selectedCategory, categoryId);
  }, []);

  const updateProductDetailData = useCallback((data: ProductDetailData) => {
    setProductDetail(data);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    storageApi.setJSON(STORAGE_KEYS.productDetails, productDetail);
  }, [productDetail, isHydrated]);

  const value = useMemo(() => ({
    isAuthModalOpen, setIsAuthModalOpen,
    activeTab, setActiveTab,
    selectedCategory, updateSelectedCategory,
    productDetail, updateProductDetailData,
    isHydrated
  }), [isAuthModalOpen, activeTab, selectedCategory, productDetail, updateSelectedCategory, updateProductDetailData, isHydrated]);

  return <AppUIContext.Provider value={value}>{children}</AppUIContext.Provider>;
};

export const useAppUIContext = () => {
  const context = useContext(AppUIContext);
  if (!context) throw new Error("useAppUIContext must be used within AppUIProvider");
  return context;
};
