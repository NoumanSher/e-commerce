import { useCallback, useMemo } from "react";
import { useCartContext } from "@/context/CartContext";
import { toast } from "react-toastify";
import { CartItem } from "@/types";
import { calculateSubtotal, isValidQuantity } from "@/lib/cartUtils";

/**
 * Professional hook for managing cart operations.
 * Decoupled from generic store and follows SRP.
 */
export const useCart = () => {
  const { cartItems, setCartItems, orderNumber, setOrderNumber, isHydrated } = useCartContext();

  /**
   * Helper to find an existing item in the cart
   */
  const findCartItem = useCallback((items: CartItem[], productID: string, variantID?: string) => {
    return items.find(
      (item) => item.product._id === productID && (!variantID || item.variantID === variantID)
    );
  }, []);

  /**
   * Add an item to the cart with stock and variant validation
   */
  const addToCart = useCallback(
    (item: CartItem) => {
      if (!item.product?._id) {
        toast.error("Invalid product information.");
        return;
      }

      const { product, quantity, variantID } = item;

      if (!isValidQuantity(quantity)) {
        toast.error("Quantity must be a positive number.");
        return;
      }

      // Handle variants logic
      let availableStock = product.stock || 0;
      if (product.isVariant) {
        if (!variantID) {
          toast.error("Please select a product variant.");
          return;
        }

        const matchingVariant = product.variants?.find((v) => v._id === variantID);
        if (!matchingVariant) {
          toast.error("Selected variant is not available.");
          return;
        }
        availableStock = matchingVariant.stock;
      }

      if (quantity > availableStock) {
        toast.error(`Only ${availableStock} item(s) available.`);
        return;
      }

      const successToastId = `add-item-${product._id}-${variantID || "default"}`;
      const errorToastId = `add-error-${product._id}`;

      const existingItem = findCartItem(cartItems, product._id, variantID);

      if (existingItem) {
        if (existingItem.quantity + quantity > availableStock) {
          toast.error(`Cannot add more items. Stock limit reached.`, { toastId: errorToastId });
          return;
        }

        setCartItems((prev) =>
          prev.map((i) => i === existingItem ? { ...i, quantity: i.quantity + quantity } : i)
        );
        toast.success("Cart updated!", { toastId: successToastId });
      } else {
        setCartItems((prev) => [...prev, item]);
        toast.success("Item added to cart!", { toastId: successToastId });
      }
    },
    [cartItems, setCartItems, findCartItem]
  );

  /**
   * Update quantity of an existing item
   */
  const updateItemQuantity = useCallback(
    (productID: string, quantity: number, variantID?: string) => {
      if (!isValidQuantity(quantity)) {
        toast.error("Invalid quantity.");
        return;
      }

      const item = findCartItem(cartItems, productID, variantID);
      if (!item) {
        toast.error("Product not found in cart.");
        return;
      }

      const availableStock = item.variantID
        ? item.product.variants?.find(v => v._id === item.variantID)?.stock || 0
        : item.product.stock || 0;

      if (quantity > availableStock) {
        toast.error(`Only ${availableStock} item(s) available.`);
        return;
      }

      if (item.quantity === quantity) return;

      setCartItems((prev) =>
        prev.map((i) => i.product._id === productID && (!variantID || i.variantID === variantID) ? { ...i, quantity } : i)
      );
      toast.success("Quantity updated!", { toastId: `update-qty-${productID}` });
    },
    [cartItems, setCartItems, findCartItem]
  );

  /**
   * Remove an item from the cart
   */
  const removeFromCart = useCallback(
    (productID: string, variantID?: string) => {
      const exists = findCartItem(cartItems, productID, variantID);
      if (!exists) {
        toast.error("Product not found in cart.");
        return;
      }

      setCartItems((prev) =>
        prev.filter((i) => i.product._id !== productID || (variantID && i.variantID !== variantID))
      );
      toast.info("Item removed.", { toastId: `remove-${productID}` });
    },
    [cartItems, setCartItems, findCartItem]
  );

  /**
   * Clear the entire cart
   */
  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.info("Cart cleared.");
  }, [setCartItems]);

  // Computed values
  const subTotal = useMemo(() => calculateSubtotal(cartItems), [cartItems]);
  const totalItems = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);
  const cartCount = cartItems.length;

  return {
    cartItems,
    cartCount,
    totalItems,
    subTotal,
    totalCost: subTotal, // Alias for compatibility
    isHydrated,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    orderNumber,
    setOrderNumber,
    clearCart,
  };
};
