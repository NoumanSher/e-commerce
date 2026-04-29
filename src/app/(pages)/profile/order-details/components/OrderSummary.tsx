// OrderSummary.tsx
import React from 'react';

const OrderSummary: React.FC<{ orderId: string; paymentMethod: string; subtotal: string; delivery: string; total: string; discountAmount?: number }> = ({ orderId, paymentMethod, subtotal, delivery, total, discountAmount = 0 }) => (
  <div className="bg-white border border-gray-200 w-full p-8 rounded-lg shadow-sm flex flex-col justify-center h-full min-h-[250px]">
    <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</span>
        <span className="font-medium text-gray-900 text-sm">#{orderId}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment Method</span>
        <span className="font-medium text-gray-900 text-sm">{paymentMethod}</span>
      </div>
      <div className="border-t border-gray-100 my-4"></div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500 font-medium text-sm">Subtotal:</span>
        <span className="font-medium text-gray-900 text-sm">Rs {subtotal}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500 font-medium text-sm">Delivery:</span>
        <span className="font-medium text-gray-900 text-sm">Rs {delivery}</span>
      </div>
      {discountAmount > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium text-sm">Discount:</span>
          <span className="font-medium text-gray-900 text-sm">- Rs {discountAmount}</span>
        </div>
      )}
      <div className="border-t border-gray-200 my-4"></div>
      <div className="flex justify-between items-center">
        <span className="text-base font-bold text-gray-900">Total:</span>
        <span className="text-base font-bold text-gray-900">Rs {total}</span>
      </div>
    </div>
  </div>
);

export default OrderSummary;

