// components/hooks/useWishlist.ts
import { useEffect, useState } from 'react';

export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  image: string;
}

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (item: WishlistItem) => {
    if (!wishlist.some((wishlistItem) => wishlistItem.id === item.id)) {
      setWishlist((prev) => [...prev, item]);
    }
  };

  const removeFromWishlist = (itemId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== itemId));
  };

  return { wishlist, addToWishlist, removeFromWishlist };
};
