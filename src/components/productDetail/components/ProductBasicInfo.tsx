import React from "react";

interface ProductInfoProps {
  title: string;
  price: number;
  description: string;
}

const ProductBasicInfo: React.FC<ProductInfoProps> = ({ title, price, description }) => {
  return (
    <>
      <h1 className="text-2xl font-medium mb-3">{title}</h1>
      <p className="text-lg font-medium mb-3">${price.toFixed(0)}</p>
      <p className="text-gray-600 mb-4">{description}</p>
    </>
  );
};
ProductBasicInfo.displayName = "ProductBasicInfo";

export default React.memo(ProductBasicInfo);
