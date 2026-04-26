"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { useSocket } from "@/context/SocketContext";
import { useRouter } from "next/navigation";

const timeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return "just now";
};

const NotificationBell = () => {
  const { notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification._id);
    }
    setIsOpen(false);
    if (notification.metadata?.link) {
      router.push(notification.metadata.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-black transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute -right-10 sm:right-0 mt-2 w-[90vw] sm:w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllNotificationsAsRead()}
                className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold uppercase transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {(!notifications || notifications.length === 0) ? (
              <div className="p-8 text-center text-gray-500">
                <FiBell className="mx-auto mb-2 opacity-20" size={32} />
                <p className="text-xs">No notifications yet</p>
              </div>
            ) : (
              Array.isArray(notifications) && notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${
                    !n.isRead ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className={`text-xs font-semibold ${!n.isRead ? "text-blue-600" : "text-gray-800"}`}>
                      {n.title}
                    </p>
                    <span className="text-[10px] text-gray-400">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{n.message}</p>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-2 border-t border-gray-100 text-center">
              <button 
                className="text-[11px] font-semibold text-gray-500 hover:text-black transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
