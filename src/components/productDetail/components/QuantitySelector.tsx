import React from "react";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  setQuantity,
  className,
}) => {
  const handleIncrement = () => setQuantity((prevQuantity) => prevQuantity + 1);
  const handleDecrement = () =>
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));

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

export default React.memo(QuantitySelector);
