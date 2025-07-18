import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductReviews } from "@/components/reviews/ProductReviews";
import { useStore } from "@/Context/storeContext";
import { useGetRelatedProductsByCategoryId } from "@/components/productDetail/productDetailQuery";
import MainCard from "../../Card/index";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchCategories } from "@/services/categoryService";
interface RelatedProductsProps {
  productId: string;
}

export default function RelatedProducts({ productId }: RelatedProductsProps) {
  const queryClient = useQueryClient();
  const { selectedCategory, userId, isLogIn } = useStore();

  const [category, setCategory] = useState<any>(null);
  const [recommendedCategoryId, setRecommendedCategoryId] = useState("");

  // Fetch categories from cache or queryClient if not present
  useEffect(() => {
    const loadCategoryData = async () => {
      let categoryData = queryClient.getQueryData(["categories"]) as any;

      if (!categoryData) {
        try {
          categoryData = await queryClient.fetchQuery({
            queryKey: ["categories"],
            queryFn: fetchCategories,
          });
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        }
      }

      const matchedCategory = categoryData?.categories?.find(
        (item: any) => item._id === selectedCategory
      );
      setCategory(matchedCategory);
    };

    loadCategoryData();
  }, [selectedCategory, queryClient]);

  // Set recommended category ID based on current category
  useEffect(() => {
    if (!category) return;

    let newRecommendedCategoryId = "";
    if (category.slug === "all-categories") {
      newRecommendedCategoryId = "67f250eb2f78a67e01f2b299";
    } else if (category.slug === "Beauty & Health") {
      newRecommendedCategoryId = "67f250a92f78a67e01f2b28e";
    } else if (category.slug === "undergarments") {
      newRecommendedCategoryId = "67f250eb2f78a67e01f2b299";
    }

    if (newRecommendedCategoryId) {
      setRecommendedCategoryId(newRecommendedCategoryId);
    }
  }, [category]);

  // Fetch related products
  const {
    data: relatedProducts,
    isLoading: isRelatedLoading,
    error: relatedError,
  } = useGetRelatedProductsByCategoryId(selectedCategory as string);

  // Fetch recommended products
  const {
    data: recommendedProducts,
    isLoading: isRecommendedLoading,
    error: recommendedError,
  } = useGetRelatedProductsByCategoryId(recommendedCategoryId);

  if (!category) {
    return (
      <div className="text-center text-gray-500 py-8">
        No category information available
      </div>
    );
  }

  if (isRelatedLoading) {
    return <div className="text-center py-8">Loading related products...</div>;
  }

  if (relatedError) {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading related products
      </div>
    );
  }

  const filteredRelatedProducts =
    relatedProducts?.data?.filter((item) => item._id !== productId) || [];

  const filteredRecommendedProducts =
    recommendedProducts?.data?.filter((item) => item._id !== productId) || [];
console.log(userId)
  return (
    <Tabs defaultValue="relatedProducts" className="mt-5">
      <TabsList className="p-0 shadow-none space-x-4 bg-transparent mb-5">
        <TabsTrigger
          value="relatedProducts"
          className="px-0 text-start text-lg font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none text-gray-600 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:text-black rounded-none"
        >
          Related Products
        </TabsTrigger>
        <TabsTrigger
          value="recommended"
          className="px-0 bg-transparent text-lg font-medium text-gray-600 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black rounded-none"
        >
          Recommended
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="px-0 bg-transparent text-lg font-medium text-gray-600 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black rounded-none"
        >
          Reviews
        </TabsTrigger>
      </TabsList>

      <TabsContent value="relatedProducts">
        {filteredRelatedProducts.length > 0 ? (
          <div className="flex flex-wrap gap-y-6">
            {filteredRelatedProducts.map((item) => (
              <div key={item._id} className="w-[50%] md:w-[33.333%] lg:w-[25%]">
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
        {isRecommendedLoading ? (
          <div className="text-center py-8">
            Loading recommended products...
          </div>
        ) : recommendedError ? (
          <div className="text-center text-red-500 py-8">
            Error loading recommended products
          </div>
        ) : filteredRecommendedProducts.length > 0 ? (
          <div className="flex flex-wrap gap-y-6">
            {filteredRecommendedProducts.map((item) => (
              <div
                key={item._id}
                className="w-[50%] md:w-[33.333%] lg:w-[25%] px-2"
              >
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
      <TabsContent value="reviews">
        <ProductReviews
          productId={productId}
          userId={userId}
          isAuthenticated={Boolean(isLogIn ? true : false)}
          canReview={true}
        />
      </TabsContent>
    </Tabs>
  );
}
