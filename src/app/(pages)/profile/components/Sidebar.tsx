"use client";
import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useStore } from "@/Context/storeContext";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setIsLogIn, setUserId } = useStore();

  const handleLogout = () => {
    setIsLogIn(""); // Clear login state
    setUserId("");
    router.push("/"); // Redirect to home page
  };

  const menuItems = [
    { label: "Overview", href: "/profile", icon: "📊" },
    {
      label: "Order History",
      href: "/profile/order-history",
      icon: "🕒",
    },
    { label: "Log-out", href: "", icon: "🚪", onClick: handleLogout },
  ];

  return (
    <aside className="lg:w-[20%] w-full lg:bg-gray-50 lg:p-6 px-4 h-auto rounded-s-lg">
      <h2 className="text-lg font-bold mb-6">My Profile</h2>
      <nav>
        <ul className="gap-4 flex lg:flex-col flex-row overflow-x-auto scrollbarHide">
          {menuItems.map((item) => (
            <li key={item.label} className="flex items-center">
              <span className="mr-3">{item.icon}</span>
              {item.label === "Log-out" ? (
                <button
                  onClick={item.onClick} // Attach onClick for logout
                  className="text-gray-500 whitespace-nowrap hover:text-black font-medium"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? "text-black font-semibold"
                      : "text-gray-500"
                  } whitespace-nowrap hover:text-black`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
