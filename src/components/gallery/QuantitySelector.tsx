// components/QuantitySelector.tsx
"use client";
import React from "react";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  setQuantity,
}) => {
  const handleIncrement = () => setQuantity((prevQuantity) => prevQuantity + 1);
  const handleDecrement = () =>
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));

  return (
    <div
      className="flex justify-between w-[100px] py-3 px-3 items-center border-2 border-gray-200 rounded-sm 
      transition-all duration-300 ease-in-out hover:border-gray-300 hover:shadow-md"
    >
      <button
        onClick={handleDecrement}
        className="rounded text-gray-400 hover:text-rose-800 transition-colors duration-200"
      >
        -
      </button>
      <span className="font-medium text-gray-400">{quantity}</span>
      <button
        onClick={handleIncrement}
        className="rounded text-gray-400 hover:text-rose-800 transition-colors duration-200"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
