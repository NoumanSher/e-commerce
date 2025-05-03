import React from "react";

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
          <span className={`mr-2  ${stockAvailability === 0 ? 'text-red-500' : 'text-green-500'}`}>Stock Availability</span>
          <span>{stockAvailability}</span>
        </div>
      </div>
      <p className="text-lg font-semibold mb-3">Rs {price.toFixed(0)}</p>
      <p className="text-gray-600 mb-4">{description}</p>
    </>
  );
};
ProductBasicInfo.displayName = "ProductBasicInfo";

export default React.memo(ProductBasicInfo);
