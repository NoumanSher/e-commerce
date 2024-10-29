// src/components/OrderConfirmation.tsx
import Link from "next/link";
import React from "react";

const OrderConfirmation = () => {
  return (
    <div className="flex flex-col items-center lg:p-8 p-4">
      {/* Success Icon and Message */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-yellow-600 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="white"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Your order is completed!</h1>
        <p className="text-gray-600">
          Thank you. Your order has been received.
        </p>
      </div>

      {/* Order Summary Details */}
      <div className="border-dotted border-2 border-gray-400 p-4 w-full max-w-3xl text-sm mb-8">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Order Number:</span>
          <span>7886</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Date:</span>
          <span>October 29, 2024</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Total:</span>
          <span>$110.00</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Payment Method:</span>
          <span>Cash on delivery</span>
        </div>
      </div>

      {/* Order Details Table */}
      <div className="border-2 border-gray-400 p-4 w-full max-w-3xl">
        <h2 className="font-semibold mb-4">ORDER DETAILS</h2>
        <div className="flex justify-between font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-600">
          <span>PRODUCT</span>
          <span>TOTAL</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Dress Neck Casual Short Dresses × 1</span>
          <span>$110.00</span>
        </div>
        <div className="flex justify-between font-semibold border-t border-gray-300 pt-4 mt-4">
          <span>SUBTOTAL:</span>
          <span>$110.00</span>
        </div>
        <div className="flex justify-between border-t border-gray-300 pt-2">
          <span>SHIPPING:</span>
          <span>Free shipping</span>
        </div>
        <div className="flex justify-between border-t border-gray-300 pt-2">
          <span>PAYMENT METHOD:</span>
          <span>Cash on delivery</span>
        </div>
        <div className="flex justify-between font-semibold border-t border-gray-300 pt-2">
          <span>TOTAL:</span>
          <span>$110.00</span>
        </div>
      </div>
      <Link href={'/'}
        className="bg-black w-full lg:w-[48rem] flex justify-center items-center mt-4 h-14 text-white py-2 px-4 "
      >
        Return to shop
      </Link>
    </div>
  );
};

export default OrderConfirmation;
