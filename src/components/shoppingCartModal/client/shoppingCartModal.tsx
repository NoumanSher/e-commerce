'use client';
import React, { useState } from "react";
import ShoppingCart from '../../shoppingCartModal';

interface Product {
  id: number;
  productImageUrl: string;
  productTitle: string;
  productColor: string;
  productSize: string;
  productQuantity: number;
  productPrice: number;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
  removeProduct: (id: number) => void;
}

const ShoppingCartModal: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const products: Product[] = [
    {
      id: 1,
      productImageUrl: "https://via.placeholder.com/150",
      productTitle: "Product 1",
      productColor: "Red",
      productSize: "M",
      productQuantity: 2,
      productPrice: 50,
      incrementQuantity: (id: number) =>
        console.log(`Increment quantity for product ${id}`),
      decrementQuantity: (id: number) =>
        console.log(`Decrement quantity for product ${id}`),
      removeProduct: (id: number) => console.log(`Remove product ${id}`),
    },
    {
      id: 2,
      productImageUrl: "https://via.placeholder.com/150",
      productTitle: "Product 1",
      productColor: "Red",
      productSize: "M",
      productQuantity: 2,
      productPrice: 50,
      incrementQuantity: (id: number) =>
        console.log(`Increment quantity for product ${id}`),
      decrementQuantity: (id: number) =>
        console.log(`Decrement quantity for product ${id}`),
      removeProduct: (id: number) => console.log(`Remove product ${id}`),
    },
    {
      id: 3,
      productImageUrl: "https://via.placeholder.com/150",
      productTitle: "Product 1",
      productColor: "Red",
      productSize: "M",
      productQuantity: 2,
      productPrice: 50,
      incrementQuantity: (id: number) =>
        console.log(`Increment quantity for product ${id}`),
      decrementQuantity: (id: number) =>
        console.log(`Decrement quantity for product ${id}`),
      removeProduct: (id: number) => console.log(`Remove product ${id}`),
    },
    {
      id: 4,
      productImageUrl: "https://via.placeholder.com/150",
      productTitle: "Product 1",
      productColor: "Red",
      productSize: "M",
      productQuantity: 2,
      productPrice: 50,
      incrementQuantity: (id: number) =>
        console.log(`Increment quantity for product ${id}`),
      decrementQuantity: (id: number) =>
        console.log(`Decrement quantity for product ${id}`),
      removeProduct: (id: number) => console.log(`Remove product ${id}`),
    },
  ];

  return (
    <div>
      <button onClick={() => setIsCartOpen(true)}>Open Cart</button>
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        products={products}
      />
    </div>
  );
};

export default ShoppingCartModal;
