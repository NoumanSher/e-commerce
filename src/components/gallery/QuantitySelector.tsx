// components/QuantitySelector.tsx
import { useState } from 'react';

const QuantitySelector: React.FC = () => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex items-center mt-4">
      <button
        className="px-4 py-2 border"
        onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
      >
        -
      </button>
      <span className="px-4 py-2">{quantity}</span>
      <button
        className="px-4 py-2 border"
        onClick={() => setQuantity((prev) => prev + 1)}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
