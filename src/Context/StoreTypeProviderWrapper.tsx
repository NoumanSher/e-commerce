"use client";
import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AppUIProvider } from "@/context/AppUIContext";

const StoreProviderWrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <AppUIProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </CartProvider>
    </AppUIProvider>
  </AuthProvider>
);

export default StoreProviderWrapper;

