"use client";
import React, { useEffect, useMemo, useState } from "react";
import OrderHistoryTabel from "../components/OrderHistoryTabel";
import Pagination from "../components/Pagination";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetOrdersByUserId } from "../profileQuery";
import { useStore } from "@/Context/storeContext";
import Loader from "@/components/Loader";

const getSafeData = (data: any) => {
  return {
    orders: data?.data ?? [],
  };
};


const OrderHistoryPage: React.FC = () => {
  const { userId } = useStore();
  const { data, isLoading } = useGetOrdersByUserId(userId);

  const ordersData = useMemo(() => getSafeData(data), [data]);
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    setCurrentPage(page);
    router.replace(`?page=${page}`);
  }, [router, searchParams]);
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
    if (isLoading) return <Loader />;
  
  return (
    <div className="lg:py-7 py-0">
      <OrderHistoryTabel
        title="Order History"
        orders={paginatedOrders}
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

export default OrderHistoryPage;
