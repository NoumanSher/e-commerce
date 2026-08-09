"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetOrderDetailByOrderNumber } from "@/app/(pages)/profile/profileQuery";

const getSafeData = (data: any) => {
  if (data) {
    const addressObj = data?.address ?? {};
    const streetAddress = addressObj.streetAddress ?? "xyz street";
    const user = data.user ?? {};
    return {
      username: user.username ?? "",
      fullName: `${addressObj.firstName ?? "User"} ${addressObj.lastName ?? "Name"}`,
      email: addressObj.email ?? "xyz@gmail.com",
      streetAddress: streetAddress,
      phone: addressObj.phone ?? "030176776",
      orders: data,
    };
  }
  return null;
};

/**
 * AquaMist Profile Order Details Content
 *
 * Detailed view of a single order. Implements responsive breakdown, tracking stepper,
 * and summary card styled with high-fidelity glassmorphism.
 */
export default function ProfileOrderDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("orderId");
  const from = searchParams.get("from");
  const isFromOrderConfirmation = from === "order-confirmation";

  const { data, isLoading } = useGetOrderDetailByOrderNumber(orderNumber as string);
  const profileData = useMemo(() => getSafeData(data?.data), [data]);

  const handleBack = useCallback(() => {
    if (isFromOrderConfirmation) {
      router.push("/");
    } else {
      router.back();
    }
  }, [isFromOrderConfirmation, router]);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "INVALID DATE";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    }).toUpperCase();
  }, []);

  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "INVALID TIME";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  if (isLoading) {
    return (
      <div className="aquamist-profile-loader-container">
        <div className="aquamist-profile-spinner" />
        <p>Fetching order records...</p>
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

  if (!profileData) {
    return (
      <div className="no-order-found-container">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-16 h-16 text-slate-600 mb-4">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3>Order details unavailable</h3>
        <p>We could not retrieve information for this order number.</p>
        <button onClick={handleBack} className="back-btn">
          Go Back
        </button>
        <style jsx>{`
          .no-order-found-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 3rem 1.5rem;
            color: rgba(255, 255, 255, 0.6);
          }
          .no-order-found-container h3 {
            color: #ffffff;
            font-size: 1.2rem;
            margin: 0 0 0.5rem;
          }
          .no-order-found-container p {
            font-size: 0.9rem;
            margin: 0 0 1.5rem;
            max-width: 300px;
          }
          .back-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #ffffff;
            padding: 0.5rem 1.25rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
          }
          .back-btn:hover {
            background: rgba(56, 189, 248, 0.15);
            border-color: rgba(56, 189, 248, 0.3);
            color: #38bdf8;
          }
        `}</style>
      </div>
    );
  }

  const order = profileData.orders;
  const statusHistory = order.orderStatuses ?? [];

  // Price calculations
  const subtotal = order.subTotal ?? 0;
  const delivery = order.deliveryFee ?? 0;
  const discount = order.orderDetails?.discountAmount ?? order.discountAmount ?? 0;
  const total = order.orderDetails?.totalPrice ?? order.totalPrice ?? (subtotal + delivery - discount);

  return (
    <div className="aquamist-details-container">
      {/* Header */}
      <div className="details-header">
        <div>
          <span className="details-tag">ORDER DETAILS</span>
          <h1 className="details-title">Order #{order.orderNo}</h1>
          <p className="details-subtitle">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button onClick={handleBack} className="back-circle-btn" title="Go Back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
      </div>

      {/* Overview Panels */}
      <div className="details-grid">
        {/* Address card */}
        <div className="aquamist-glass-card">
          <div className="card-header">
            <div className="header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-sky-400">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3>Delivery Info</h3>
          </div>
          <div className="card-body">
            <p className="recipient-name">{profileData.fullName}</p>
            <p className="address-text">{profileData.streetAddress}</p>
            <div className="contact-info">
              <div>
                <span className="label">EMAIL</span>
                <span className="value truncate" title={profileData.email}>{profileData.email}</span>
              </div>
              <div>
                <span className="label">PHONE</span>
                <span className="value">{profileData.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="aquamist-glass-card">
          <div className="card-header">
            <div className="header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-sky-400">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <line x1="12" y1="4" x2="12" y2="20" />
              </svg>
            </div>
            <h3>Cost Summary</h3>
          </div>
          <div className="card-body summary-body">
            <div className="summary-row">
              <span className="label">SUBTOTAL</span>
              <span className="value">Rs {subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span className="label">DELIVERY</span>
              <span className="value">Rs {delivery.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row discount">
                <span className="label">DISCOUNT</span>
                <span className="value">- Rs {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="summary-separator" />
            <div className="summary-row total-row">
              <span className="label">TOTAL</span>
              <span className="value text-sky-400">Rs {total.toLocaleString()}</span>
            </div>
            <div className="payment-footer">
              <span className="label">PAYMENT METHOD:</span>
              <span className="method-pill">{order.orderDetails?.paymentMethod ?? order.paymentMethod ?? "Card"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Stepper */}
      <div className="aquamist-glass-card stepper-card">
        <div className="card-header">
          <div className="header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-sky-400">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <h3>System Tracking Status</h3>
        </div>
        <div className="card-body stepper-body">
          {statusHistory.length > 0 ? (
            <ul className="stepper-list">
              {/* Vertical connection line */}
              <div className="stepper-line" />

              {statusHistory.map((step: any, index: number) => {
                const isDelivered = step.status.toLowerCase() === "delivered";
                const isCancelled = step.status.toLowerCase() === "cancelled";
                const isShipped = step.status.toLowerCase() === "shipped";
                
                let dotClass = "default-dot";
                if (isDelivered) dotClass = "delivered-dot";
                else if (isCancelled) dotClass = "cancelled-dot";
                else if (isShipped) dotClass = "shipped-dot";

                const prevDate = index > 0 
                  ? new Date(statusHistory[index - 1].updatedAt).toDateString()
                  : null;
                const currentDate = new Date(step.updatedAt).toDateString();
                const showDate = index === 0 || currentDate !== prevDate;

                return (
                  <li key={step._id} className="step-item">
                    {showDate && (
                      <div className="step-date-header">
                        {formatDate(step.updatedAt)}
                      </div>
                    )}
                    <div className="step-row">
                      <div className={`step-dot-outer`}>
                        <div className={`step-dot ${dotClass}`} />
                      </div>
                      <div className="step-content">
                        <span className={`step-desc ${isCancelled ? "cancelled-text" : ""}`}>
                          {step.statusDesc}
                        </span>
                        <span className="step-time">{formatTime(step.updatedAt)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="no-status-text">No order status history found.</p>
          )}
        </div>
      </div>

      {/* Order Items Section */}
      <div className="order-items-section">
        <h2 className="section-title">Order Items</h2>
        
        {/* Desktop Table View */}
        <div className="table-card hidden sm:block overflow-x-auto">
          <table className="items-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>PRICE</th>
                <th className="text-center">QUANTITY</th>
                <th className="text-right">LINE TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="item-name-cell">
                    <div className="product-title">{item.product}</div>
                    {item.variant?.name && (
                      <span className="variant-pill">{item.variant.name}</span>
                    )}
                  </td>
                  <td>Rs {item.price.toLocaleString()}</td>
                  <td className="text-center font-semibold text-white">{item.quantity}</td>
                  <td className="text-right line-total-cell">
                    Rs {item.lineTotal.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Items List View (No horizontal scrolling required!) */}
        <div className="mobile-items-list sm:hidden flex flex-col gap-3">
          {order.items?.map((item: any, idx: number) => (
            <div key={idx} className="mobile-item-card bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2.5">
              <div className="flex flex-col items-start gap-1 pb-2 border-b border-white/10">
                <h4 className="font-inter font-semibold text-white text-sm leading-snug">{item.product}</h4>
                {item.variant?.name && (
                  <span className="variant-pill font-mono">{item.variant.name}</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-inter pt-1">
                <div>
                  <span className="text-white/40 block text-[10px] uppercase tracking-wider mb-0.5">Price</span>
                  <span className="text-white/80">Rs {item.price.toLocaleString()}</span>
                </div>
                <div className="text-center">
                  <span className="text-white/40 block text-[10px] uppercase tracking-wider mb-0.5">Qty</span>
                  <span className="font-semibold text-white">{item.quantity}</span>
                </div>
                <div className="text-right">
                  <span className="text-white/40 block text-[10px] uppercase tracking-wider mb-0.5">Total</span>
                  <span className="font-bold text-sky-400">Rs {item.lineTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           AquaMist Order Details Styles
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

        .aquamist-details-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          font-family: inherit;
        }

        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .details-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: #38bdf8;
          letter-spacing: 0.15em;
        }

        .details-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0.3rem 0;
          letter-spacing: -0.01em;
        }

        .details-subtitle {
          font-size: 0.88rem;
          color: rgba(255, 255, 255, 0.55);
          margin: 0;
        }

        .back-circle-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-circle-btn:hover {
          background: rgba(56, 189, 248, 0.12);
          border-color: rgba(56, 189, 248, 0.3);
          color: #38bdf8;
          transform: scale(1.05);
        }

        /* ── Details Grid (Delivery Info & Cost Summary side-by-side on desktop) ── */
        .details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .details-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .aquamist-glass-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 1.25rem;
          padding: 1.5rem;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 0.75rem;
        }

        .header-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(56, 189, 248, 0.08);
          border: 1px solid rgba(56, 189, 248, 0.15);
        }

        .card-header h3 {
          font-size: 1.05rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        /* Delivery Info card */
        .recipient-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 0.4rem;
        }

        .address-text {
          font-size: 0.88rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.45;
          margin: 0 0 1rem;
        }

        .contact-info {
          display: grid;
          grid-template-cols: 1fr;
          gap: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        @media (min-width: 480px) {
          .contact-info {
            grid-template-cols: 1fr 1fr;
            gap: 1rem;
          }
        }

        .contact-info .label {
          display: block;
          font-size: 0.65rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.08em;
          margin-bottom: 0.15rem;
        }

        .contact-info .value {
          display: block;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.85);
        }

        /* Summary body */
        .summary-body {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.88rem;
        }

        .summary-row .label {
          color: rgba(255, 255, 255, 0.55);
        }

        .summary-row .value {
          color: rgba(255, 255, 255, 0.85);
          font-weight: 500;
        }

        .summary-row.discount .label {
          color: rgba(239, 68, 68, 0.85);
        }

        .summary-row.discount .value {
          color: #ef4444;
          font-weight: 600;
        }

        .summary-separator {
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          margin: 0.4rem 0;
        }

        .total-row {
          font-size: 1.05rem;
        }

        .total-row .label {
          font-weight: 700;
          color: #ffffff;
        }

        .total-row .value {
          font-weight: 700;
        }

        .payment-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .payment-footer .label {
          font-size: 0.65rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.08em;
        }

        .method-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0.15rem 0.55rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
          text-transform: capitalize;
        }

        /* ── Stepper Card ── */
        .stepper-card {
          margin-top: 0.5rem;
        }

        .stepper-body {
          position: relative;
          padding: 0.5rem 0;
        }

        .stepper-list {
          list-style: none;
          padding: 0;
          margin: 0;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .stepper-line {
          position: absolute;
          left: 17px;
          top: 30px;
          bottom: 30px;
          width: 2px;
          background: linear-gradient(180deg, #38bdf8, rgba(56,189,248,0.2) 70%, transparent 100%);
          z-index: 0;
        }

        .step-item {
          position: relative;
          z-index: 1;
          margin-bottom: 1.5rem;
        }

        .step-item:last-child {
          margin-bottom: 0;
        }

        .step-date-header {
          font-size: 0.72rem;
          font-weight: 700;
          color: rgba(56, 189, 248, 0.75);
          margin-left: 2.75rem;
          margin-bottom: 0.5rem;
          letter-spacing: 0.06em;
        }

        .step-row {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .step-dot-outer {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(10, 22, 40, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
          z-index: 2;
        }

        .step-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .default-dot {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .delivered-dot {
          background: #10b981;
          box-shadow: 0 0 10px #10b981;
        }

        .cancelled-dot {
          background: #ef4444;
        }

        .shipped-dot {
          background: #38bdf8;
          box-shadow: 0 0 10px #38bdf8;
        }

        .step-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          padding-top: 0.35rem;
        }

        .step-desc {
          font-size: 0.88rem;
          font-weight: 600;
          color: #ffffff;
        }

        .step-desc.cancelled-text {
          color: rgba(239, 68, 68, 0.8);
          text-decoration: line-through;
        }

        .step-time {
          font-size: 0.78rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .no-status-text {
          color: rgba(255, 255, 255, 0.45);
          text-align: center;
          margin: 1.5rem 0;
        }

        /* ── Order Items Section ── */
        .order-items-section {
          margin-top: 0.5rem;
        }

        .section-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 1rem;
        }

        .table-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          overflow-x: auto;
        }

        @media (min-width: 640px) {
          .mobile-items-list {
            display: none !important;
          }
        }

        @media (max-width: 639px) {
          .table-card {
            display: none !important;
          }
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.875rem;
        }

        .items-table th {
          font-size: 0.68rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.08em;
          padding: 1.1rem 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          text-transform: uppercase;
        }

        .items-table td {
          padding: 1.1rem 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.7);
        }

        .items-table tr:last-child td {
          border-bottom: none;
        }

        .item-name-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          align-items: flex-start;
        }

        .product-title {
          font-weight: 600;
          color: #ffffff;
        }

        .variant-pill {
          display: inline-block;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.2);
          color: #38bdf8;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .line-total-cell {
          font-weight: 600;
          color: #ffffff;
        }

        /* Mobile card list */
        .mobile-items-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-item-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 1rem;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .item-top {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          align-items: flex-start;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.6rem;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .item-details .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
        }

        .item-details .detail-row .label {
          color: rgba(255, 255, 255, 0.4);
        }

        .item-details .detail-row .value {
          color: rgba(255, 255, 255, 0.85);
        }

        .item-details .detail-row.total {
          margin-top: 0.4rem;
          padding-top: 0.6rem;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        .item-details .detail-row.total .label {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
        }

        .item-details .detail-row.total .value {
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
