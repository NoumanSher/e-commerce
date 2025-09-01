import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaMinus, FaPlus } from "react-icons/fa";

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
  stock,
}) => {
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  useEffect(() => {
    setCurrentQuantity(quantity);
  }, [quantity]);
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
        className="rounded text-gray-700  hover:text-rose-800 transition-colors duration-200"
        disabled={currentQuantity === 1 || currentQuantity === 0} // Disable decrement button when quantity is 0
        style={{
          cursor: currentQuantity === 0 ? "not-allowed" : "pointer",
          opacity: currentQuantity === 0 ? 0.5 : 1,
        }}
      >
        <FaMinus />
      </button>
      <span className="font-semibold text-black">{currentQuantity}</span>
      <button
        onClick={handleIncrement}
        className="rounded text-gray-700 hover:text-green-500 transition-colors duration-200"
        disabled={stock !== undefined && currentQuantity >= stock} // Disable increment button when quantity reaches stock limit
        style={{
          cursor:
            stock !== undefined && currentQuantity >= stock
              ? "not-allowed"
              : "pointer",
          opacity: stock !== undefined && currentQuantity >= stock ? 0.5 : 1,
        }}
      >
        <FaPlus />
      </button>
    </div>
  );
};
QuantitySelector.displayName = "QuantitySelector";

export default React.memo(QuantitySelector);
