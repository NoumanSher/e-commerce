import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductReviews } from "@/components/Reviews/ProductReviews";
import { useAppUIContext } from "@/context/AppUIContext";
import { useAuth } from "@/context/AuthContext";
import { useGetProductRelatedInfo } from "@/components/productDetail/productDetailQuery";
import MainCard from "../../Card/index";
import { useCategoriesQuery } from "@/hooks/useProductsQuery";
import { useMemo } from "react";

interface RelatedProductsProps {
  productSlug: string;
  productId: string;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export default function RelatedProducts({ productSlug, productId, activeTab = "related products", onTabChange }: RelatedProductsProps) {
  const { selectedCategory } = useAppUIContext();
  const { userId, authToken } = useAuth();

  // Read categories directly from the unified cache — no extra fetch needed.
  const { data: categoriesData } = useCategoriesQuery();
  const category = useMemo(
    () => categoriesData?.categories?.find((item) => item.slug === selectedCategory) ?? null,
    [categoriesData, selectedCategory]
  );

  // Fetch both related and recommended in one call
  const {
    data: relatedInfo,
    isLoading: isLoading,
    error: error,
  } = useGetProductRelatedInfo({
    parentCategorySlug: selectedCategory as string,
    categoryId: category?._id,
    productId: productId
  });

  const relatedProducts = relatedInfo?.data?.related || [];
  const recommendedProducts = relatedInfo?.data?.recommended || [];

  if (!category) {
    return (
      <div className="text-center text-gray-500 py-8">
        No category information available
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading products
      </div>
    );
  }

  const filteredRelatedProducts =
    relatedProducts?.filter((item) => item.seo.slug !== productSlug) || [];

  const filteredRecommendedProducts =
    recommendedProducts?.filter((item) => item.seo.slug !== productSlug) || [];
  const tabTriggerStyle =
    "px-0 bg-transparent text-base sm:text-lg font-medium text-gray-600 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black rounded-none";
  const data = [{ title: "Related Products" }, { title: "Recommended" }, { title: "Reviews" }];
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="mt-5 px-2 lg:px-8">
      <TabsList className="flex  justify-start scrollbarHide overflow-x-auto shadow-none space-x-2 bg-transparent mb-5">
        {data.map((item) => (
          <TabsTrigger
            key={item.title}
            value={item.title.toLowerCase()}
            className={tabTriggerStyle}
          >
            {item.title}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="related products">
        {filteredRelatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-2 sm:gap-4">
            {filteredRelatedProducts.map((item) => (
              <div key={item._id} className="">
                <MainCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No related products found
          </div>
        )}
      </TabsContent>

      <TabsContent value="recommended">
        {filteredRecommendedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {filteredRecommendedProducts.map((item) => (
              <div key={item._id} className="">
                <MainCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No recommended products found
          </div>
        )}
      </TabsContent>
      <TabsContent value="reviews" id="review">
        <ProductReviews
          productId={productId}
          userId={userId}
          isAuthenticated={Boolean(authToken ? true : false)}
        />
      </TabsContent>
    </Tabs>
  );
}
