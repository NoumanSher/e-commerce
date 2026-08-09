"use client";

import React, { useMemo, useState, useEffect } from "react";
import OrderHistoryTabel from "../components/OrderHistoryTabel";
import Pagination from "../components/Pagination";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetOrdersByUserId } from "../profileQuery";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";

const getSafeData = (data: any) => {
  return {
    orders: data?.data ?? [],
  };
};

const OrderHistoryPageClient: React.FC = () => {
  const { userId } = useAuth();
  const { data, isLoading } = useGetOrdersByUserId(userId);

  const ordersData = useMemo(() => getSafeData(data), [data]);
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ Always call useState at the top (safe default = 1)
  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  // ✅ After mount, sync with searchParams
  useEffect(() => {
    setMounted(true);
    const page = parseInt(searchParams.get("page") || "1", 10);
    setCurrentPage(page);
  }, [searchParams]);

  const ordersPerPage = 10;
  const totalPages = Math.ceil(ordersData.orders.length / ordersPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      router.push(`?page=${page}`);
    }
  };

  const paginatedOrders = ordersData.orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  if (!mounted || isLoading) return <Loader />;

  return (
    <div className="lg:py-7 py-0">
      <OrderHistoryTabel
        title="Order History"
        orders={paginatedOrders}
        ordersLAutalLength={(data as any)?.data?.length || 0}
        isButtonVisible={false}
        pagination={
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        }
      />
    </div>
  );
};

export default OrderHistoryPageClient;
