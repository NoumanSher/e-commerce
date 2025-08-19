import React from "react";
import ReactHtmlParser from "html-react-parser";
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
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-medium">{title}</h1>
      </div>
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-x-4">
          <p className="text-lg font-semibold">Rs {price.toFixed(0)}</p>
          <p className="text-lg font-semibold">
            <span className="text-red-500">Discount</span> {discount}% OFF
          </p>
        </div>
        <div className="flex items-center">
          {stockAvailability === 0 ? (
            <span className="text-red-500">Out of Stock</span>
          ) : (
            <span className="text-green-600 text-base">
              In Stock {stockAvailability}
            </span>
          )}
        </div>
      </div>
      <div className="text-gray-600 mb-4 lg:h-80 lg:overflow-y-auto">
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
