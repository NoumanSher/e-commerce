"use client"
import React from "react";
import Link from "next/link";
import { useStore } from "@/Context/storeContext";
export default function AllProductBtn() {
  const { selectedCategory } = useStore()
  return (
    <div className="flex justify-center  mb-6 md:mb-8 md:mt-3 xl:mt-9 xl:mb-15 pb-10 lg:pb-15">
      <Link href={`/all-products?parentCategorySlug=${selectedCategory}`} className="uppercase text-[14px] font-semibold btn-link1 pb-1 leading-[1.2rem] text-center mt-2">
        See All Products
      </Link>
    </div>
  );
}
