"use client";
import type { ReactNode } from "react";
import { StoreProvider } from "@/context/storeContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AppUIProvider } from "@/context/AppUIContext";

const StoreProviderWrapper = ({ children }: { children: ReactNode }) => (
  <StoreProvider>
    <AuthProvider>
      <AppUIProvider>
        <CartProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CartProvider>
      </AppUIProvider>
    </AuthProvider>
  </StoreProvider>
);

export default StoreProviderWrapper;

