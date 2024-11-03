// Header.tsx
'use client'
import React from 'react';
import Link from 'next/link';

const Header: React.FC<{ orderDate: string; productTitle: string; onBack: () => void }> = ({ orderDate, productTitle, onBack }) => (
  <div className="flex justify-between items-center border-b pb-4">
    <div>
      <h2 className="text-xl font-semibold">Order Details</h2>
      <p>{orderDate} • {productTitle}</p>
    </div>
    <Link href="#" onClick={onBack} className="text-blue-500 underline">Back to List</Link>
  </div>
);

export default Header;
