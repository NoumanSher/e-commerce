"use client";
import React from "react";
import ShoppingCart from "../../shoppingCartModal";
import { useStore } from "@/context/storeContext";


const ShoppingCartModal: React.FC = () => {
  const { setIsCartOpen, isCartOpen } = useStore();


  return (
    <ShoppingCart
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
    />
  );
};

export default ShoppingCartModal;
