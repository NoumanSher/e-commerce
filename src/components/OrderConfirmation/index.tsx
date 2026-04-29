import Link from "next/link";
import React, { useEffect } from "react";
import { useGetOrderDetailByorderNumber } from "./query/orderConfirmationQuery";
import { useCartContext } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import OrderConfirmationSkeleton from "../OrderSkeleton";

const OrderConfirmation = () => {
  const { orderNumber } = useCartContext();
  const { data, isLoading } = useGetOrderDetailByorderNumber(orderNumber);
  const router = useRouter();
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  
  // Safe parsing to prevent crashes if items are missing
  const items = data?.data?.items || [];
  const subTotal = data?.data?.orderDetails?.subTotal ?? items.reduce(
    (acc, item) => acc + (item.lineTotal || 0),
    0
  );

  const deliveryFee = data?.data?.orderDetails?.deliveryFee ?? data?.data?.deliveryFee ?? 0;
  const discountAmount = data?.data?.orderDetails?.discountAmount ?? 0;
  const totalCost = data?.data?.orderDetails?.totalPrice ?? (subTotal + deliveryFee - discountAmount);

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
    <div className="flex flex-col items-center w-full lg:py-12 animate-in fade-in duration-500">
      {/* Success Icon and Message */}
      <div className="flex flex-col items-center mb-10">
        <div className="bg-black rounded-full w-20 h-20 flex items-center justify-center mb-6 shadow-md transition-transform hover:scale-105 duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="white"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-black text-center">
          Order Successful!
        </h1>
        <p className="text-gray-500 text-center max-w-md">
          Thank you for shopping with us. Your order has been received and is now being processed.
        </p>
      </div>

      {/* Order Summary Details Container */}
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
        
        {/* Metric Header Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Order Number</p>
            <p className="font-semibold text-black break-all">{data?.data?.orderNo || orderNumber}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Date</p>
            <p className="font-semibold text-black">{formattedDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Total</p>
            <p className="font-semibold text-black">Rs. {totalCost}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Payment Method</p>
            <p className="font-semibold text-black">{paymentMethod}</p>
          </div>
        </div>

        {/* Order Details List */}
        <div className="p-6">
          <h2 className="font-bold text-lg mb-4 text-black border-b border-gray-100 pb-2">Order Details</h2>
          <div className="divide-y divide-gray-50">
            {items.map((item, index) => (
              <div
                key={index}
                className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 group"
              >
                <div className="flex items-start flex-1 min-w-0 pr-4">
                  <div className="w-full">
                    <p className="font-semibold text-black group-hover:text-gray-600 transition-colors break-words">
                      {typeof item.product === 'object' ? (item.product as any).productName : item.product}
                    </p>
                    {item.variant && (
                      <p className="text-xs text-gray-400 mt-1 uppercase font-medium tracking-wider">
                        Variant: {item.variant.name}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="font-medium text-black sm:text-right shrink-0">
                  Rs. {item.lineTotal}
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="text-gray-400 py-4 text-center">No items found.</div>}
          </div>

          {/* Totals Section */}
          <div className="mt-4 pt-6 border-t border-gray-200 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="font-semibold text-black">Rs. {subTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Shipping</span>
              <span className="font-semibold text-black">{shippingType}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm py-2 px-2 bg-gray-50">
                <span className="text-black font-medium">First Order Discount</span>
                <span className="font-semibold text-black">− Rs. {discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-base pt-4 mt-4 border-t border-gray-100">
              <span className="text-black font-bold uppercase tracking-wide">Total to pay</span>
              <span className="text-black font-extrabold">Rs. {totalCost}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl">
        <button
          className="bg-black flex-1 flex justify-center items-center h-14 text-white font-semibold hover:bg-gray-800 transition-colors rounded-none"
          onClick={() => {
            router.push(`/profile/order-details?orderId=${data?.data?.orderNo || orderNumber}&from=order-confirmation`);
          }}
        >
          Track Order
        </button>
        <Link
          href={"/"}
          className="bg-white border-2 border-black flex-1 flex justify-center items-center h-14 text-black font-semibold hover:bg-gray-50 transition-colors rounded-none"
        >
          Return to Shop
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
