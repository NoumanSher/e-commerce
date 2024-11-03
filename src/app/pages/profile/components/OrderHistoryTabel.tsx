// OrderHistory.tsx
import React from "react";
import { OrderHistoryProps } from "../types/profileTypes";
import Link from "next/link";

const OrderHistoryTabel: React.FC<
  OrderHistoryProps & { pagination?: React.ReactNode }
> = ({ orders, title, isButtonVisible, pagination }) => (
  <div className="p-6 bg-white rounded-lg shadow-md mt-6">
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
          <tr key={order.id} className="border-b text-sm">
            <td className="py-2">{order.id}</td>
            <td className="py-2">{order.date}</td>
            <td className="py-2">{order.total}</td>
            <td className="py-2">{order.status}</td>
            <td className="py-2 text-blue-500 underline cursor-pointer">
              <a href={order.details}></a>
              <Link
                href="/pages/profile/order-details"
                className="text-blue-500 underline"
              >
                View Details
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {/* Conditionally render pagination if it is provided */}
    {pagination && <div className="mt-5">{pagination}</div>}
  </div>
);

export default OrderHistoryTabel;
