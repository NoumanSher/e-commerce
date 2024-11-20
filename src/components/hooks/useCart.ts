import { useState, useCallback, useMemo, useEffect } from 'react';
import { ProductCardDataProps } from '@/data/dataProps';
import { useStore } from '@/Context/storeContext';

// Define interfaces
interface CartItem {
  product: ProductCardDataProps;
  quantity: number;
  color?: string;
  size?: string;
  variantID?: string;
}





// useCart Hook
export const useCart = () => {
  const { cartItems, setCartItems } = useStore();

  // Synchronize cart with localStorage


  // Add an item to the cart
  const addToCart = useCallback(
    (item: CartItem) => {
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (cartItem) =>
            cartItem.product._id === item.product._id &&
            cartItem.color === item.color &&
            cartItem.size === item.size &&
            cartItem.variantID === item.variantID
        );

        if (existingItemIndex >= 0) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += item.quantity;
          return updatedItems;
        }

        return [...prevItems, item];
      });
    },
    []
  );

  // Update the quantity of an item
  const updateItemQuantity = useCallback(
    (productID: string, quantity: number, variantID?: string) => {
      setCartItems((prevItems) => {
        return prevItems.map((item) => {
          if (
            item.product._id === productID &&
            (!variantID || item.variantID === variantID)
          ) {
            return { ...item, quantity };
          }
          return item;
        });
      });
    },
    []
  );

  // Remove an item from the cart
  const removeFromCart = useCallback(
    (productID: string, variantID?: string) => {
      setCartItems((prevItems) =>
        prevItems.filter(
          (item) =>
            item.product._id !== productID ||
            (variantID && item.variantID !== variantID)
        )
      );
    },
    []
  );

  // Clear all items from the cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Calculate subTotal
  const subTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const productPrice = item.product.salePrice;
      return total + productPrice * item.quantity;
    }, 0);
  }, [cartItems]);
  const getSubTotalByProductId = useCallback(
    (productID: string, quantity: number, salePrice: number): number => {
      const productItems = cartItems.filter((item) => item.product._id === productID);
  
      // If the product exists in the cart, calculate subtotal based on quantity and salePrice
      if (productItems.length > 0) {
        const totalQuantity = productItems.reduce((acc, item) => acc + item.quantity, 0);
        return salePrice * totalQuantity;
      }
  
      // If the product isn't in the cart, calculate subtotal for the provided quantity and salePrice
      return salePrice * quantity;
    },
    [cartItems]
  );
  

  // Calculate totalCost
  const totalCost = useMemo(() => subTotal, [subTotal]);

  return {
    cartItems,
    cartCount: cartItems.length,
    addToCart,
    updateItemQuantity, // New function
    removeFromCart,
    clearCart,
    subTotal,
    totalCost,
    getSubTotalByProductId
  };
};
