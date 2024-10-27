// /components/CartTotals.tsx
import React, { useState } from 'react';

interface ShoppingBagProps {
    checkValidation: any
  }
const CartTotals: React.FC<ShoppingBagProps> = ({checkValidation}) => {
  const [selectedShipping, setSelectedShipping] = useState('free');

  return (
    <div className="border lg:border-gray-200 border-gray-600 lg:p-6 p-4  w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">CART TOTALS</h2>
      <div className="flex justify-between mb-4">
        <span className="text-gray-700">SUBTOTAL</span>
        <span className="font-semibold text-gray-800">$135.00</span>
      </div>

      <div className="mb-4">
        <span className="text-gray-700">SHIPPING</span>
        <div className="mt-2">
          <label className="block">
            <input
              type="radio"
              name="shipping"
              value="free"
              checked={selectedShipping === 'free'}
              onChange={() => setSelectedShipping('free')}
              className="mr-2"
            />
            Free shipping
          </label>
          <label className="block">
            <input
              type="radio"
              name="shipping"
              value="flat"
              checked={selectedShipping === 'flat'}
              onChange={() => setSelectedShipping('flat')}
              className="mr-2"
            />
            Flat rate: <span className="font-semibold">$59.00</span>
          </label>
          <label className="block">
            <input
              type="radio"
              name="shipping"
              value="pickup"
              checked={selectedShipping === 'pickup'}
              onChange={() => setSelectedShipping('pickup')}
              className="mr-2"
            />
            Local pickup: <span className="font-semibold">$8.00</span>
          </label>
        </div>
        <p className="mt-2 text-gray-700">Shipping to NY.</p>
        <button className="text-gray-700 underline mt-2">CHANGE ADDRESS</button>
      </div>

      <div className="flex justify-between mb-4">
        <span className="text-gray-800 font-semibold">TOTAL</span>
        <span className="text-xl font-semibold text-gray-800">$135.00</span>
      </div>

      <button className="w-full bg-black text-white py-3" onClick={() => checkValidation()}>PROCEED TO CHECKOUT</button>
    </div>
  );
};

export default CartTotals;
