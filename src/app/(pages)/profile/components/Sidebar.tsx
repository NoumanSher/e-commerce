"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/Context/storeContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setAuthToken } = useStore();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setAuthToken("");
    setOpen(false);
    router.push("/");
  };

  const menuItems = [
    { label: "Overview", href: "/profile", icon: "📊" },
    { label: "Order History", href: "/profile/order-history", icon: "🕒" },
    { label: "Log-out", href: "", icon: "🚪", onClick: () => setOpen(true) },
  ];

  return (
    <aside className="w-full lg:w-[20%] lg:bg-gray-50 lg:p-6 px-2 py-3 rounded-s-lg">
      <h2 className="text-lg font-bold mb-4 lg:mb-6">My Profile</h2>

      <nav>
        {/* Mobile: horizontal scroll | Desktop: vertical */}
        <ul className="flex lg:flex-col flex-row gap-2 sm:gap-4 overflow-x-auto scrollbarHide">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label} className="flex items-center">
                <span className="mr-2 lg:mr-3">{item.icon}</span>
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className="text-gray-500 whitespace-nowrap hover:text-black font-medium text-sm lg:text-base"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`${isActive ? "text-black font-semibold" : "text-gray-500"
                      } whitespace-nowrap hover:text-black text-sm lg:text-base`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Confirmation Modal */}
      <Dialog open={open} onOpenChange={setOpen}  >
        <DialogContent className="sm:max-w-md w-[90%] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-start">Confirm Logout</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to log out of your account?
          </p>

          <DialogFooter className="flex gap-2 ">
            <Button variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
};

export default Sidebar;
