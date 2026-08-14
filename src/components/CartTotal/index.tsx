import { Button } from "../ui/button";
import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useFirstOrderDiscount } from "@/hooks/useFirstOrderDiscount";
import { useAuth } from "@/context/AuthContext";
import { FiTag } from "react-icons/fi";
import { useShippingFee } from "@/hooks/useShippingFee";

interface ShoppingBagProps {
  checkValidation: (discountAmount?: number) => void;
}

const CartTotals: React.FC<ShoppingBagProps> = ({ checkValidation }) => {
  const { subTotal } = useCart();
  const { deliveryFee, displayFee, shippingLabel } = useShippingFee(subTotal);
  console.log(
    "deliveryFee",
    deliveryFee,
    "displayFee",
    displayFee,
    "shippingLabel",
    shippingLabel,
  );
  const { authToken } = useAuth();
  const { isEligible, discountAmount, discountPercent, isLoading } =
    useFirstOrderDiscount();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const discountedTotal = subTotal - discountAmount + deliveryFee;

  const handleCheckout = () => {
    setIsCheckoutLoading(true);
    checkValidation(isEligible ? discountAmount : 0);
  };

  return (
    <div className="border lg:border-gray-200 border-gray-600 lg:p-6 p-4 w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">CART TOTALS</h2>

      {/* Subtotal */}
      <div className="flex justify-between mb-3">
        <span className="text-gray-700">SUBTOTAL</span>
        <span className="font-semibold text-gray-800">
          Rs. {subTotal.toFixed(0)}
        </span>
      </div>

      {/* First-order discount row */}
      {authToken && (
        <>
          {isLoading ? (
            <div className="flex justify-between mb-3 animate-pulse">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
          ) : isEligible && discountAmount > 0 ? (
            <div className="flex justify-between items-center mb-3 py-2 px-3 bg-gray-50 border border-gray-200">
              <span className="flex items-center gap-1.5 text-sm text-black font-medium">
                <FiTag size={13} className="shrink-0" />
                FIRST ORDER ({discountPercent}% OFF)
              </span>
              <span className="text-sm font-semibold text-black">
                − Rs. {discountAmount.toFixed(0)}
              </span>
            </div>
          ) : null}
        </>
      )}

      {/* Delivery */}
      <div className="flex justify-between mb-4">
        <span className="text-gray-700 text-sm">{shippingLabel}</span>
        <span className="text-sm text-gray-500">
          {deliveryFee ? deliveryFee : displayFee}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-3" />

      {/* Total */}
      <div className="flex justify-between mb-5">
        <span className="text-gray-800 font-semibold">TOTAL</span>
        <span className="text-xl font-semibold text-gray-800">
          Rs. {discountedTotal.toFixed(0)}
        </span>
      </div>

      <Button
        disabled={subTotal === 0}
        loading={isCheckoutLoading}
        className={`${
          subTotal === 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        } w-full bg-black text-white py-6 rounded-none shadow-none uppercase font-semibold`}
        onClick={handleCheckout}
      >
        PROCEED TO CHECKOUT
      </Button>

      {/* Discount hint for guests */}
      {!authToken && (
        <p className="mt-3 text-xs text-gray-400 text-center">
          Sign up to get{" "}
          <span className="font-semibold text-black">5% OFF</span> your first
          order.
        </p>
      )}
    </div>
  );
};

export default CartTotals;
