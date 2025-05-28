"use client";
import Image from "next/image";
import React, { memo, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useQueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import CardHover from "../cardHover";
import { Product } from "@/components/productDetail/productDetailDto";
interface MainCardProps {
  item: Product;
}
// Fetch product data from API
async function getProductDataById(productId: string) {
  debugger;
  const response = await fetch(
    `https://e-commerce-backend-seven-xi.vercel.app/api/products/get-product/${productId}`,
    { cache: "no-store" }
  );
  const data = await response.json();
  return data;
}
const MainCard = ({ item }: MainCardProps) => {
  const queryClient = useQueryClient();
  // console.log("New Chages");
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>("gray");
  const isHovered = hoveredCard === item._id;
  // Prefetch product data on hover
  const prefetchProduct = (productId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["product", productId],
      queryFn: () => getProductDataById(productId),
      staleTime: 60 * 1000, // Cache for 1 minute
    });
  };
  const handleColorSelect = useCallback((color: string) => {
    setSelectedColor(color);
  }, []);
  // Memoize the event handlers to prevent re-creation on each render
  const handleMouseEnter = useCallback((id: string) => {
    setHoveredCard(id);
  }, []);
  const handleMouseLeave = useCallback(() => {
    setHoveredCard(null); // Reset the hovered state
  }, []);
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div
          className=" mb-6 xl:mb-12   px-2  md:px-4 cursor-pointer"
          onClick={() => router.push(`/pages/product-detail/${item._id}`)}
          onMouseEnter={() => prefetchProduct(item._id)}
          onTouchStart={() => prefetchProduct(item._id)}
        >
          <div className=" cursor-pointer">
            <div
              className="relative xl:h-[404px] "
              onMouseEnter={() => handleMouseEnter(item._id)}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                priority={true}
                loading="eager"
                src={item.images[0]?.src}
                width={250}
                height={404}
                alt="Product BAnner Img"
                className="object-cover  w-full h-full transition-transform duration-700 ease-in-out transform-gpu "
              />
              {item.isNew && (
                <div className="bg-white absolute top-0 mx-[8px] mt-[8px] py-[7px] px-[10px] ">
                  <h1 className="uppercase text-black text-[12px] leading-[1.25em] font-normal ">
                    New
                  </h1>
                </div>
              )}

              {item.salePrice && (
                <div
                  className={`bg-black absolute top-0 mx-[8px] mt-[8px] py-[7px] px-[10px] ${
                    item.isNew ? "top-[36px]" : ""
                  } `}
                >
                  <h1 className="uppercase text-white text-[12px] leading-[1.25em] font-normal ">
                    sale
                  </h1>
                </div>
              )}
              {item.discount && (
                <div className="bg-[#c32929] absolute left-auto !right-0 top-0 flex flex-col  mx-[8px] mt-[8px] py-[7px] px-[10px] ">
                  <h1 className="uppercase text-white text-[12px] leading-[1.25em] font-normal ">
                    {item.discount + "% off"}
                  </h1>
                </div>
              )}
              <CardHover isHovered={isHovered} product={item} />
            </div>
            <div className="mt-4">
              {/* <h1 className="mb-[4px] font-normal leading-[1.7143rem] text-[#767676] text-[14px]">
              {item.productCategory}
            </h1> */}
              <p className="font-normal leading-[1.2em] text-[16px]">
                {item.productName}
              </p>
              <p className="font-semibold leading-[1.7143rem]  text-[16px]">
                Rs {item.salePrice}
              </p>
              <div className="mt-[4px] flex items-center gap-2 ">
                {item.options &&
                  item?.options[1]?.values?.map((color, index) => (
                    <div
                      key={index}
                      className={`w-[20px] h-[20px] rounded-[50%] cursor-pointer border-2 flex justify-center items-center ${
                        selectedColor === color
                          ? "border-black"
                          : "border-transparent"
                      }`}
                      onClick={(e: any) => handleColorSelect(color)}
                    >
                      <div
                        className={`w-[10px] h-[10px] rounded-[50%]`}
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </HydrationBoundary>
    </>
  );
};

export default memo(MainCard);
