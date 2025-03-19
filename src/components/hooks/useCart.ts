import { useCallback, useMemo } from "react";
import { useStore } from "@/Context/storeContext";
import { toast } from "react-toastify";
import { Product } from "@/components/productDetail/productDetailDto";

interface CartItem {
  userId: string;
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
  variantID?: string;
}

export const useCart = () => {
  const { cartItems, setCartItems } = useStore();

  const validateQuantity = (quantity: number) => {
    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero.");
      return false;
    }
    return true;
  };

  const addToCart = useCallback(
    (item: CartItem) => {
      const { product, quantity, variantID } = item;

      if (!validateQuantity(quantity)) return;

      if (product.isVariant) {
        const matchingVariant = product.variants?.find(
          (variant) => variant._id === variantID
        );

        if (!matchingVariant) {
          toast.error("Selected color and size combination is not available.");
          return;
        }

        item.variantID = matchingVariant._id;
        item.product = {
          ...product,
          stock: matchingVariant.stock,
        };
      }

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

      let toastMessage = "";
      let stockLimitExceeded = false;

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
            stockLimitExceeded = true;
            return updatedItems;
          }

          updatedItems[existingItemIndex].quantity += quantity;
          toastMessage = "Cart updated successfully!";
          return updatedItems;
        }

        toastMessage = "Item added to cart!";
        return [...prevItems, item];
      });

      if (stockLimitExceeded) {
        toast.error(
          `No more item(s) can be added for ${
            product.productName || "this product"
          }`
        );
      } else if (toastMessage) {
        toast.success(toastMessage);
      }
    },
    [setCartItems]
  );

  const updateItemQuantity = useCallback(
    (productID: string, quantity: number, variantID?: string) => {
      if (!validateQuantity(quantity)) return;

      let toastMessage = "";

      setCartItems((prevItems) => {
        return prevItems.map((item) => {
          if (item.product._id === productID && (!variantID || item.variantID === variantID)) {
            if (item.quantity !== quantity) {
              toastMessage = "Quantity updated successfully!";
            }
            return { ...item, quantity };
          }
          return item;
        });
      });

      if (toastMessage) {
        toast.success(toastMessage);
      }
    },
    [setCartItems]
  );

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

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.info("Cart cleared.");
  }, [setCartItems]);

  const subTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const basePrice = item.product.salePrice || 0 * item.quantity

      const variant = item.variantID
        ? item.product.variants?.find((v) => v._id === item.variantID)
        : null;
      const additionalSalePrice = variant?.additionalSalePrice || 0;

      return total + (basePrice + additionalSalePrice);
    }, 0);
  }, [cartItems]);

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
