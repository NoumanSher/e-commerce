"use client";
import PoductImageGallery from "@/components/gallery";
import ProductInfo from "@/components/productDetail/ProductDetails";
import { useGetProductDetailById } from "./productDetailQuery";

interface ProductDetailProps {
  productId: string;
}
const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const { data, isLoading } = useGetProductDetailById(productId);

 

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex  flex-col lg:flex-row lg:p-8 p-4  container mx-auto">
      <PoductImageGallery images={data.data.images ?? []} />
      <ProductInfo product={data.data} />
    </div>
  );
};
// ProductDetail.displayName = 'ProductDetail'
export default ProductDetail;
