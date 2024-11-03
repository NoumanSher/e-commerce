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
    <aside className="w-64 bg-gray-50 p-6 h-auto rounded-s-lg">
      <h2 className="text-lg font-bold mb-6">My Profile</h2>
      <nav>
        <ul className="space-y-4">
          {menuItems.map(item => (
            <li key={item.href} className="flex items-center">
              <span className="mr-3">{item.icon}</span>
              <Link
                href={item.href}
                className={`${
                  pathname === item.href ? 'text-black font-semibold' : 'text-gray-500'
                } hover:text-black`}
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
