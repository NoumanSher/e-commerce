import React from "react";
import ReactHtmlParser from "html-react-parser";
interface ProductInfoProps {
  title: string;
  price: number;
  stockAvailability: number;
  description: string;
}

const ProductBasicInfo: React.FC<ProductInfoProps> = ({
  title,
  price,
  description,
  stockAvailability,
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-medium">{title}</h1>
        <div>
          <span
            className={`mr-2  ${
              stockAvailability === 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            Stock Availability
          </span>
          <span>{stockAvailability}</span>
        </div>
      </div>
      <p className="text-lg font-semibold mb-3">Rs {price.toFixed(0)}</p>
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
