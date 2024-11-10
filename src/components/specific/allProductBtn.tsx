import React from "react";
import Link from "next/link";
export default function AllProductBtn() {
  return (
    <div className="flex justify-center  mb-6 md:mb-8 md:mt-3 xl:mt-9 xl:mb-24">
      <Link href='/pages/all-products' className="uppercase text-[14px] font-semibold btn-link1 pb-1 leading-[1.2rem] text-center mt-2">
        See All Products
      </Link>
    </div>
  );
}
