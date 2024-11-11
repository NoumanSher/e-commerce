// components/hooks/useWishlist.ts

import { useEffect, useState } from "react";
import {ProductCardDataProps} from '@/data/dataProps'
// export interface WishlistItem {
//   id: string;
//   title: string;
//   price: number;
//   image: string;
// }

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<ProductCardDataProps[]>([]);

  // Load wishlist from localStorage after component mounts
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);



  const isInWishlist = (productId: string) =>
    wishlist.some((item) => item._id === productId);

  const addToWishlist = (item: ProductCardDataProps) => {
    debugger
    setWishlist((currentWishlist) => {
      // Check if the item is already in the wishlist
      if (currentWishlist.some((wishlistItem) => wishlistItem._id === item._id)) {
        return currentWishlist; // Item is already in wishlist, return the current state
      }
  
      // If not, add the item to the wishlist
      const updatedWishlist = [...currentWishlist, item];
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

      return updatedWishlist;
    });
  };

  const removeFromWishlist = (itemId: string) => {
    setWishlist((currentWishlist) => {
      const updatedWishlist = currentWishlist.filter((item) => item._id !== itemId);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      return updatedWishlist;
    });
  };

  return { wishlist, isInWishlist, addToWishlist, removeFromWishlist };
};
