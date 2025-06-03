import { useCallback, useMemo } from "react";
import { useStore } from "@/Context/storeContext";
import { toast } from "react-toastify";
import { Product } from "@/components/productDetail/productDetailDto";

interface CartItem {
  // userId: string;
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
  variantID?: string;
}

export const useCart = () => {
  const { cartItems, setCartItems } = useStore();

  const validateQuantity = (quantity: number) => {
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Quantity must be a positive number greater than zero.");
      return false;
    }
    return true;
  };

 const addToCart = useCallback(
  (item: CartItem) => {
    if (!item.product || !item.product._id) {
      toast.error("Invalid product information.");
      return;
    }

    const { product, quantity, variantID } = item;

    if (!validateQuantity(quantity)) return;

    let updatedProduct = product;
    let updatedVariantID = variantID;

    if (product.isVariant) {
      if (!variantID) {
        toast.error("Please select a product variant.");
        return;
      }

      const matchingVariant = product.variants?.find(
        (variant) => variant._id === variantID
      );

      if (!matchingVariant) {
        toast.error("Selected color and size combination is not available.");
        return;
      }

      updatedVariantID = matchingVariant._id;
      updatedProduct = {
        ...product,
        stock: matchingVariant.stock,
      };
    }

    const availableStock = updatedVariantID
      ? updatedProduct.stock || 0
      : product.stock || 0;

    if (quantity > availableStock) {
      toast.error(
        `Only ${availableStock} item(s) available for ${
          product.productName || "this product"
        }`
      );
      return;
    }

    const successToastId = `add-item-${product._id}-${updatedVariantID || 'novariant'}`;
    const errorToastId = `add-error-${product._id}`;

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
        `No more item(s) can be added for ${
          product.productName || "this product"
        }`,
        { toastId: errorToastId }
      );
      return updatedItems;
    }

    updatedItems[existingItemIndex] = {
      ...existingItem,
      quantity: existingItem.quantity + quantity,
    };

    toast.success("Cart updated successfully!", { toastId: successToastId });
    return updatedItems;
  }

  toast.success("Item added to cart!", { toastId: successToastId });
  return [...prevItems, item];
});

  },
  [setCartItems]
);

  const updateItemQuantity = useCallback(
    (productID: string, quantity: number, variantID?: string) => {
      if (!productID) {
        toast.error("Invalid product information.");
        return;
      }

      if (!validateQuantity(quantity)) return;

      // First check if product exists
      const productExists = cartItems.some(item => 
        item.product._id === productID && (!variantID || item.variantID === variantID)
      );
      
      if (!productExists) {
        toast.error("Product not found in cart.");
        return;
      }

      // Check stock availability
      const itemToUpdate = cartItems.find(item => 
        item.product._id === productID && (!variantID || item.variantID === variantID)
      );
      
      if (itemToUpdate) {
        const availableStock = itemToUpdate.variantID
          ? itemToUpdate.product.stock || 0
          : itemToUpdate.product.stock || 0;
        
        if (quantity > availableStock) {
          toast.error(`Only ${availableStock} item(s) available.`);
          return;
        }
        
        // Only proceed with update if quantity is different
        if (itemToUpdate.quantity !== quantity) {
          // Create a unique ID for the toast based on product and action
          const toastId = `update-quantity-${productID}`;
          
          setCartItems(prevItems => {
            const newItems = prevItems.map(item => {
              if (item.product._id === productID && (!variantID || item.variantID === variantID)) {
                return { ...item, quantity };
              }
              return item;
            });
            
            // Show toast only ONCE per update operation
            toast.success("Quantity updated successfully!", { toastId });
            
            return newItems;
          });
        }
      }
    },
    [cartItems, setCartItems]
  );

  const removeFromCart = useCallback(
    (productID: string, variantID?: string) => {
      if (!productID) {
        toast.error("Invalid product information.");
        return;
      }
      
      // Create a unique ID for the toast
      const toastId = `remove-item-${productID}`;
      
      setCartItems((prevItems) => {
        const itemExists = prevItems.some(
          item => item.product._id === productID && 
          (!variantID || item.variantID === variantID)
        );
        
        if (!itemExists) {
          toast.error("Product not found in cart.");
          return prevItems;
        }
        
        const filteredItems = prevItems.filter(
          (item) =>
            item.product._id !== productID ||
            (variantID && item.variantID !== variantID)
        );
        
        // Show toast only ONCE per removal operation
        toast.info("Item removed from cart.", { toastId });
        
        return filteredItems;
      });
    },
    [setCartItems]
  );

  const clearCart = useCallback(() => {
    const toastId = "clear-cart";
    setCartItems([]);
    toast.info("Cart cleared.", { toastId });
  }, [setCartItems]);

  const subTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const basePrice = (Number(item.product.salePrice) || 0) * item.quantity;

      const variant = item.variantID
        ? item.product.variants?.find((v) => v._id === item.variantID)
        : null;
      const additionalSalePrice = Number(variant?.additionalSalePrice) || 0;

      return total + basePrice + (additionalSalePrice * item.quantity);
    }, 0);
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const totalCost = useMemo(() => subTotal, [subTotal]);

  return {
    cartItems,
    cartCount: cartItems.length,
    totalItems,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    subTotal,
    totalCost,
  };
};
