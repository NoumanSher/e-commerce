// Sidebar.tsx
'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Overview', href: '/pages/profile', icon: '📊' },
    { label: 'Order History', href: '/pages/profile/order-history', icon: '🕒' },
    // { label: 'Shopping Cart', href: '/profile/shopping-cart', icon: '🛒' },
    // { label: 'Account Settings', href: '/profile/account-settings', icon: '⚙️' },
    { label: 'Log-out', href: '/profile/logout', icon: '🚪' },
  ];

  return (
    <aside className="lg:w-[20%]  w-full lg:bg-gray-50 lg:p-6 px-4   h-auto rounded-s-lg ">
      <h2 className="text-lg font-bold mb-6">My Profile</h2>
      <nav>
        <ul className="gap-4 flex lg:flex-col  flex-row overflow-x-auto scrollbarHide">
          {menuItems.map(item => (
            <li key={item.href} className="flex  items-center">
              <span className="mr-3">{item.icon}</span>
              <Link
                href={item.href}
                className={`${
                  pathname === item.href ? 'text-black font-semibold' : 'text-gray-500'
                } whitespace-nowrap hover:text-black`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
