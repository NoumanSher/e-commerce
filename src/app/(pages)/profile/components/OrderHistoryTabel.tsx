// OrderHistory.tsx
import React from "react";
import Link from "next/link";
import { HiOutlineDocumentMagnifyingGlass } from "react-icons/hi2";
import { OrderHistoryProps } from "../types/profileTypes";
interface HeaderProps {
  title: string;
  showViewAll: boolean;
}
const OrderHistoryTabel: React.FC<OrderHistoryProps & { pagination?: React.ReactNode }> = ({
  orders,
  title,
  isButtonVisible,
  pagination,
  ordersLAutalLength = 0,
}) => {
  const showViewAll = isButtonVisible && ordersLAutalLength > 3;
  const showPagination = pagination && ordersLAutalLength > 10;

  return (
    <>
      {/* Desktop View */}
      <div className="p-6 bg-white rounded-lg shadow-md hidden lg:block">
        <Header title={title} showViewAll={showViewAll} />

        {orders.length > 0 ? <DesktopTable orders={orders} /> : <NoOrdersRow />}

        {showPagination && <div className="mt-5">{pagination}</div>}
      </div>

      {/* Mobile View */}
      <div className="p-3 bg-white rounded-lg shadow-md mt-6 lg:hidden">
        <Header title={title} showViewAll={showViewAll} />

        {orders.length > 0 ? <MobileCards orders={orders} /> : <WhenNoOrders />}

        {showPagination && <div className="mt-5">{pagination}</div>}
      </div>
    </>
  );
};

/* ----------------- COMPONENTS ------------------ */

const Header = ({ title, showViewAll }: HeaderProps) => (
  <div className="flex justify-between items-center border-b pb-3 mb-3">
    <h2 className="text-lg font-semibold">{title}</h2>
    {showViewAll && (
      <Link
        href="/profile/order-history"
        className="text-black underline"
        title="View all orders"
      >
        View All
      </Link>
    )}
  </div>
);

const DesktopTable = ({ orders }: { orders: OrderHistoryProps["orders"] }) => (
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
          <td className="py-2">{order.orderDetails.totalPrice}</td>
          <td className="py-2">
            {order.orderStatuses[order.orderStatuses.length - 1].status}
          </td>
          <td className="py-2 flex justify-end">
            <OrderLink orderNo={order.orderNo} />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const NoOrdersRow = () => (
  <table className="w-full">
    <tbody>
      <tr>
        <td colSpan={5} className="py-12 text-center">
          <WhenNoOrders />
        </td>
      </tr>
    </tbody>
  </table>
);

const MobileCards = ({ orders }: { orders: OrderHistoryProps["orders"] }) => (
  <div className="space-y-4">
    {orders.map((order) => (
      <div
        key={order.orderId}
        className="p-4 border rounded-lg bg-gray-50 shadow-sm text-sm"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold">Order ID: {order.orderNo}</div>
          <OrderLink orderNo={order.orderNo} />
        </div>
        <div className="text-gray-500">Date: {order.createdAt}</div>
        <div className="text-gray-500">
          Total: {order.orderDetails.totalPrice}
        </div>
        <div className="text-gray-500">
          Status: {order.orderStatuses[order.orderStatuses.length - 1].status}
        </div>
      </div>
    ))}
  </div>
);
/* ✅ Reusable Order Link */
const OrderLink = ({ orderNo }: { orderNo: string }) => (
  <Link href={`/profile/order-details?orderId=${encodeURIComponent(orderNo)}`}>
    <HiOutlineDocumentMagnifyingGlass
      title="View full detail"
      color="black"
      size={30}
    />
  </Link>
);

const WhenNoOrders = () => (
  <div className="flex flex-col items-center justify-center text-gray-500">
    <svg
      className="w-16 h-16 mb-4 text-gray-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
    <p className="text-lg font-medium">No orders yet</p>
    <p className="text-sm mt-1">Your order history will appear here</p>
  </div>
);

export default OrderHistoryTabel;
