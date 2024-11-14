// components/hooks/useWishlist.ts

import { useEffect, useCallback } from "react";
import { ProductCardDataProps } from "@/data/dataProps";
import { useStore } from "@/Context/storeContext";

export const useWishlist = () => {
  const { wishlist, setWishlist } = useStore();

  // Sync wishlist with localStorage only when it changes
  useEffect(() => {
    const storedWishlist = JSON.stringify(wishlist);
    if (localStorage.getItem("wishlist") !== storedWishlist) {
      localStorage.setItem("wishlist", storedWishlist);
    }
  }, [wishlist]);

  // Memoize helper functions to improve performance
  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((item) => item._id === productId),
    [wishlist]
  );

  const addToWishlist = useCallback(
    (item: ProductCardDataProps) => {
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
