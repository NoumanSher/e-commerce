import React from "react";

interface ProductMetaInfoProps {
  sku: string;
  categories: string;
  tags: string;
}

const ProductMetaInfo: React.FC<ProductMetaInfoProps> = ({
  sku,
  categories,
  tags,
}) => {
  return (
    <div className="mb-5">
      <p className="uppercase text-sm text-gray-500 mb-1">
        sku: <span className="text-black text-xs capitalize">{sku}</span>
      </p>
      <p className="uppercase text-sm text-gray-500 mb-1">
        categories:{" "}
        <span className="text-black text-xs capitalize">{categories}</span>
      </p>
      <p className="uppercase text-sm text-gray-500">
        tags: <span className="text-black text-xs lowercase">{tags}</span>
      </p>
    </div>
  );
};
ProductMetaInfo.displayName = "ProductMetaInfo";


export default React.memo(ProductMetaInfo);
