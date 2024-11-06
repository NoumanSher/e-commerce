// Header.tsx
'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

const Header: React.FC<{ orderDate: string; productTitle: string }> = ({ orderDate, productTitle }) => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center border-b pb-4">
      <div className='flex items-center gap-x-2'>
        <h2 className="text-xl font-semibold text-primary">Order Details</h2>
        <p>{orderDate} • {productTitle}</p>
      </div>
      <button onClick={() => router.back()} className="text-blue-500 underline">
        Back to List
      </button>
    </div>
  );
};

export default Header;
