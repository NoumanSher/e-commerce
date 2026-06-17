"use client";
/**
 * SocketContext — No-op stub
 *
 * Socket.IO is disabled because the backend is hosted on Vercel's free tier,
 * which does not support persistent WebSocket connections.
 *
 * All call-sites that import `useSocket` receive safe empty defaults.
 * Real-time order updates can be replaced with polling or Vercel's
 * Server-Sent Events (SSE) when upgrading to a paid plan.
 */
import { createContext, useContext, type ReactNode } from "react";

/** Shape of a single notification item (mirrors what the backend returns). */
export interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata?: {
    orderNo?: string;
    link?: string;
  };
}

interface SocketContextType {
  socket: null;
  connected: boolean;
  notifications: Notification[];
  unreadCount: number;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
}

const defaultValue: SocketContextType = {
  socket: null,
  connected: false,
  notifications: [],
  unreadCount: 0,
  markNotificationAsRead: async () => {},
  markAllNotificationsAsRead: async () => {},
};

const SocketContext = createContext<SocketContextType>(defaultValue);

export const useSocket = () => useContext(SocketContext);

/** Drop-in replacement — renders children unchanged, no WebSocket created. */
export const SocketProvider = ({ children }: { children: ReactNode }) => (
  <SocketContext.Provider value={defaultValue}>
    {children}
  </SocketContext.Provider>
);
