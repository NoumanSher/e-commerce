// ProductTable.tsx
import React from 'react';

const ProductTable: React.FC<{ products: { name: string; price: string; quantity: string; subtotal: string }[] }> = ({ products }) => (
  <table className="w-full mt-4 text-left">
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
);

export default ProductTable;
