import Image from "next/image";
import React, { memo, useCallback, useState } from "react";
import Imag from "@/assets/img/vidar-nordli-mathisen-IbaTONUx7BI-unsplash.jpg";
import CardHover from "@/components/CardHover";
import { LimitedEditionCardProps } from "../types/LimitedEditionCardDto";

const LimitedEditionCard = ({ index }: LimitedEditionCardProps) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const handleMouseEnter = useCallback((id: number) => {
    setHoveredCard(id);
  }, []);
  const handleMouseLeave = useCallback(() => {
    setHoveredCard(null); // Reset the hovered state
  }, []);
  const isHovered = hoveredCard === index;
  return (
    <>
      <div className="flex w-full justify-between items-center">
        <div
          key={index}
          className="w-[100%] pr-[6px] md:!pr-3   lg:!pr-[18px] xl:pr-6 flex-shrink-0"
        >
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={Imag} // Use currentImage instead of Imag
              alt="Product Image"
              priority={true}
              loading='eager'
              className="aspect-[260/315] w-full  object-cover"
            />
            <CardHover isHovered={isHovered} />
          </div>
          <div className="p-6 bg-[#e9e7e8]">
            <h1 className="text-base font-normal leading-[1.2rem]">
              Calvin Shorts
            </h1>
            <p className="text-base font-normal leading-[1.2rem]">$29</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(LimitedEditionCard);
