'use client'
import React, { memo } from "react";
import { useCategories } from "@/hooks/useCategories";

const ProductsCatgories = () => {
  const { data, isLoading, error } = useCategories();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <div>
      <div>
        <h1 className="text-[26px] xl:text-[32px] !font-normal leading-[1.2em] xl:leading-[1.5em] !mb-1 text-center">
          Trending
        </h1>
      </div>
      <div className="xl:mt-8">
        <ul className="flex flex-wrap justify-center mb-[1rem] mt-2">
          {data?.categories?.slice(0,4).map((item) => (
            <li key={item._id}>
              <a
                href="#"
                className="nav-link mx-[25px] mt-[11px] pb-[9px] leading-[1.375em] text-[14px] xl:text-[16px] !font-medium uppercase"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default memo(ProductsCatgories);
