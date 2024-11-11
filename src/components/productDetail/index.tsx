// pages/index.tsx
'use client'
import PoductImageGallery from "@/components/gallery";
import ProductInfo from "@/components/productDetail/ProductDetails";

import {ProductCardData} from '@/data/data'
import { useSearchParams } from "next/navigation";


const ProductDetail: React.FC = () => {
  const searchParams = useSearchParams(); // Access query parameters
  const productId = searchParams.get("product-id"); // Get 'section' param

  let product = ProductCardData.find((item) => item._id === productId)
  if (!product) {
    return <div>Product not found</div>;
  }
  return (
    <div className="flex  flex-col lg:flex-row lg:p-8 p-4  container mx-auto">
      <PoductImageGallery images={product?.images ?? []} />
      <ProductInfo product={product} />
    </div>
  );
};
// ProductDetail.displayName = 'ProductDetail'
export default ProductDetail;
