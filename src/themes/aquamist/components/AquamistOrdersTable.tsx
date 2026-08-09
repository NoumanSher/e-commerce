"use client";

import React from "react";
import Link from "next/link";

interface Order {
  orderId?: string;
  orderNo: string;
  createdAt: string;
  orderStatuses?: { status: string; updatedAt: string }[];
  orderDetails?: { paymentMethod?: string; totalPrice?: number };
  paymentMethod?: string;
  totalPrice?: number;
  subTotal?: number;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface AquamistOrdersTableProps {
  /** The list of orders to display */
  orders: Order[];
  /** Optional pagination — only rendered when provided */
  pagination?: PaginationProps;
}

/**
 * AquaMist — Shared Orders Table Component
 *
 * Renders a desktop table + mobile card list for any order list.
 * Used by both ProfileOverviewContent (recent orders, no pagination) and
 * ProfileOrderHistoryContent (full paginated history).
 */
export default function AquamistOrdersTable({
  orders,
  pagination,
}: AquamistOrdersTableProps) {
  const getStatus = (order: Order) =>
    order.orderStatuses?.[order.orderStatuses.length - 1]?.status ?? "Processing";

  const getTotal = (order: Order) =>
    order.orderDetails?.totalPrice ?? order.totalPrice ?? order.subTotal ?? 0;

  const getPayment = (order: Order) =>
    order.orderDetails?.paymentMethod ?? order.paymentMethod ?? "Cash";

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (orders.length === 0) {
    return (
      <div className="aqot-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-12 h-12">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <path d="M12 17h.01" />
        </svg>
        <h3>No orders found</h3>
        <p>Your orders will appear here once placed.</p>
        <Link href="/collections" className="aqot-browse-btn">
          Explore Collection
        </Link>
        <style jsx>{emptyStyles}</style>
      </div>
    );
  }

  return (
    <div className="aqot-wrapper">
      {/* ── Desktop Table ── */}
      <div className="aqot-table-card">
        <table className="aqot-table">
          <thead>
            <tr>
              <th>ORDER NUMBER</th>
              <th>DATE</th>
              <th>PAYMENT</th>
              <th>STATUS</th>
              <th>TOTAL</th>
              <th className="aqot-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const status = getStatus(order);
              return (
                <tr key={order.orderId ?? order.orderNo}>
                  <td className="aqot-order-no">#{order.orderNo}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <span className="aqot-payment">{getPayment(order)}</span>
                  </td>
                  <td>
                    <span className={`aqot-status-pill ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </td>
                  <td className="aqot-total">
                    Rs {getTotal(order).toLocaleString()}
                  </td>
                  <td className="aqot-center">
                    <Link
                      href={`/profile/order-details?orderId=${encodeURIComponent(order.orderNo)}`}
                      className="aqot-action-btn"
                      title="View order details"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-4 h-4">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="aqot-mobile-list">
        {orders.map((order) => {
          const status = getStatus(order);
          return (
            <div key={order.orderId ?? order.orderNo} className="aqot-mobile-card">
              <div className="aqot-card-top">
                <span className="aqot-card-no">#{order.orderNo}</span>
                <span className={`aqot-status-pill ${status.toLowerCase()}`}>
                  {status}
                </span>
              </div>
              <div className="aqot-card-meta">
                <div>
                  <span className="aqot-meta-label">Date</span>
                  <span className="aqot-meta-value">{formatDate(order.createdAt)}</span>
                </div>
                <div>
                  <span className="aqot-meta-label">Payment</span>
                  <span className="aqot-meta-value aqot-capitalize">{getPayment(order)}</span>
                </div>
              </div>
              <div className="aqot-card-footer">
                <div>
                  <span className="aqot-meta-label">Total</span>
                  <span className="aqot-card-total">Rs {getTotal(order).toLocaleString()}</span>
                </div>
                <Link
                  href={`/profile/order-details?orderId=${encodeURIComponent(order.orderNo)}`}
                  className="aqot-card-btn"
                >
                  Details →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Pagination (optional) ── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="aqot-paginator">
          <button
            disabled={pagination.currentPage === 1}
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            className="aqot-pg-btn aqot-pg-arrow"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Prev</span>
          </button>

          <div className="aqot-pg-pages">
            {[...Array(pagination.totalPages)].map((_, idx) => {
              const pNum = idx + 1;
              return (
                <button
                  key={pNum}
                  onClick={() => pagination.onPageChange(pNum)}
                  className={`aqot-pg-btn aqot-pg-num${pagination.currentPage === pNum ? " active" : ""}`}
                >
                  {pNum}
                </button>
              );
            })}
          </div>

          <button
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            className="aqot-pg-btn aqot-pg-arrow"
          >
            <span>Next</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}

      <style jsx>{tableStyles}</style>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Shared Table Styles
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const tableStyles = `
  .aqot-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* ── Desktop Table ── */
  .aqot-table-card {
    background: rgba(255, 255, 255, 0.01);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    overflow-x: auto;
  }

  .aqot-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.875rem;
  }

  .aqot-table th {
    font-size: 0.68rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.08em;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    text-transform: uppercase;
    white-space: nowrap;
  }

  .aqot-table td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    color: rgba(255, 255, 255, 0.7);
  }

  .aqot-table tr:last-child td {
    border-bottom: none;
  }

  .aqot-table tr:hover td {
    background: rgba(255, 255, 255, 0.015);
    color: #ffffff;
  }

  .aqot-center {
    text-align: center;
  }

  .aqot-order-no {
    font-weight: 700;
    color: #ffffff !important;
  }

  .aqot-payment {
    font-size: 0.8rem;
    text-transform: capitalize;
  }

  .aqot-total {
    font-weight: 600;
    color: #ffffff !important;
  }

  /* Status pills */
  .aqot-status-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.15rem 0.55rem;
    border-radius: 99px;
    font-size: 0.72rem;
    font-weight: 600;
    border: 1px solid transparent;
    white-space: nowrap;
  }

  .aqot-status-pill.delivered {
    background: rgba(16, 185, 129, 0.12);
    border-color: rgba(16, 185, 129, 0.25);
    color: #10b981;
  }

  .aqot-status-pill.cancelled {
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.25);
    color: #ef4444;
  }

  .aqot-status-pill.processing,
  .aqot-status-pill.pending,
  .aqot-status-pill.shipped {
    background: rgba(245, 158, 11, 0.12);
    border-color: rgba(245, 158, 11, 0.25);
    color: #f59e0b;
  }

  /* Eye icon action button */
  .aqot-action-btn {
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

  .aqot-action-btn:hover {
    background: rgba(56, 189, 248, 0.12);
    border-color: rgba(56, 189, 248, 0.3);
    color: #38bdf8;
    transform: scale(1.05);
  }

  /* ── Mobile Cards ── */
  .aqot-mobile-list {
    display: none;
    flex-direction: column;
    gap: 0.75rem;
  }

  .aqot-mobile-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .aqot-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.65rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  }

  .aqot-card-no {
    font-family: monospace;
    font-weight: 700;
    color: #ffffff;
    font-size: 0.9rem;
  }

  .aqot-card-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    font-size: 0.8rem;
  }

  .aqot-meta-label {
    display: block;
    font-size: 0.6rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 0.15rem;
  }

  .aqot-meta-value {
    color: rgba(255, 255, 255, 0.8);
  }

  .aqot-capitalize {
    text-transform: capitalize;
  }

  .aqot-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.65rem;
    border-top: 1px solid rgba(255, 255, 255, 0.07);
  }

  .aqot-card-total {
    display: block;
    font-weight: 700;
    color: #38bdf8;
    font-size: 0.9rem;
  }

  .aqot-card-btn {
    padding: 0.35rem 0.9rem;
    border-radius: 99px;
    background: rgba(56, 189, 248, 0.1);
    border: 1px solid rgba(56, 189, 248, 0.25);
    color: #38bdf8;
    font-size: 0.75rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .aqot-card-btn:hover {
    background: rgba(56, 189, 248, 0.2);
  }

  /* ── Responsive breakpoints ── */
  @media (max-width: 639px) {
    .aqot-table-card {
      display: none;
    }
    .aqot-mobile-list {
      display: flex;
    }
  }

  /* ── Paginator ── */
  .aqot-paginator {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .aqot-pg-btn {
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

  .aqot-pg-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .aqot-pg-arrow {
    padding: 0.45rem 0.85rem;
    border-radius: 0.5rem;
    gap: 0.3rem;
  }

  .aqot-pg-arrow:not(:disabled):hover {
    background: rgba(255, 255, 255, 0.06);
    color: #ffffff;
  }

  .aqot-pg-pages {
    display: flex;
    gap: 0.35rem;
  }

  .aqot-pg-num {
    width: 32px;
    height: 32px;
    border-radius: 0.5rem;
  }

  .aqot-pg-num:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #ffffff;
  }

  .aqot-pg-num.active {
    background: rgba(56, 189, 248, 0.15);
    border-color: rgba(56, 189, 248, 0.3);
    color: #38bdf8;
  }
`;

const emptyStyles = `
  .aqot-empty {
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
    gap: 0.5rem;
  }

  .aqot-empty h3 {
    font-size: 1.05rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0.5rem 0 0.1rem;
  }

  .aqot-empty p {
    font-size: 0.85rem;
    max-width: 280px;
    margin: 0 0 1rem;
    line-height: 1.4;
  }

  .aqot-browse-btn {
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

  .aqot-browse-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(14, 165, 233, 0.35);
  }
`;
