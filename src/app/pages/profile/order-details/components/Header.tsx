// Header.tsx
'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

const Header: React.FC<{ orderDate: string }> = ({ orderDate }) => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center border-b pb-2">
      <div className='flex justify-center  gap-x-2 flex-col'>
        <h2 className="lg:text-xl text-base font-semibold text-primary">Order Details</h2>
        <p>{orderDate}</p>
      </div>
      <button onClick={() => router.back()} className="text-blue-500 underline">
        Back to List
      </button>
    </div>
  );
};

export default Header;
