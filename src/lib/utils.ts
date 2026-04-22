import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// formatPrice
export const formatPrice = (price: number): string => {
  if (typeof price !== "number" || isNaN(price)) return "0";
  return price.toLocaleString("en-US"); // adds commas
};
// calculateDiscountedPrice
export const calculateDiscountedPrice = (price: number, discount: number): number => {
  if (!discount || discount <= 0) return price;
  const discounted = price - (price * discount) / 100;
  return Math.round(discounted); // Round to nearest whole number
};
