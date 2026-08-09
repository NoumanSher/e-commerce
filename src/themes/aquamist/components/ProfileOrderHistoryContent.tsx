"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useGetOrdersByUserId } from "@/app/(pages)/profile/profileQuery";
import AquamistOrdersTable from "./AquamistOrdersTable";

const getSafeData = (data: any) => ({
  orders: data?.data ?? [],
});

/**
 * AquaMist Profile Order History Content
 *
 * Full list of orders with pagination, responsive layout and details redirection.
 */
export default function ProfileOrderHistoryContent() {
  const { userId } = useAuth();
  const { data: ordersResponse, isLoading } = useGetOrdersByUserId(userId);

  const ordersData = useMemo(() => getSafeData(ordersResponse), [ordersResponse]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [mounted, setMounted] = useState(false);

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

  const paginatedOrders = useMemo(() => {
    return ordersData.orders.slice(
      (currentPage - 1) * ordersPerPage,
      currentPage * ordersPerPage
    );
  }, [ordersData.orders, currentPage]);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="aquamist-profile-loader-container">
        <div className="aquamist-profile-spinner" />
        <p>Loading order ledger...</p>
        <style jsx>{`
          .aquamist-profile-loader-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 350px;
            color: rgba(56, 189, 248, 0.7);
          }
          .aquamist-profile-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(56, 189, 248, 0.1);
            border-top-color: #38bdf8;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="aquamist-history-container">
      <div className="history-header">
        <div>
          <h1 className="history-title">Order History</h1>
          <p className="history-subtitle">View and trace your historic purchases and status records.</p>
        </div>
        <span className="total-orders-count bg-pill">
          {ordersData.orders.length} order{ordersData.orders.length !== 1 ? "s" : ""}
        </span>
      </div>

      {ordersData.orders.length > 0 ? (
        <AquamistOrdersTable
          orders={paginatedOrders}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: handlePageChange,
          }}
        />
      ) : (
        <div className="no-orders-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-12 h-12 text-slate-600 mb-3">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <path d="M12 17h.01" />
          </svg>
          <h3>No orders located</h3>
          <p>Your future orders and mist system tracking updates will occupy this region.</p>
          <Link href="/collections" className="browse-products-btn">
            Explore Collection
          </Link>
        </div>
      )}

      <style jsx>{`
        /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           AquaMist Order History Styles
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

        .aquamist-history-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          font-family: inherit;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .history-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 0.4rem;
          letter-spacing: -0.01em;
        }

        .history-subtitle {
          font-size: 0.88rem;
          color: rgba(255, 255, 255, 0.55);
          margin: 0;
        }

        .bg-pill {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 0.25rem 0.75rem;
          border-radius: 99px;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.85);
          font-weight: 600;
        }

        /* Desktop Table Card */
        .table-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          overflow: hidden;
        }

        .aquamist-history-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.875rem;
        }

        .aquamist-history-table th {
          font-size: 0.68rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.08em;
          padding: 1.1rem 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          text-transform: uppercase;
        }

        .aquamist-history-table td {
          padding: 1.1rem 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.7);
        }

        .aquamist-history-table tr:last-child td {
          border-bottom: none;
        }

        .aquamist-history-table tr:hover td {
          background: rgba(255, 255, 255, 0.015);
          color: #ffffff;
        }

        .order-number-cell {
          font-weight: 700;
          color: #ffffff !important;
        }

        .payment-method-text {
          font-size: 0.8rem;
          text-transform: capitalize;
        }

        .total-cell {
          font-weight: 600;
          color: #ffffff !important;
        }

        /* Status Badge */
        .status-badge-pill {
          display: inline-flex;
          align-items: center;
          padding: 0.15rem 0.55rem;
          border-radius: 99px;
          font-size: 0.72rem;
          font-weight: 600;
          border: 1px solid transparent;
        }

        .status-badge-pill.delivered {
          background: rgba(16, 185, 129, 0.12);
          border-color: rgba(16, 185, 129, 0.25);
          color: #10b981;
        }
        
        .status-badge-pill.cancelled {
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.25);
          color: #ef4444;
        }

        .status-badge-pill.processing,
        .status-badge-pill.pending,
        .status-badge-pill.shipped {
          background: rgba(245, 158, 11, 0.12);
          border-color: rgba(245, 158, 11, 0.25);
          color: #f59e0b;
        }

        .text-center {
          text-align: center;
        }

        @media (min-width: 640px) {
          .mobile-orders-list {
            display: none !important;
          }
        }

        @media (max-width: 639px) {
          .table-card {
            display: none !important;
          }
        }

        /* Desktop actions — circle icon button */
        .details-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .details-action-btn:hover {
          background: rgba(56, 189, 248, 0.12);
          border-color: rgba(56, 189, 248, 0.3);
          color: #38bdf8;
          transform: scale(1.05);
        }

        /* Mobile Layout Cards */
        .mobile-cards-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-order-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 1rem;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.75rem;
        }

        .order-number {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
        }

        .card-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
        }

        .detail-row .label {
          color: rgba(255, 255, 255, 0.4);
        }

        .detail-row .value {
          color: rgba(255, 255, 255, 0.85);
        }

        .detail-row .value.total {
          color: #ffffff;
          font-weight: 600;
        }

        .card-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 0.6rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.5rem;
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .card-action-btn:hover {
          background: rgba(56, 189, 248, 0.1);
          border-color: rgba(56, 189, 248, 0.25);
          color: #38bdf8;
        }

        /* ── Paginator ── */
        .aquamist-paginator {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-top: 2rem;
        }

        .paginator-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .paginator-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .paginator-btn.arrow-btn {
          padding: 0.45rem 0.85rem;
          border-radius: 0.5rem;
          gap: 0.3rem;
        }

        .paginator-btn.arrow-btn:not(:disabled):hover {
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
        }

        .paginator-pages {
          display: flex;
          gap: 0.35rem;
        }

        .paginator-btn.num-btn {
          width: 32px;
          height: 32px;
          border-radius: 0.5rem;
        }

        .paginator-btn.num-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
        }

        .paginator-btn.num-btn.active {
          background: rgba(56, 189, 248, 0.15);
          border-color: rgba(56, 189, 248, 0.3);
          color: #38bdf8;
        }

        /* Empty state */
        .no-orders-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3rem 1.5rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          color: rgba(255, 255, 255, 0.45);
        }

        .no-orders-card h3 {
          font-size: 1.05rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0.5rem 0 0.25rem;
        }

        .no-orders-card p {
          font-size: 0.85rem;
          max-width: 300px;
          margin: 0 0 1.25rem;
          line-height: 1.4;
        }

        .browse-products-btn {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, #0ea5e9, #6366f1);
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.6rem 1.25rem;
          border-radius: 0.5rem;
          text-decoration: none;
          box-shadow: 0 4px 15px rgba(14, 165, 233, 0.25);
          transition: all 0.2s ease;
        }

        .browse-products-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(14, 165, 233, 0.35);
        }
      `}</style>
    </div>
  );
}
