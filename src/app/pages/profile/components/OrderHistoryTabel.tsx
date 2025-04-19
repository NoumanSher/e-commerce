// OrderHistory.tsx
import React from "react";
import { OrderHistoryProps } from "../types/profileTypes";
import Link from "next/link";

const OrderHistoryTabel: React.FC<
  OrderHistoryProps & { pagination?: React.ReactNode }> = ({ orders, title, isButtonVisible, pagination }) => (
  <>
    <div className="p-6 bg-white rounded-lg shadow-md hidden lg:block">
      <div className="flex justify-between items-center border-b pb-3 mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {isButtonVisible && (
          <Link
            href="/pages/profile/order-history"
            className="text-blue-500 underline"
          >
            View All
          </Link>
        )}
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="py-2">Order ID</th>
            <th className="py-2">Date</th>
            <th className="py-2">Total</th>
            <th className="py-2">Status</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId} className="border-b text-sm">
              <td className="py-2">#{order.orderNo}</td>
              <td className="py-2">{order.createdAt}</td>
              <td className="py-2">{order.totalPrice}</td>
              <td className="py-2">{order.orderStatus}</td>
              <td className="py-2 text-blue-500 underline cursor-pointer">
                <Link
                  href={`/pages/profile/order-details?orderId=${encodeURIComponent(order.orderNo)}`}
                  className="text-blue-500 underline"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && <div className="mt-5">{pagination}</div>}
    </div>
    {/* mobile view  */}
    <div className="p-3 bg-white rounded-lg shadow-md mt-6 lg:hidden">
      <div className="flex justify-between items-center border-b pb-3 mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {isButtonVisible && (
          <Link
            href="/pages/profile/order-history"
            className="text-blue-500 underline"
          >
            View All
          </Link>
        )}
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="p-4 border rounded-lg bg-gray-50 shadow-sm text-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold">Order ID: {order.orderNo}</div>
              <Link
                href={`/pages/profile/order-details?orderId=${encodeURIComponent(order.orderNo)}`}
                className="text-blue-500 underline"
              >
                View Details
              </Link>
            </div>
            <div className="text-gray-500">Date: {order.createdAt}</div>
            <div className="text-gray-500">Total: {order.totalPrice}</div>
            <div className="text-gray-500">Status: {order.orderStatus}</div>
          </div>
        ))}
      </div>
      {pagination && <div className="mt-5">{pagination}</div>}
    </div>
  </>
);

export default OrderHistoryTabel;
