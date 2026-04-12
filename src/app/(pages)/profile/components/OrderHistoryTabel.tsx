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
      <div className="p-0 sm:p-6 sm:bg-white sm:border sm:border-gray-200 rounded-lg sm:shadow-sm hidden lg:block overflow-hidden">
        <Header title={title} showViewAll={showViewAll} />

        {orders.length > 0 ? <DesktopTable orders={orders} /> : <NoOrdersRow />}

        {showPagination && <div className="mt-5">{pagination}</div>}
      </div>

      {/* Mobile View */}
      <div className="p-0 bg-transparent lg:hidden">
        <Header title={title} showViewAll={showViewAll} />

        {orders.length > 0 ? <MobileCards orders={orders} /> : <WhenNoOrders />}

        {showPagination && <div className="mt-5">{pagination}</div>}
      </div>
    </>
  );
};

/* ----------------- COMPONENTS ------------------ */

const Header = ({ title, showViewAll }: HeaderProps) => (
  <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    {showViewAll && (
      <Link
        href="/profile/order-history"
        className="text-sm font-medium text-black hover:text-gray-600 underline underline-offset-4"
        title="View all orders"
      >
        View All
      </Link>
    )}
  </div>
);

const DesktopTable = ({ orders }: { orders: OrderHistoryProps["orders"] }) => (
  <table className="w-full text-left border-collapse">
    <thead>
      <tr className="text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
        <th className="py-3 font-semibold">Order ID</th>
        <th className="py-3 font-semibold">Date</th>
        <th className="py-3 font-semibold">Total</th>
        <th className="py-3 font-semibold">Status</th>
        <th className="py-3 font-semibold text-right">Action</th>
      </tr>
    </thead>
    <tbody>
      {orders.map((order) => (
        <tr key={order.orderId} className="border-b border-gray-100 text-sm hover:bg-gray-50 transition-colors">
          <td className="py-4 font-medium text-gray-900">#{order.orderNo}</td>
          <td className="py-4 text-gray-600">{order.createdAt}</td>
          <td className="py-4 font-medium text-gray-900">Rs {order.orderDetails.totalPrice}</td>
          <td className="py-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {order.orderStatuses[order.orderStatuses.length - 1].status}
            </span>
          </td>
          <td className="py-4 flex justify-end">
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
        className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm text-sm flex flex-col gap-y-3"
      >
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div className="font-bold text-gray-900">#{order.orderNo}</div>
          <OrderLink orderNo={order.orderNo} />
        </div>
        <div className="flex justify-between items-center text-gray-600">
          <span className="text-gray-500">Date</span>
          <span>{order.createdAt}</span>
        </div>
        <div className="flex justify-between items-center text-gray-900 font-medium">
          <span className="text-gray-500 font-normal">Total</span>
          <span>Rs {order.orderDetails.totalPrice}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Status</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {order.orderStatuses[order.orderStatuses.length - 1].status}
          </span>
        </div>
      </div>
    ))}
  </div>
);
/* ✅ Reusable Order Link */
const OrderLink = ({ orderNo }: { orderNo: string }) => (
  <Link href={`/profile/order-details?orderId=${encodeURIComponent(orderNo)}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
    <HiOutlineDocumentMagnifyingGlass
      title="View full detail"
      className="text-gray-700"
      size={22}
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
