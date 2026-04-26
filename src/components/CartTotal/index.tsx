import { Button } from "../ui/button";
import React, { useState } from "react";
import { useCart } from "../hooks/useCart";

interface ShoppingBagProps {
  checkValidation: any;
}
const CartTotals: React.FC<ShoppingBagProps> = ({ checkValidation }) => {
  // const [selectedShipping, setSelectedShipping] = useState("free");
  const { subTotal, totalCost } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = () => {
    setIsLoading(true);
    checkValidation();
    // No need to set back to false as it navigates away
  };

  return (
    <div className="border lg:border-gray-200 border-gray-600 lg:p-6 p-4  w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">CART TOTALS</h2>
      <div className="flex justify-between mb-4">
        <span className="text-gray-700">SUBTOTAL</span>
        <span className="font-semibold text-gray-800">
          {subTotal.toFixed(0)}
        </span>
      </div>

      <div className="mb-4">
        <div className="mt-2">
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <span className="text-gray-800 font-semibold">TOTAL</span>
        <span className="text-xl font-semibold text-gray-800">
          {totalCost.toFixed(0)}
        </span>
      </div>

      <Button
        disabled={totalCost === 0}
        loading={isLoading}
        className={`${totalCost === 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer"} w-full bg-black text-white py-6 rounded-none shadow-none uppercase font-semibold`}
        onClick={handleCheckout}
      >
        PROCEED TO CHECKOUT
      </Button>
    </div>
  );
};

export default CartTotals;
