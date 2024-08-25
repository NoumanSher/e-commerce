import React, { memo, useCallback, useMemo, useState } from "react";
import { FiEye, FiHeart } from "react-icons/fi";
import { MdOutlineShoppingBag } from "react-icons/md";
import Image from "next/image";
import { ProductCardData } from "@/data/data";

const  ProductsCard=()=> {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>("gray");
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
    <div>
      <div className="flex flex-wrap xl:max-w-[1350px] mx-auto xl:mt-14 ">
        {ProductCardData.map((item, index) => {
          const isHovered = hoveredCard === item._id;
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const currentImage = useMemo(
            () => (isHovered ? item.thumbNailImage1 : item.thumbNailImage2),
            [hoveredCard]
          );
          return (
            <div
              key={item._id}
              className="w-[50%] md:w-[33.333%] mb-6 xl:mb-12   px-2 lg:w-[25%] md:px-4"
            >
              <div className="">
                <div
                  className="relative xl:h-[404px]"
                  onMouseEnter={() => handleMouseEnter(item._id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Image
                    src={currentImage}
                    alt="Product BAnner Img"
                    className="object-cover w-full h-full transition-transform duration-700 ease-in-out transform-gpu "
                  />
                  {item.isNew && (
                    <div className="bg-white absolute top-0 mx-[8px] mt-[8px] py-[7px] px-[10px] ">
                      <h1 className="uppercase text-black text-[12px] leading-[1.25em] font-normal ">
                        New
                      </h1>
                    </div>
                  )}

                  {item.isSale && (
                    <div className="bg-black absolute top-0 mx-[8px] mt-[8px] py-[7px] px-[10px] ">
                      <h1 className="uppercase text-white text-[12px] leading-[1.25em] font-normal ">
                        sale
                      </h1>
                    </div>
                  )}
                  {item.discount && (
                    <div className="bg-[#c32929] absolute left-auto !right-0 top-0 flex flex-col  mx-[8px] mt-[8px] py-[7px] px-[10px] ">
                      <h1 className="uppercase text-white text-[12px] leading-[1.25em] font-normal ">
                        -67%
                      </h1>
                    </div>
                  )}

                  <div
                    className={`absolute bottom-[10px] mb-4 flex justify-center w-full gap-2 transition-all duration-300 ease-in-out transform ${
                      isHovered
                        ? "opacity-100 visible translate-y-[-10px]"
                        : "opacity-0 invisible translate-y-5"
                    }`}
                  >
                    <div className="w-[40px] h-[40px] cursor-pointer rounded-[50%] bg-white flex justify-center items-center ">
                      <MdOutlineShoppingBag />
                    </div>
                    <div className="w-[40px] h-[40px] cursor-pointer rounded-[50%] bg-white flex justify-center items-center ">
                      <FiEye />
                    </div>
                    <div className="w-[40px] h-[40px] cursor-pointer rounded-[50%] bg-white flex justify-center items-center ">
                      <FiHeart />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h1 className="mb-[4px] font-normal leading-[1.7143rem] text-[#767676] text-[14px]">
                    {item.productCategory}
                  </h1>
                  <p className="font-normal leading-[1.2em] text-[16px]">
                    {item.productName}
                  </p>
                  <p className="font-normal leading-[1.7143rem]  text-[16px]">
                    ${item.price}
                  </p>
                  <div className="mt-[4px] flex items-center gap-2 ">
                    {item.colors &&
                      item.colors.map((color, index) => (
                        <div
                          key={index}
                          className={`w-[20px] h-[20px] rounded-[50%] cursor-pointer border-2 flex justify-center items-center ${
                            selectedColor === color
                              ? "border-black"
                              : "border-transparent"
                          }`}
                          onClick={() => handleColorSelect(color)}
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
          );
        })}
      </div>
      <div className="flex justify-center  mb-6 md:mb-8 md:mt-3 xl:mt-9 xl:mb-24  ">
        <button className="uppercase text-[14px] font-semibold btn-link1 pb-1 leading-[1.2rem] text-center mt-2">
          See All Products
        </button>
      </div>
    </div>
  );
}
export default memo(ProductsCard)