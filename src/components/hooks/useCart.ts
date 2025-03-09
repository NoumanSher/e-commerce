import { useCallback, useMemo } from "react";
import { useStore } from "@/Context/storeContext";
import { toast } from "react-toastify";
import { ProductCardDataProps } from "@/data/dataProps";

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

  // Helper function: Validate quantity
  const validateQuantity = (quantity: number) => {
    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero.");
      return false;
    }
    return true;
  };

  const addToCart = useCallback(
    (item: CartItem) => {
      debugger;
      const { product, quantity, variantID } = item;

      if (!validateQuantity(quantity)) return;

      // Check if the product has variants
      if (product.isVariant) {
        // Find the matching variant based on color and size
        const matchingVariant = product.variants?.find(
          (variant) => variant._id === variantID
        );

        if (!matchingVariant) {
          toast.error("Selected color and size combination is not available.");
          return;
        }

        // Update the item with the matching variant's details
        item.variantID = matchingVariant._id;
        item.product = {
          ...product,
          stock: matchingVariant.stock, // Use the variant's stock
        };
      }

      // Validate stock
      const availableStock = item.variantID
        ? item.product.stock || 0
        : product.stock || 0;

      if (quantity > availableStock) {
        toast.error(
          `Only ${availableStock} item(s) available for ${
            product.productName || "this product"
          }`
        );
        return;
      }
debugger
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (cartItem) =>
            cartItem.product._id === product._id &&
            cartItem.variantID === item.variantID
        );

        if (existingItemIndex >= 0) {
          const updatedItems = [...prevItems];
          const existingItem = updatedItems[existingItemIndex];

          if (existingItem.quantity + quantity > availableStock) {
            toast.error(
              `no more item(s) can be added for ${
                product.productName || "this product"
              }`
            );
            return updatedItems;
          }

          updatedItems[existingItemIndex].quantity += quantity;
          toast.success("Cart updated successfully!");
          return updatedItems;
        }

        toast.success("Item added to cart!");
        return [...prevItems, item];
      });
    },
    [setCartItems]
  );

  // Update the quantity of an item
  const updateItemQuantity = useCallback(
    (productID: string, quantity: number, variantID?: string) => {
      if (!validateQuantity(quantity)) return;

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product._id === productID &&
          (!variantID || item.variantID === variantID)
            ? { ...item, quantity }
            : item
        )
      );
      toast.success("Quantity updated successfully!");
    },
    [setCartItems]
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
      toast.info("Item removed from cart.");
    },
    [setCartItems]
  );

  // Clear all items from the cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.info("Cart cleared.");
  }, [setCartItems]);

  // Calculate subTotal
  const subTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const basePrice = item.product.salePrice || 0;

      // Handle variants
      const variant = item.variantID
        ? item.product.variants?.find((v) => v._id === item.variantID)
        : null;
      const additionalSalePrice = variant?.additionalSalePrice || 0;

      return total + (basePrice + additionalSalePrice) * item.quantity;
    }, 0);
  }, [cartItems]);

  // Calculate totalCost
  const totalCost = useMemo(() => subTotal, [subTotal]);

  return {
    cartItems,
    cartCount: cartItems.length,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    subTotal,
    totalCost,
  };
};
