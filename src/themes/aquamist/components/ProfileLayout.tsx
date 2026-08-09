"use client";

import React, { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useGetOrdersByUserId } from "@/app/(pages)/profile/profileQuery";

const navItems = [
  {
    href: "/profile",
    label: "Overview",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/profile/order-history",
    label: "Order History",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
      </svg>
    ),
  },
];

/**
 * AquaMist Profile Layout
 *
 * Wraps profile pages in the HumidAura glassmorphism sidebar layout.
 * The sidebar shows user avatar, name, order badge, and theme-styled nav.
 */
const ProfileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { userId, userName } = useAuth();
  const { data } = useGetOrdersByUserId(userId);
  const orderCount = useMemo(() => (data as any)?.data?.length ?? 0, [data]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Initials for avatar
  const initials = (userName || "U")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative min-h-screen pt-[90px] sm:pt-[120px] pb-12 px-3 sm:px-4 md:px-8 overflow-x-hidden">
      {/* Atmospheric background blobs */}
      <div className="aquamist-blob blob-1" aria-hidden />
      <div className="aquamist-blob blob-2" aria-hidden />
      <div className="aquamist-blob blob-3" aria-hidden />

      <div className="relative z-[1] flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 mx-auto">
        {/* ── Sidebar ── */}
        <aside className="aquamist-profile-sidebar">
          {/* User card – shown only on desktop sidebar */}
          <div className="aquamist-profile-user-card">
            <div className="aquamist-avatar">
              {initials}
              <div className="aquamist-avatar-ring" />
            </div>
            <div className="aquamist-user-info">
              <p className="aquamist-user-name">{mounted ? userName || "Guest" : "…"}</p>
              <div className="aquamist-badge-row">
                <span className="aquamist-order-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {orderCount} order{orderCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="aquamist-profile-nav">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`aquamist-nav-item${isActive ? " active" : ""}`}
                >
                  <span className="aquamist-nav-icon">{item.icon}</span>
                  <span className="aquamist-nav-label">{item.label}</span>
                  {isActive && <span className="aquamist-nav-indicator" aria-hidden />}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="aquamist-profile-main">
          {children}
        </main>
      </div>

      <style jsx global>{`
        /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           AquaMist Profile Layout Styles
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

        /* ── Atmospheric blobs ── */
        .aquamist-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.12;
          pointer-events: none;
          z-index: 0;
          animation: blobDrift 12s ease-in-out infinite;
        }
        .blob-1 { width: 500px; height: 500px; background: radial-gradient(circle, #38bdf8, #0ea5e9); top: -100px; left: -100px; animation-delay: 0s; }
        .blob-2 { width: 400px; height: 400px; background: radial-gradient(circle, #818cf8, #6366f1); bottom: -80px; right: -80px; animation-delay: -4s; }
        .blob-3 { width: 300px; height: 300px; background: radial-gradient(circle, #34d399, #10b981); top: 50%; left: 50%; transform: translate(-50%, -50%); animation-delay: -8s; }
        @keyframes blobDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }

        /* ── Sidebar ── */
        .aquamist-profile-sidebar {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1.25rem;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          box-shadow: 0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07);
        }

        /* On mobile: compact user-card + 2-column grid nav tabs */
        @media (max-width: 1023px) {
          .aquamist-profile-user-card {
            padding: 0.65rem 0.85rem;
            margin-bottom: 0.25rem;
          }
          .aquamist-avatar {
            width: 40px;
            height: 40px;
            font-size: 0.9rem;
          }
          .aquamist-user-name {
            font-size: 0.85rem;
            margin: 0 0 0.1rem;
          }
          .aquamist-order-badge {
            font-size: 0.68rem;
            padding: 0.15rem 0.45rem;
          }
          .aquamist-profile-nav {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 0.4rem !important;
            padding: 0 !important;
          }
          .aquamist-nav-item {
            justify-content: center;
            padding: 0.55rem 0.5rem !important;
            gap: 0.4rem !important;
            font-size: 0.78rem !important;
            border-radius: 0.75rem !important;
            white-space: nowrap;
          }
          .aquamist-nav-icon svg {
            width: 16px;
            height: 16px;
          }
        }

        @media (min-width: 1024px) {
          .aquamist-profile-sidebar {
            width: 280px;
            min-width: 280px;
            padding: 1.5rem;
            border-radius: 1.5rem;
            position: sticky;
            top: 130px;
          }
        }

        /* ── User card ── */
        .aquamist-profile-user-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(56, 189, 248, 0.06);
          border: 1px solid rgba(56, 189, 248, 0.12);
          border-radius: 1rem;
          margin-bottom: 0.5rem;
        }

        .aquamist-avatar {
          position: relative;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #38bdf8, #0ea5e9, #818cf8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
          letter-spacing: 0.05em;
        }

        .aquamist-avatar-ring {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 2px solid transparent;
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.6), rgba(129, 140, 248, 0.6)) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
          animation: ringPulse 3s ease-in-out infinite;
        }

        @keyframes ringPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .aquamist-user-info { flex: 1; min-width: 0; }

        .aquamist-user-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.95);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0 0 0.25rem;
        }

        .aquamist-badge-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }

        .aquamist-order-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: #38bdf8;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          letter-spacing: 0.02em;
        }

        /* ── Navigation ── */
        .aquamist-profile-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.25rem 0;
        }

        .aquamist-nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.875rem;
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          overflow: hidden;
        }

        .aquamist-nav-item:hover {
          color: rgba(255, 255, 255, 0.9);
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .aquamist-nav-item.active {
          background: rgba(56, 189, 248, 0.12);
          border-color: rgba(56, 189, 248, 0.2);
          color: #38bdf8;
        }

        .aquamist-nav-icon { display: flex; align-items: center; flex-shrink: 0; }
        .aquamist-nav-label { flex: 1; }

        .aquamist-nav-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #38bdf8;
          box-shadow: 0 0 8px #38bdf8;
          animation: indicatorPulse 2s ease-in-out infinite;
        }

        @keyframes indicatorPulse {
          0%, 100% { box-shadow: 0 0 6px #38bdf8; }
          50% { box-shadow: 0 0 14px #38bdf8; }
        }

        /* ── Main content area ── */
        .aquamist-profile-main {
          flex: 1;
          min-width: 0;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 1.25rem;
          box-shadow: 0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06);
          padding: 0.75rem;
          color: rgba(255, 255, 255, 0.9);
        }

        @media (min-width: 640px) {
          .aquamist-profile-main {
            padding: 2rem;
            border-radius: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileLayout;
