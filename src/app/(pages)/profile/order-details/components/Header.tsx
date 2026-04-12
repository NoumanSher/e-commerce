// Header.tsx
'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { RiArrowGoBackLine } from "react-icons/ri";
import { useSearchParams } from 'next/navigation';
const Header: React.FC<{ orderDate: string }> = ({ orderDate }) => {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const isFromOrderConfirmation = from === 'order-confirmation';
  const router = useRouter();

  return (
    <div className="flex justify-between items-center border-b border-gray-200 pb-6 mb-2">
      <div className='flex flex-col gap-y-1'>
        <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
        <p className="text-sm text-gray-500">{orderDate}</p>
      </div>
      <button onClick={() =>  isFromOrderConfirmation ? router.push('/') : router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700">
       <RiArrowGoBackLine title='Go back' size={24} />
      </button>
    </div>
  );
};

export default Header;
