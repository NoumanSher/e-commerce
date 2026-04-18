"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { HiOutlineUser, HiOutlineClock, HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { useAuth } from "@/context/AuthContext";
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
  const { setAuthToken } = useAuth();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setAuthToken("");
    setOpen(false);
    router.push("/");
  };

  const menuItems = [
    { label: "Overview", href: "/profile", icon: <HiOutlineUser size={20} /> },
    { label: "Order History", href: "/profile/order-history", icon: <HiOutlineClock size={20} /> },
    { label: "Log-out", href: "", icon: <HiOutlineArrowRightOnRectangle size={20} />, onClick: () => setOpen(true) },
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 lg:bg-gray-50 lg:p-6 pb-2 lg:pb-6 rounded-s-lg border-b lg:border-b-0 lg:border-r border-gray-200">
      <h2 className="text-xl font-bold mb-4 lg:mb-8 hidden lg:block text-gray-900">My Profile</h2>

      <nav>
        {/* Mobile: horizontal scroll | Desktop: vertical */}
        <ul className="flex flex-row lg:flex-col px-4 lg:px-0 gap-2 overflow-x-auto scrollbarHide">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/profile" && item.href !== "" && pathname.startsWith(item.href));
            const activeClasses = isActive ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100 hover:text-black";
            return (
              <li key={item.label} className="flex-shrink-0 lg:w-full">
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className={`flex items-center w-full px-4 py-2.5 rounded-md transition-colors text-sm font-medium ${activeClasses}`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-2.5 rounded-md transition-colors text-sm font-medium ${activeClasses}`}
                  >
                    <span className="mr-3">{item.icon}</span>
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
