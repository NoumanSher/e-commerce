"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AppUIProvider } from "@/context/AppUIContext";
import DynamicStoreHead from "@/components/DynamicStoreHead";

const StoreProviderWrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <AppUIProvider>
      <CartProvider>
        <WishlistProvider>
          <DynamicStoreHead />
          {children}
        </WishlistProvider>
      </CartProvider>
    </AppUIProvider>
  </AuthProvider>
);

export default StoreProviderWrapper;
