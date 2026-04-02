// src/components/OrderConfirmation.tsx
import Link from "next/link";
import React from "react";
import { useGetOrderDetailByorderNumber } from "./query/orderConfirmationQuery";
import { useCartContext } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import OrderConfirmationSkeleton from "../OrderSkeleton";

const OrderConfirmation = () => {
  const { orderNumber } = useCartContext();
  const { data, isLoading } = useGetOrderDetailByorderNumber(orderNumber);
  const router = useRouter();
  
  // Safe parsing to prevent crashes if items are missing
  const items = data?.data?.items || [];
  const subTotal = items.reduce(
    (acc, item) => acc + (item.lineTotal || 0),
    0
  );

  const deliveryFee = data?.data?.deliveryFee ?? 0;
  const totalCost = subTotal + deliveryFee;

  const formattedDate = data?.data?.createdAt 
    ? new Date(data.data.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      }) 
    : "Recently";

  // Use dynamic data if available, fallback to defaults
  const paymentMethod = data?.data?.paymentMethod || "Cash on delivery";
  const shippingType = deliveryFee === 0 ? "Free shipping" : `Rs. ${deliveryFee}`;

  if (isLoading) {
    return <OrderConfirmationSkeleton />;
  }
  
  return (
    <div className="flex flex-col items-center lg:p-8">
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
          <span>{data?.data?.orderNo || orderNumber}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Date:</span>
          <span>{formattedDate}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Total:</span>
          <span>{totalCost}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Payment Method:</span>
          <span>{paymentMethod}</span>
        </div>
      </div>

      {/* Order Details Table */}
      <div className="border-2 border-gray-400 p-4 w-full max-w-3xl">
        <h2 className="font-semibold mb-4">ORDER DETAILS</h2>
        <div className="flex justify-between font-semibold border-b border-gray-300 pb-2 mb-4 text-gray-600">
          <span>PRODUCT</span>
          <span>TOTAL</span>
        </div>
        <div>
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex justify-between ${items.length > 1 ? "border-b pb-2" : ""} `}
            >
              <div>
                {/* Fallback to product if it's a string, or product.productName if it's an object */}
                {typeof item.product === 'object' ? (item.product as any).productName : item.product} x {item.quantity}
              </div>
              <div>{item.lineTotal}</div>
            </div>
          ))}
          {items.length === 0 && <div className="text-gray-500 py-2">No items found.</div>}
        </div>
        <div className="flex justify-between font-semibold border-t border-gray-300 pt-4 mt-4">
          <span>SUBTOTAL:</span>
          <span>{subTotal}</span>
        </div>
        <div className="flex justify-between border-t border-gray-300 pt-2">
          <span>SHIPPING:</span>
          <span>{shippingType}</span>
        </div>
        <div className="flex justify-between border-t border-gray-300 pt-2">
          <span>PAYMENT METHOD:</span>
          <span>{paymentMethod}</span>
        </div>
        <div className="flex justify-between font-semibold border-t border-gray-300 pt-2">
          <span>TOTAL:</span>
          <span>{totalCost}</span>
        </div>
      </div>
      <div className="flex space-x-2 w-full max-w-3xl">
        <button
          className="bg-black flex-1  flex justify-center items-center mt-4 h-14 text-white py-2 px-4"
          onClick={() => {
            router.push(`/profile/order-details?orderId=${data?.data?.orderNo || orderNumber}&from=order-confirmation`);
          }}
        >
          Track Order
        </button>
        <Link
          href={"/"}
          className="bg-black flex-1 flex justify-center items-center mt-4 h-14 text-white py-2 px-4 "
        >
          Return to shop
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
