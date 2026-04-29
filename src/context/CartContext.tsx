"use client";
import { createContext, useState, useContext, useEffect, useMemo, type ReactNode, type Dispatch, type SetStateAction } from "react";
import { storageApi, STORAGE_KEYS } from "@/lib/storageApi";
import { CartItem } from "@/types";

interface CartContextProps {
  cartItems: CartItem[];
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
  orderNumber: string;
  setOrderNumber: (value: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (value: boolean) => void;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderNumber, setOrderNumber] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize from storage on mount
  useEffect(() => {
    const storedCart = storageApi.getJSON<CartItem[]>(STORAGE_KEYS.cart, []);
    setCartItems(storedCart);
    setIsHydrated(true);
  }, []);

  // Sync cart items to storage automatically whenever they change
  useEffect(() => {
    if (!isHydrated) return;
    storageApi.setJSON(STORAGE_KEYS.cart, cartItems);
  }, [cartItems, isHydrated]);

  const value = useMemo(() => ({
    cartItems, 
    setCartItems, 
    orderNumber, 
    setOrderNumber, 
    isCartOpen, 
    setIsCartOpen,
    isHydrated
  }), [cartItems, orderNumber, isCartOpen, isHydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCartContext must be used within CartProvider");
  return context;
};
