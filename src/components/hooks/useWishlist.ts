// components/hooks/useWishlist.ts

import { useEffect, useCallback } from "react";
import { useStore } from "@/context/storeContext";
import { storageApi, STORAGE_KEYS } from "@/lib/storageApi";
import { Product } from "../productDetail/productDetailDto";

export const useWishlist = () => {
  const { wishlist, setWishlist, isHydrated } = useStore();
  useEffect(() => {
    if (!isHydrated) return;
    storageApi.setJSON(STORAGE_KEYS.wishlist, wishlist);
  }, [wishlist, isHydrated]);

  // Memoize helper functions to improve performance
  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((item) => item._id === productId),
    [wishlist]
  );

  const addToWishlist = useCallback(
    (item: Product) => {
      setWishlist((currentWishlist) => {
        if (
          currentWishlist.some((wishlistItem) => wishlistItem._id === item._id)
        ) {
          return currentWishlist; // Item already exists
        }
        return [...currentWishlist, item];
      });
    },
    [setWishlist]
  );

  const removeFromWishlist = useCallback(
    (itemId: string) => {
      setWishlist((currentWishlist) =>
        currentWishlist.filter((item) => item._id !== itemId)
      );
    },
    [setWishlist]
  );

  const wishlistCount = wishlist.length;

  return {
    wishlist,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    wishlistCount,
  };
};
