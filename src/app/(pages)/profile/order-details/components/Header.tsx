// Header.tsx
'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from "react-icons/io5";
import { RiArrowGoBackLine } from "react-icons/ri";
const Header: React.FC<{ orderDate: string }> = ({ orderDate }) => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center border-b pb-2">
      <div className='flex justify-center  gap-x-2 flex-col'>
        <h2 className="lg:text-xl text-base font-semibold text-primary">Order Details</h2>
        <p>{orderDate}</p>
      </div>
      <button onClick={() => router.back()} className="text-black">
       <RiArrowGoBackLine title='Go back' size={30} />
      </button>
    </div>
  );
};

export default Header;
