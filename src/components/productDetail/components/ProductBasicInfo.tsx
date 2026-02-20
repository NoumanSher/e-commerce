import React from "react";
import ReactHtmlParser from "html-react-parser";
import { formatPrice } from "@/lib/utils";
interface ProductInfoProps {
  title: string;
  price: number;
  stockAvailability: number;
  discount: number;
  description: string;
}

const ProductBasicInfo: React.FC<ProductInfoProps> = ({
  title,
  price,
  description,
  stockAvailability,
  discount,
}) => {
  return (
    <>
      <div className="mb-3 px-3 lg:px-0">
        <h1 className="text-xl lg:text-2xl font-medium leading-tight">{title}</h1>
      </div>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-3 px-3 lg:px-0 gap-2 lg:gap-0">
        <div className="flex items-baseline gap-2 lg:gap-4">
          <p className="text-2xl lg:text-xl text-red-600 lg:text-[#111827] font-bold lg:font-semibold">
            Rs {formatPrice(price)}
          </p>
          {discount && (
            <p className="text-sm lg:text-lg font-semibold">
              <span className="text-red-500">Discount</span> {discount}% OFF
            </p>
          )}
        </div>
        <div className="flex items-center">
          {stockAvailability === 0 ? (
            <span className="text-red-500 text-sm lg:text-base">Out of Stock</span>
          ) : (
            <span className="text-green-600 text-sm lg:text-base">
              In Stock {stockAvailability}
            </span>
          )}
        </div>
      </div>
      <div className="text-gray-600 mb-4 lg:h-80 lg:overflow-y-auto px-3 lg:px-0 text-sm lg:text-base">
        {typeof description === "string" &&
          /<[a-z][\s\S]*>/i.test(description) ? (
          <>{ReactHtmlParser(description)}</> // Wrap in Fragment
        ) : (
          description
        )}
      </div>
    </>
  );
};
ProductBasicInfo.displayName = "ProductBasicInfo";

export default React.memo(ProductBasicInfo);
