import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useCart } from "../hooks/useCart";
import QuantitySelector from "../productDetail/components/QuantitySelector";
import Image from "next/image";
import useSwipeClose from "@/hooks/useSwipeClose";
import { calculateDiscountedPrice, formatPrice } from "@/lib/utils";

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
  const {
    cartItems,
    totalCost,
    updateItemQuantity,
    cartCount,
    removeFromCart,
  } = useCart();

  const router = useRouter();
  useSwipeClose("shopping-cart-panel", onClose);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);
  const handleQuantityChange = (
    productId: string,
    quantity: number,
    variantId?: string
  ) => {
    const item = cartItems.find(
      (item) => item.product._id === productId && item.variantID === variantId
    );
    if (item) {
      const selectedVariant = item.product?.variants?.find(
        (variant) => variant._id === variantId
      );
      const availableStock = selectedVariant
        ? selectedVariant.stock
        : item.product.stock;

      if (quantity > availableStock) {
        toast.error(`Only ${availableStock} available.`);
        quantity = availableStock; // Cap quantity at available stock
        return;
      }
    }
    updateItemQuantity(productId, quantity, variantId);
  };
  return (
    <>
      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Shopping Cart Modal */}
      <div
        id="shopping-cart-panel"
        className={`fixed top-0 right-0 w-full sm:w-[25rem] h-full bg-white shadow-lg z-50 transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-[#faf9f8] p-6 border-b">
          <h2 className="text-lg font-bold">
            Shopping Cart <span className="text-sm">({cartCount})</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 text-4xl hover:text-black"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {cartItems.length > 0 ? (
            cartItems.map((cartItem, index) => {
              const selectedVariant = cartItem.product.variants?.find(
                (varient) => varient._id === cartItem.variantID
              );
              const basePrice = cartItem.product.salePrice;
              const extaPrice = selectedVariant?.additionalSalePrice || 0;
              const discount = cartItem.product.discount || 0;
              const finalPrice = calculateDiscountedPrice(basePrice + extaPrice, discount);
              return (
                <div key={index}>
                  {/* Product Item */}
                  <div className="flex h-32 items-center mb-4">
                    <Image
                      src={cartItem.product.images[0].src}
                      alt={cartItem.product.images[0].alt}
                      width={112}
                      height={112}
                      className="w-[7rem] h-[7rem] object-cover"
                    />
                    <div className="flex-1 ml-4">
                      <h3 className="font-semibold line-clamp-1">
                        {cartItem.product.productName}
                      </h3>
                      {cartItem.product.isVariant && (
                        <>
                          <p className="text-sm text-gray-500">
                            Color: {cartItem.color}
                          </p>
                          <p className="text-sm text-gray-500">
                            Size: {cartItem.size}
                          </p>
                        </>
                      )}

                      <QuantitySelector
                        className="border-0 hover:shadow-none"
                        quantity={cartItem.quantity}
                        stock={
                          selectedVariant?.stock
                            ? selectedVariant?.stock
                            : cartItem.product.stock
                        }
                        onQuantityChange={(quantity) =>
                          handleQuantityChange(
                            cartItem.product._id,
                            quantity,
                            cartItem.variantID
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-col py-[14px] justify-between h-full">
                      <button
                        onClick={() =>
                          removeFromCart(
                            cartItem.product._id,
                            cartItem.variantID
                          )
                        }
                        className="text-red-500 text-xl hover:text-red-700"
                      >
                        &times;
                      </button>
                      <p className="font-bold">Rs {formatPrice(finalPrice)}</p>
                    </div>
                  </div>

                  {/* Separator Line */}
                  {index < cartItems.length - 1 && (
                    <hr className="border-t border-gray-300 my-4 " />
                  )}
                </div>
              );
            })
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-bold">Subtotal:</span>
            <span className="font-bold">{totalCost.toFixed(0)}</span>
          </div>
          <button
            className="w-full bg-gray-800 text-white py-2 rounded-md mb-2"
            onClick={() => {
              router.push("/cart?section=shoppingbag"), onClose();
            }}
          >
            View Cart
          </button>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-md"
            onClick={() => {
              router.push("/cart?section=fscm"), onClose();
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
