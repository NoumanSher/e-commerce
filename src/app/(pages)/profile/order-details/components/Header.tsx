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
    <div className="flex justify-between items-center border-b pb-2">
      <div className='flex justify-center  gap-x-2 flex-col'>
        <h2 className="lg:text-xl text-base font-semibold text-primary">Order Details</h2>
        <p>{orderDate}</p>
      </div>
      <button onClick={() =>  isFromOrderConfirmation ? router.push('/') : router.back()} className="text-black">
       <RiArrowGoBackLine title='Go back' size={30} />
      </button>
    </div>
  );
};

export default Header;
