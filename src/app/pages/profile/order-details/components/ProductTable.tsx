// ProductTable.tsx
import React from "react";

const ProductTable: React.FC<{
  products: {
    name: string;
    price: string;
    quantity: string;
    subtotal: string;
  }[];
}> = ({ products }) => (
  <>
    <table className="w-full mt-4 text-left hidden lg:inline-table">
      <thead>
        <tr className="text-gray-500 bg-customGray border-b">
          <th className="py-2 pl-4">Product</th>
          <th className="py-2">Price</th>
          <th className="py-2">Quantity</th>
          <th className="py-2">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={index} className="border-b">
            <td className="py-2 pl-4">{product.name}</td>
            <td className="py-2">{product.price}</td>
            <td className="py-2">{product.quantity}</td>
            <td className="py-2">{product.subtotal}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* mobile view */}
    <div className="space-y-4 mt-4 lg:hidden">
      {products.map((product, index) => (
        <div
          key={index}
          className="p-4 border rounded-lg bg-gray-50 shadow-sm text-sm"
        >
          <div className="mb-2 font-semibold text-gray-700">{product.name}</div>
          <div className="text-gray-500">
            Price: <span className="text-gray-700">{product.price}</span>
          </div>
          <div className="text-gray-500">
            Quantity: <span className="text-gray-700">{product.quantity}</span>
          </div>
          <div className="text-gray-500">
            Subtotal: <span className="text-gray-700">{product.subtotal}</span>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default ProductTable;
