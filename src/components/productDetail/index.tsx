"use client";
import PoductImageGallery from "@/components/gallery";
import ProductInfo from "@/components/productDetail/ProductDetails";
import { useQuery } from "@tanstack/react-query";

interface ProductDetailProps {
  productId: string;
}
const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const getProductDataById = async () => {
    const response = await fetch(
      `https://e-commerce-backend-seven-xi.vercel.app/api/products/get-product/${productId}`
    );
    return response.json();
  };
  const { data, isLoading } = useQuery({
    queryKey: ["productId", productId],
    queryFn: getProductDataById,
  });
  console.log(data);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex  flex-col lg:flex-row lg:p-8 p-4  container mx-auto">
      <PoductImageGallery images={data?.images ?? []} />
      <ProductInfo product={data} />
    </div>
  );
};
// ProductDetail.displayName = 'ProductDetail'
export default ProductDetail;
