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
          {discount > 0 ? (
            <>
              <p className="text-2xl lg:text-xl text-red-600 font-bold lg:font-semibold">
                Rs {formatPrice(price)}
              </p>
              <p className="text-lg lg:text-sm text-gray-500 line-through">
                Rs {formatPrice(Math.round(price / (1 - discount / 100)))}
              </p>
            </>
          ) : (
            <p className="text-2xl lg:text-xl text-gray-900 font-bold lg:font-semibold">
              Rs {formatPrice(price)}
            </p>
          )}
          {discount ? (
            <span className="bg-black text-white px-2 py-1 text-xs lg:text-sm font-semibold rounded tracking-wide">
              -{discount}% OFF
            </span>
          ) : null}
        </div>
        <div className="flex items-center">
          {stockAvailability === 0 ? (
            <span className="text-[#EF0505] text-sm lg:text-base font-bold uppercase tracking-wider">Sold Out</span>
          ) : (
            <span className="text-gray-600 text-sm lg:text-base font-medium">
              In Stock {stockAvailability}
            </span>
          )}
        </div>
      </div>
      <div className="text-gray-600 mb-4 lg:max-h-96 lg:overflow-y-auto px-3 lg:px-0 text-sm lg:text-base rich-text hidden lg:block">
        {typeof description === "string" &&
          /<[a-z][\s\S]*>/i.test(description) ? (
          <>{ReactHtmlParser(description.replace(/&nbsp;/g, " "))}</> // Fix for horizontal scroll and rich text
        ) : (
          description
        )}
      </div>
    </>
  );
};
ProductBasicInfo.displayName = "ProductBasicInfo";

export default React.memo(ProductBasicInfo);
