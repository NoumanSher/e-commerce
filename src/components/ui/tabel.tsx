// /components/ProductTable.tsx

import { useState } from "react";
import QuantitySelector from "../productDetail/components/QuantitySelector";

interface Product {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
}

const ProductTable: React.FC<{ products: Product[] }> = ({ products }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="w-full border-b border-gray-300 pb-4">
      {/* Table View for Larger Screens */}
      <table className="hidden md:table w-full">
        <thead>
          <tr className="text-left border-b border-gray-300 text-gray-600">
            <th className="py-4">IMAGE</th>
            <th className="py-4">PRODUCT NAME</th>
            <th className="py-4">PRICE</th>
            <th className="py-4">QUANTITY</th>
            <th className="py-4">TOTAL</th>
            <th className="py-4"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-200">
              <td className="py-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-20 h-24 object-cover"
                />
              </td>
              <td className="py-4 text-gray-700">{product.name}</td>
              <td className="py-4 text-gray-700">
                ${product.price.toFixed(2)}
              </td>
              <td className="py-4">
                <QuantitySelector
                  quantity={quantity}
                  setQuantity={setQuantity}
                  className="h-14"
                />
              </td>
              <td className="py-4 text-gray-700">
                ${(product.price * product.quantity).toFixed(2)}
              </td>
              <td className="py-4 text-gray-700 cursor-pointer">×</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Compact Column View for Mobile Screens */}
      <div className="block md:hidden space-y-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border-b border-gray-300 py-4 flex flex-col space-y-2"
          >
            {/* Row with image, name, and delete icon */}
            <div className="flex items-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-20 h-20 object-cover mr-4"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{product.name}</p>
              </div>
              <button className="text-red-500 ml-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Row with price, quantity selector, and total */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700">{product.price.toFixed(2)}</span>
              <QuantitySelector
                quantity={quantity}
                setQuantity={setQuantity}
                className="flex items-center !w-24"
              />
              <span className="text-gray-700 font-semibold">
                {(product.price * product.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTable;
