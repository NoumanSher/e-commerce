import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductReviews } from "@/components/reviews/ProductReviews";
import { useStore } from "@/Context/storeContext";
import { useGetRelatedProductsByCategoryId } from "@/components/productDetail/productDetailQuery";
import MainCard from "../../Card/index";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { categoryService } from "@/services/categoryService";
interface RelatedProductsProps {
  productSlug: string;
  productId: string;
}

export default function RelatedProducts({ productSlug, productId }: RelatedProductsProps) {
  const queryClient = useQueryClient();
  const { selectedCategory, userId, authToken } = useStore();

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
            queryFn: () => categoryService.fetchCategories(),
          });
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        }
      }

      const matchedCategory = categoryData?.categories?.find(
        (item: any) => item.slug === selectedCategory
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
      newRecommendedCategoryId = "nighties";
    } else if (category.slug === "undergarments") {
      newRecommendedCategoryId = "nighties";
    } else if (category.slug === "nighties") {
      newRecommendedCategoryId = "undergarments";
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
    relatedProducts?.data?.filter((item) => item.seo.slug !== productSlug) || [];

  const filteredRecommendedProducts =
    recommendedProducts?.data?.filter((item) => item.seo.slug !== productSlug) || [];
  const tabTriggerStyle =
    "px-0 bg-transparent text-base sm:text-lg font-medium text-gray-600 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-black rounded-none";
  const data = [{ title: "Related Products" }, { title: "Recommended" }, { title: "Reviews" }];
  return (
    <Tabs defaultValue="related products" className="mt-5">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
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
        {isRecommendedLoading ? (
          <div className="text-center py-8">
            Loading recommended products...
          </div>
        ) : recommendedError ? (
          <div className="text-center text-red-500 py-8">
            Error loading recommended products
          </div>
        ) : filteredRecommendedProducts.length > 0 ? (
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
      <TabsContent value="reviews">
        <ProductReviews
          productId={productId}
          userId={userId}
          isAuthenticated={Boolean(authToken ? true : false)}
        />
      </TabsContent>
    </Tabs>
  );
}
