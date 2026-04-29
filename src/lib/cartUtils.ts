import { CartItem } from "@/types";
import { calculateDiscountedPrice } from "./utils";

/**
 * Calculates the final price for a single cart item, considering variants and discounts.
 */
export const calculateItemPrice = (item: CartItem): number => {
  const salePrice = Number(item.product.salePrice) || 0;
  const discount = item.product.discount || 0;

  const variant = item.variantID
    ? item.product.variants?.find((v) => v._id === item.variantID)
    : null;
  const additionalSalePrice = Number(variant?.additionalSalePrice) || 0;

  // Apply discount to the combined price (base + variant extra)
  const itemPrice = salePrice + additionalSalePrice;
  return calculateDiscountedPrice(itemPrice, discount);
};

/**
 * Calculates the subtotal for a list of cart items.
 */
export const calculateSubtotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total, item) => {
    return total + calculateItemPrice(item) * item.quantity;
  }, 0);
};

/**
 * Validates if a quantity is valid for a cart operation.
 */
export const isValidQuantity = (quantity: number): boolean => {
  return !isNaN(quantity) && quantity > 0;
};
