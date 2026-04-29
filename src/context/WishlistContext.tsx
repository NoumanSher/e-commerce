"use client";
import { createContext, useState, useContext, useEffect, useMemo, type ReactNode, type Dispatch, type SetStateAction } from "react";
import { storageApi, STORAGE_KEYS } from "@/lib/storageApi";
import { Product } from "@/components/productDetail/productDetailDto";

interface WishlistContextProps {
  wishlist: Product[];
  setWishlist: Dispatch<SetStateAction<Product[]>>;
  isHydrated: boolean;
}

const WishlistContext = createContext<WishlistContextProps | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setWishlist(storageApi.getJSON<Product[]>(STORAGE_KEYS.wishlist, []));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    storageApi.setJSON(STORAGE_KEYS.wishlist, wishlist);
  }, [wishlist, isHydrated]);

  const value = useMemo(() => ({ wishlist, setWishlist, isHydrated }), [wishlist, isHydrated]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlistContext must be used within WishlistProvider");
  return context;
};
