"use client";
import React from "react";
import ShoppingCart from "../../shoppingCartModal";
import { useCartContext } from "@/context/CartContext";


const ShoppingCartModal: React.FC = () => {
  const { setIsCartOpen, isCartOpen } = useCartContext();


  return (
    <ShoppingCart
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
    />
  );
};

export default ShoppingCartModal;
