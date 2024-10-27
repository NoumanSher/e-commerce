import React from 'react';

const OrderSummaryComponent: React.FC = () => (
  <div className="p-4 border rounded mb-4">
    <h2 className="text-xl font-bold mb-4">Your Order</h2>
    <div className="flex justify-between text-gray-700 border-b py-2">
      <span>Product</span>
      <span>Subtotal</span>
    </div>
    <div className="flex justify-between py-2">
      <span>Summer Dress Women Short Sleeve × 1</span>
      <span>$75.00</span>
    </div>
    <div className="flex justify-between py-2">
      <span>Women’s Sleeve Fully Beaded Gown × 1</span>
      <span>$60.00</span>
    </div>
    <div className="flex justify-between text-gray-700 border-t border-b py-2 font-semibold">
      <span>Subtotal</span>
      <span>$135.00</span>
    </div>
    <div className="py-2">
      <label className="flex items-center space-x-2">
        <input type="radio" name="shipping" defaultChecked className="form-radio" />
        <span>Free shipping</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="radio" name="shipping" className="form-radio" />
        <span>Flat rate: $59.00</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="radio" name="shipping" className="form-radio" />
        <span>Local pickup: $8.00</span>
      </label>
    </div>
    <div className="flex justify-between text-xl font-bold mt-4">
      <span>Total</span>
      <span>$135.00</span>
    </div>
  </div>
);

export default OrderSummaryComponent;
