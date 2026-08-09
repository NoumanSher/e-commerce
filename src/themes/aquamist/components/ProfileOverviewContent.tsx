"use client";

import React, { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  useGetOrdersByUserId,
  useGetProfileDetailByUserId,
} from "@/app/(pages)/profile/profileQuery";
import { Address } from "@/app/(pages)/profile/profileDtos";
import AquamistOrdersTable from "./AquamistOrdersTable";

const getSafeData = (data: any) => ({
  orders: data?.data?.slice(0, 3) ?? [],
});

/**
 * AquaMist Profile Overview Content
 *
 * Premium glassmorphic user profile card, address info panel, and recent orders grid.
 */
export default function ProfileOverviewContent() {
  const { userId, userName } = useAuth();
  const { data: ordersResponse, isLoading: isOrdersLoading } = useGetOrdersByUserId(userId);
  const { data: profileDataResponse, isLoading: isProfileLoading } = useGetProfileDetailByUserId(userId);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const ordersData = useMemo(() => getSafeData(ordersResponse), [ordersResponse]);
  
  const profileAddress = (profileDataResponse as any)?.address as Address | undefined;
  const addressData = profileAddress || (ordersData.orders[0] as any)?.address as Address | undefined;

  const isLoading = isOrdersLoading || (isProfileLoading && !profileAddress);

  if (!mounted) return null;

  if (isLoading && !addressData && ordersData.orders.length === 0) {
    return (
      <div className="aquamist-profile-loader-container">
        <div className="aquamist-profile-spinner" />
        <p>Syncing your mist dashboard...</p>
        <style jsx>{`
          .aquamist-profile-loader-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 350px;
            color: rgba(56, 189, 248, 0.7);
            font-family: inherit;
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

  const latestOrder = ordersData.orders[0];
  const latestStatus = latestOrder?.orderStatuses?.[latestOrder.orderStatuses.length - 1]?.status ?? "Processing";

  return (
    <div className="aquamist-overview-container">
      {/* Welcome banner */}
      <div className="aquamist-welcome-banner">
        <div className="aquamist-welcome-left">
          <span className="aquamist-welcome-tagline">MEMBER DASHBOARD</span>
          <h1 className="aquamist-welcome-title">Welcome back, {userName || "Guest"}</h1>
          <p className="aquamist-welcome-text">
            Monitor the status of your intelligent humidification systems and manage account settings.
          </p>
        </div>
        {latestOrder && (
          <div className="aquamist-status-banner-card">
            <span className="banner-card-label">LATEST ORDER STATUS</span>
            <span className="banner-card-value">#{latestOrder.orderNo}</span>
            <div className="banner-card-status-pill">
              <span className="pulse-indicator" />
              {latestStatus}
            </div>
          </div>
        )}
      </div>

      {/* Info grid */}
      <div className="aquamist-info-grid">
        {/* Profile Card */}
        <div className="aquamist-glass-card profile-card">
          <div className="card-header">
            <div className="header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-sky-400">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3>Account Profile</h3>
          </div>
          <div className="card-body">
            <div className="profile-details-list">
              <div className="detail-item">
                <span className="detail-label">FULL NAME</span>
                <span className="detail-value">{userName || "Guest User"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="aquamist-glass-card address-card">
          <div className="card-header">
            <div className="header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-sky-400">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h3>Default Shipping Address</h3>
          </div>
          <div className="card-body">
            {addressData ? (
              <div className="address-details">
                <p className="address-recipient">{addressData.firstName} {addressData.lastName}</p>
                <p className="address-street">{addressData.streetAddress}</p>
                <p className="address-city">{addressData.city} {addressData.zipCode ? `, ${addressData.zipCode}` : ""}</p>
                <div className="address-contact-row">
                  <div>
                    <span className="detail-label">EMAIL</span>
                    <p className="contact-text">{addressData.email}</p>
                  </div>
                  <div>
                    <span className="detail-label">PHONE</span>
                    <p className="contact-text">{addressData.phone}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-address-state">
                <p>No shipping address on file.</p>
                <span className="subtext">Addresses are saved automatically during your checkout process.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders section */}
      <div className="aquamist-orders-section">
        <div className="section-header">
          <h2>Recent Orders</h2>
          {(ordersResponse?.data?.length ?? 0) > 3 && (
            <Link href="/profile/order-history" className="view-all-link">
              View All History
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 ml-1 transition-transform">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          )}
        </div>

        <AquamistOrdersTable orders={ordersData.orders} />
      </div>

      <style jsx>{`
        /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           AquaMist Overview Styles
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

        .aquamist-overview-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          font-family: inherit;
        }

        /* ── Welcome Banner ── */
        .aquamist-welcome-banner {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 1.75rem;
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(129, 140, 248, 0.03) 100%);
          border: 1px solid rgba(56, 189, 248, 0.15);
          border-radius: 1.25rem;
        }

        @media (min-width: 768px) {
          .aquamist-welcome-banner {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .aquamist-welcome-left {
          max-width: 600px;
        }

        .aquamist-welcome-tagline {
          font-size: 0.72rem;
          font-weight: 700;
          color: #38bdf8;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .aquamist-welcome-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0.5rem 0;
          letter-spacing: -0.02em;
        }

        .aquamist-welcome-text {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.5;
          margin: 0;
        }

        /* Status Banner Card */
        .aquamist-status-banner-card {
          padding: 1rem 1.25rem;
          background: rgba(10, 22, 40, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 200px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .banner-card-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.08em;
        }

        .banner-card-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
        }

        .banner-card-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          align-self: flex-start;
          margin-top: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.15);
          padding: 0.2rem 0.6rem;
          border-radius: 99px;
          border: 1px solid rgba(56, 189, 248, 0.2);
        }

        .pulse-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #38bdf8;
          box-shadow: 0 0 8px #38bdf8;
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 12px #38bdf8; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }

        /* ── Info Grid (Account Profile & Shipping Address side-by-side on desktop) ── */
        .aquamist-info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .aquamist-info-grid {
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
          height: 100%;
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

        /* Profile card list */
        .profile-details-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.08em;
        }

        .detail-value {
          font-size: 0.9rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
        }

        .theme-text-accent {
          color: #38bdf8;
          font-weight: 600;
        }

        .bg-pill {
          display: inline-block;
          align-self: flex-start;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 0.15rem 0.5rem;
          border-radius: 6px;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.8);
        }

        /* Address card details */
        .address-details {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .address-recipient {
          font-size: 0.95rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .address-street, .address-city {
          font-size: 0.88rem;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        .address-contact-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        @media (min-width: 480px) {
          .address-contact-row {
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
        }

        .contact-text {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0.1rem 0 0;
          word-break: break-all;
        }

        .no-address-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 1.5rem 0;
          color: rgba(255,255,255,0.4);
        }

        .no-address-state p {
          font-weight: 600;
          margin: 0 0 0.25rem;
          font-size: 0.95rem;
        }

        .no-address-state .subtext {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
          max-width: 220px;
          line-height: 1.4;
        }

        /* ── Orders Section ── */
        .aquamist-orders-section {
          margin-top: 0.5rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .view-all-link {
          display: inline-flex;
          align-items: center;
          font-size: 0.85rem;
          font-weight: 500;
          color: #38bdf8;
          text-decoration: none;
          opacity: 0.85;
        }

        .view-all-link:hover {
          opacity: 1;
        }

        .view-all-link:hover svg {
          transform: translateX(3px);
        }

        /* Orders Table */
        .orders-table-wrapper {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          overflow-x: auto;
        }

        @media (min-width: 640px) {
          .mobile-orders-list {
            display: none !important;
          }
        }

        @media (max-width: 639px) {
          .orders-table-wrapper {
            display: none !important;
          }
        }

        .aquamist-orders-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.875rem;
        }

        .aquamist-orders-table th {
          font-size: 0.68rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.08em;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          text-transform: uppercase;
        }

        .aquamist-orders-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.7);
        }

        .aquamist-orders-table tr:last-child td {
          border-bottom: none;
        }

        .aquamist-orders-table tr:hover td {
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

        .status-badge-pill {
          display: inline-flex;
          align-items: center;
          padding: 0.15rem 0.55rem;
          border-radius: 99px;
          font-size: 0.72rem;
          font-weight: 600;
          border: 1px solid transparent;
        }

        /* Status specific colors */
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

        .details-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255,255,255,0.6);
          transition: all 0.2s ease;
        }

        .details-action-btn:hover {
          background: rgba(56, 189, 248, 0.12);
          border-color: rgba(56, 189, 248, 0.3);
          color: #38bdf8;
          transform: scale(1.05);
        }

        /* No orders container */
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
