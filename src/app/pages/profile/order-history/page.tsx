"use client";
import React, { useState } from "react";
import OrderHistoryTabel from "../components/OrderHistoryTabel";
import PaginationDemo from "../components/Pagination";
const orders = [
    { id: "#738", date: "8 Sep, 2020", total: "135.00KWD (5 Products)", status: "Processing", details: "#" },
    { id: "#703", date: "24 May, 2020", total: "25.00KWD (1 Product)", status: "On the way", details: "#" },
    { id: "#130", date: "22 Oct, 2020", total: "250.00KWD (4 Products)", status: "Completed", details: "#" },
    { id: "#302", date: "1 Dec, 2020", total: "75.00KWD (2 Products)", status: "Processing", details: "#" },
    { id: "#456", date: "18 Nov, 2020", total: "120.00KWD (3 Products)", status: "Completed", details: "#" },
    { id: "#789", date: "3 Jan, 2021", total: "100.00KWD (4 Products)", status: "On the way", details: "#" },
    { id: "#250", date: "12 Feb, 2021", total: "60.00KWD (2 Products)", status: "Cancelled", details: "#" },
    { id: "#847", date: "7 Mar, 2021", total: "90.00KWD (3 Products)", status: "Processing", details: "#" },
    { id: "#905", date: "5 Apr, 2021", total: "110.00KWD (4 Products)", status: "Completed", details: "#" },
    { id: "#613", date: "21 May, 2021", total: "45.00KWD (1 Product)", status: "On the way", details: "#" },
    { id: "#329", date: "30 Jun, 2021", total: "85.00KWD (3 Products)", status: "Completed", details: "#" },
    { id: "#401", date: "15 Jul, 2021", total: "70.00KWD (2 Products)", status: "Processing", details: "#" },
    { id: "#500", date: "27 Aug, 2021", total: "55.00KWD (1 Product)", status: "Completed", details: "#" },
    { id: "#602", date: "5 Sep, 2021", total: "95.00KWD (2 Products)", status: "On the way", details: "#" },
    { id: "#104", date: "11 Oct, 2021", total: "130.00KWD (5 Products)", status: "Processing", details: "#" },
    { id: "#209", date: "18 Nov, 2021", total: "80.00KWD (3 Products)", status: "Completed", details: "#" },
    { id: "#310", date: "9 Dec, 2021", total: "75.00KWD (2 Products)", status: "On the way", details: "#" },
    { id: "#417", date: "15 Jan, 2022", total: "115.00KWD (4 Products)", status: "Processing", details: "#" },
    { id: "#523", date: "19 Feb, 2022", total: "105.00KWD (5 Products)", status: "Cancelled", details: "#" },
    { id: "#602", date: "25 Mar, 2022", total: "65.00KWD (2 Products)", status: "Completed", details: "#" },
    { id: "#721", date: "10 Apr, 2022", total: "140.00KWD (6 Products)", status: "Processing", details: "#" },
    { id: "#809", date: "20 May, 2022", total: "30.00KWD (1 Product)", status: "On the way", details: "#" },
    { id: "#910", date: "15 Jun, 2022", total: "100.00KWD (4 Products)", status: "Completed", details: "#" },
    { id: "#120", date: "25 Jul, 2022", total: "85.00KWD (3 Products)", status: "Cancelled", details: "#" },
    { id: "#335", date: "2 Aug, 2022", total: "150.00KWD (5 Products)", status: "Processing", details: "#" },
    { id: "#456", date: "14 Sep, 2022", total: "70.00KWD (2 Products)", status: "Completed", details: "#" },
    { id: "#587", date: "30 Oct, 2022", total: "45.00KWD (1 Product)", status: "On the way", details: "#" },
    { id: "#690", date: "19 Nov, 2022", total: "115.00KWD (4 Products)", status: "Processing", details: "#" },
    { id: "#805", date: "1 Dec, 2022", total: "125.00KWD (5 Products)", status: "Completed", details: "#" },
    { id: "#923", date: "20 Jan, 2023", total: "60.00KWD (2 Products)", status: "Cancelled", details: "#" },
  ];
  
const OrderHistoryPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
          <PaginationDemo
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
