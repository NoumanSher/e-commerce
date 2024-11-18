import React, { useState } from "react";
import { toast } from "react-toastify";

interface QuantitySelectorProps {
  quantity: number;
  stock: number;
  onQuantityChange: (quantity: number) => void;

  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  className,
  onQuantityChange,
  stock
}) => {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);

  const handleIncrement = () => {
    setCurrentQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;

      if (stock === undefined || newQuantity <= stock) {
        onQuantityChange(newQuantity);
        return newQuantity;
      }

      if (newQuantity > stock) {
        toast.error(`Only ${stock} Product(s) Available In This Category.`);
      }
      return prevQuantity;
    });
  };

  const handleDecrement = () => {
    setCurrentQuantity((prevQuantity) => {
      const newQuantity = Math.max(prevQuantity - 1, 1);
      onQuantityChange(newQuantity);
      return newQuantity;
    });
  };
  return (
    <div
      className={`${className} flex justify-between w-[120px] py-3 px-3 items-center border border-gray-300 rounded-sm 
      transition-all duration-300 ease-in-out hover:border-gray-400 hover:shadow-md`}
    >
      <button
        onClick={handleDecrement}
        className="rounded text-gray-400 hover:text-rose-800 transition-colors duration-200"
      >
        -
      </button>
      <span className="font-medium text-gray-400">{currentQuantity}</span>
      <button
        onClick={handleIncrement}
        className="rounded text-gray-400 hover:text-rose-800 transition-colors duration-200"
      >
        +
      </button>
    </div>
  );
};
QuantitySelector.displayName = "QuantitySelector";


export default React.memo(QuantitySelector);
