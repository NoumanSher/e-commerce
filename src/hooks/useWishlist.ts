import { useCallback } from "react";
import { useWishlistContext } from "@/context/WishlistContext";
import { Product } from "@/components/productDetail/productDetailDto";
import { toast } from "react-toastify";

/**
 * Professional hook for managing wishlist operations.
 * Decoupled from generic store and follows SRP.
 */
export const useWishlist = () => {
  const { wishlist, setWishlist, isHydrated } = useWishlistContext();

  /**
   * Check if a product is in the wishlist
   */
  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((item) => item._id === productId),
    [wishlist]
  );

  /**
   * Toggle item in wishlist (Add/Remove)
   */
  const toggleWishlist = useCallback(
    (product: Product) => {
      const toastId = `wishlist-${product._id}`;
      const exists = wishlist.some((item) => item._id === product._id);
      
      if (exists) {
        setWishlist((prev) => prev.filter((item) => item._id !== product._id));
        toast.info("Removed from wishlist", { toastId });
      } else {
        setWishlist((prev) => [...prev, product]);
        toast.success("Added to wishlist", { toastId });
      }
    },
    [wishlist, setWishlist]
  );

  const addToWishlist = useCallback(
    (product: Product) => {
      const toastId = `wishlist-add-${product._id}`;
      const exists = wishlist.some((item) => item._id === product._id);
      
      if (!exists) {
        setWishlist((prev) => [...prev, product]);
        toast.success("Added to wishlist", { toastId });
      }
    },
    [wishlist, setWishlist]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      const toastId = `wishlist-remove-${productId}`;
      const exists = wishlist.some((item) => item._id === productId);
      
      if (exists) {
        setWishlist((prev) => prev.filter((item) => item._id !== productId));
        toast.info("Removed from wishlist", { toastId });
      }
    },
    [wishlist, setWishlist]
  );

  const wishlistCount = wishlist.length;

  return {
    wishlist,
    wishlistCount,
    isHydrated,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  };
};
