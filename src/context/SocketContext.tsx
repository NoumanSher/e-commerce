"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { get, patch } from "@/lib/apiClient";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  notifications: any[];
  unreadCount: number;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  notifications: [],
  unreadCount: 0,
  markNotificationAsRead: async () => {},
  markAllNotificationsAsRead: async () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { userId, authToken } = useAuth();

  useEffect(() => {
    // Get base URL - prefer 127.0.0.1 for local stability
    let apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:7418/api";
    let baseUrl = apiUrl.replace(/\/api$/, "");

    const socketInstance = io(baseUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socketInstance.on("connect", () => {
      console.log("📡 Socket connected:", socketInstance.id);
      setConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("📡 Socket disconnected");
      setConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (authToken) {
        try {
          const data = await get<any>("/notifications");
          if (data.success) setNotifications(data.data);
        } catch (err) {
          console.error("Failed to fetch notifications:", err);
        }
      }
    };
    fetchNotifications();
  }, [authToken]);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (socket && connected && userId) {
      console.log("👤 Registering user to socket room:", userId);
      socket.emit("registerUser", userId);

      // Listen for order status updates
      socket.on("orderStatusUpdated", (data) => {
        console.log("📦 Order Status Update received:", data);
        
        // Play notification sound
        try {
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
          audio.volume = 0.5;
          audio.play().catch(e => console.log("Sound play blocked by browser policy"));
        } catch (err) {
          console.error("Failed to play sound:", err);
        }

        // Add to notification list
        setNotifications(prev => [
          {
            _id: Date.now().toString(), // temporary ID
            title: "Order Update",
            message: data.message,
            isRead: false,
            createdAt: new Date().toISOString(),
            metadata: { orderNo: data.orderNo, link: data.link }
          },
          ...prev
        ]);

        toast.info(data.message, {
          position: "top-right",
          autoClose: 5000,
        });
      });
    }

    return () => {
      if (socket) {
        socket.off("orderStatusUpdated");
      }
    };
  }, [socket, connected, userId]);

  // Listen for stock restoration broadcasts from the backend.
  // Fires for ALL connected clients (not just the order owner) so every
  // visitor sees the updated stock immediately without a page reload.
  useEffect(() => {
    if (!socket) return;

    socket.on("stockRestored", (data: { productIds: string[] }) => {
      console.log("🔄 Stock restored for products:", data.productIds);
      // Invalidate all product queries so React Query refetches fresh stock
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
    });

    return () => {
      socket.off("stockRestored");
    };
  }, [socket, queryClient]);

  const markNotificationAsRead = async (id: string) => {
    try {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      await patch(`/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      await patch("/notifications/read-all");
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  return (
    <SocketContext.Provider value={{ 
      socket, 
      connected, 
      notifications: Array.isArray(notifications) ? notifications : [], 
      unreadCount: Array.isArray(notifications) ? notifications.filter(n => !n?.isRead).length : 0,
      markNotificationAsRead,
      markAllNotificationsAsRead
    }}>
      {children}
    </SocketContext.Provider>
  );
};
