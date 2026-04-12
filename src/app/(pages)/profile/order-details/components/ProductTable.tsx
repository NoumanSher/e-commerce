// ProductTable.tsx
import React from "react";

const ProductTable: React.FC<{
  products: {
    product: string;
    price: string;
    quantity: string;
    lineTotal: string;
  }[];
}> = ({ products }) => (
  <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
    <table className="w-full text-left hidden lg:table border-collapse">
      <thead>
        <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200 bg-gray-50">
          <th className="py-4 pl-6 font-semibold">Product</th>
          <th className="py-4 font-semibold">Price</th>
          <th className="py-4 font-semibold text-center">Quantity</th>
          <th className="py-4 pr-6 font-semibold text-right">Subtotal</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {products?.map((product, index) => (
          <tr key={index} className="hover:bg-gray-50 transition-colors">
            <td className="py-4 pl-6 text-sm font-medium text-gray-900">{product.product.slice(0,35)}</td>
            <td className="py-4 text-sm text-gray-600">Rs {product.price}</td>
            <td className="py-4 text-sm text-gray-600 text-center">{product.quantity}</td>
            <td className="py-4 pr-6 text-sm font-medium text-gray-900 text-right">Rs {product.lineTotal}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* mobile view */}
    <div className="lg:hidden flex flex-col divide-y divide-gray-100">
      {products?.map((product, index) => (
        <div key={index} className="p-5 bg-white text-sm">
          <div className="mb-3 font-semibold text-gray-900 text-base">{product.product}</div>
          <div className="flex justify-between items-center text-gray-600 mb-2">
            <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Price</span>
            <span className="font-medium text-gray-900">Rs {product.price}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600 mb-2">
            <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Quantity</span>
            <span className="font-medium text-gray-900">{product.quantity}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600 pt-3 mt-3 border-t border-gray-50">
            <span className="text-gray-500 text-xs uppercase tracking-wider font-bold text-gray-700">Subtotal</span>
            <span className="font-bold text-gray-900">Rs {product.lineTotal}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProductTable;
