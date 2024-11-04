"use client";
import React, { useEffect, useState } from "react";
import OrderHistoryTabel from "../components/OrderHistoryTabel";
import Pagination from "../components/Pagination";
import { useSearchParams,useRouter } from "next/navigation";
const orders = [
  { id: "#1", date: "8 Sep, 2020", total: "135.00KWD (5 Products)", status: "Processing", details: "#" },
  { id: "#2", date: "24 May, 2020", total: "25.00KWD (1 Product)", status: "On the way", details: "#" },
  { id: "#3", date: "22 Oct, 2020", total: "250.00KWD (4 Products)", status: "Completed", details: "#" },
  { id: "#4", date: "1 Dec, 2020", total: "75.00KWD (2 Products)", status: "Processing", details: "#" },
  { id: "#5", date: "18 Nov, 2020", total: "120.00KWD (3 Products)", status: "Completed", details: "#" },
  { id: "#6", date: "3 Jan, 2021", total: "100.00KWD (4 Products)", status: "On the way", details: "#" },
  { id: "#7", date: "12 Feb, 2021", total: "60.00KWD (2 Products)", status: "Cancelled", details: "#" },
  { id: "#8", date: "7 Mar, 2021", total: "90.00KWD (3 Products)", status: "Processing", details: "#" },
  { id: "#9", date: "5 Apr, 2021", total: "110.00KWD (4 Products)", status: "Completed", details: "#" },
  { id: "#10", date: "21 May, 2021", total: "45.00KWD (1 Product)", status: "On the way", details: "#" },
  { id: "#11", date: "30 Jun, 2021", total: "85.00KWD (3 Products)", status: "Completed", details: "#" },
  { id: "#12", date: "15 Jul, 2021", total: "70.00KWD (2 Products)", status: "Processing", details: "#" },
  { id: "#13", date: "27 Aug, 2021", total: "55.00KWD (1 Product)", status: "Completed", details: "#" },
  { id: "#14", date: "5 Sep, 2021", total: "95.00KWD (2 Products)", status: "On the way", details: "#" },
  { id: "#15", date: "11 Oct, 2021", total: "130.00KWD (5 Products)", status: "Processing", details: "#" },
  { id: "#16", date: "18 Nov, 2021", total: "80.00KWD (3 Products)", status: "Completed", details: "#" },
  { id: "#17", date: "9 Dec, 2021", total: "75.00KWD (2 Products)", status: "On the way", details: "#" },
  { id: "#18", date: "15 Jan, 2022", total: "115.00KWD (4 Products)", status: "Processing", details: "#" },
  { id: "#19", date: "19 Feb, 2022", total: "105.00KWD (5 Products)", status: "Cancelled", details: "#" },
  { id: "#20", date: "25 Mar, 2022", total: "65.00KWD (2 Products)", status: "Completed", details: "#" },
  { id: "#21", date: "10 Apr, 2022", total: "140.00KWD (6 Products)", status: "Processing", details: "#" },
  { id: "#22", date: "20 May, 2022", total: "30.00KWD (1 Product)", status: "On the way", details: "#" },
  { id: "#23", date: "15 Jun, 2022", total: "100.00KWD (4 Products)", status: "Completed", details: "#" },
  { id: "#24", date: "25 Jul, 2022", total: "85.00KWD (3 Products)", status: "Cancelled", details: "#" },
  { id: "#25", date: "2 Aug, 2022", total: "150.00KWD (5 Products)", status: "Processing", details: "#" },
  { id: "#26", date: "14 Sep, 2022", total: "70.00KWD (2 Products)", status: "Completed", details: "#" },
  { id: "#27", date: "30 Oct, 2022", total: "45.00KWD (1 Product)", status: "On the way", details: "#" },
  { id: "#28", date: "19 Nov, 2022", total: "115.00KWD (4 Products)", status: "Processing", details: "#" },
  { id: "#29", date: "1 Dec, 2022", total: "125.00KWD (5 Products)", status: "Completed", details: "#" },
  { id: "#30", date: "20 Jan, 2023", total: "60.00KWD (2 Products)", status: "Cancelled", details: "#" },
];

  
const OrderHistoryPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
const router = useRouter()
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    setCurrentPage(page);
    router.replace(`?page=${page}`);
  }, [router, searchParams]);
  const ordersPerPage = 10;
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      router.push(`?page=${page}`);

    }
  };

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );
  return (
    <>
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
    </>
  );
};

export default OrderHistoryPage;
