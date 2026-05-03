"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { ProductReviews } from "@/components/Reviews/ProductReviews";
import { useAppUIContext } from "@/context/AppUIContext";
import { useAuth } from "@/context/AuthContext";
import { useGetProductRelatedInfo } from "@/components/productDetail/productDetailQuery";
import MainCard from "@/components/Card/index";
import { useCategoriesQuery } from "@/hooks/useProductsQuery";
import ReactHtmlParser from "html-react-parser";

interface MobileSectionsContainerProps {
  productSlug: string;
  productId: string;
  description: string;
  productImages?: { src: string; alt?: string }[];
}

/**
 * AliExpress-style long-scroll sections for mobile.
 * Renders: Reviews → Description → Related → Recommended
 * Each section has an ID for scroll-targeting from the sticky nav.
 */
const MobileSectionsContainer: React.FC<MobileSectionsContainerProps> = ({
  productSlug,
  productId,
  description,
  productImages = [],
}) => {
  const { selectedCategory } = useAppUIContext();
  const { userId, authToken } = useAuth();

  const { data: categoriesData } = useCategoriesQuery();
  const category = useMemo(
    () =>
      categoriesData?.categories?.find(
        (item) => item.slug === selectedCategory
      ) ?? null,
    [categoriesData, selectedCategory]
  );

  const {
    data: relatedInfo,
    isLoading,
  } = useGetProductRelatedInfo({
    parentCategorySlug: selectedCategory as string,
    categoryId: category?._id,
    productId: productId,
  });

  const relatedProducts = relatedInfo?.data?.related || [];
  const recommendedProducts = relatedInfo?.data?.recommended || [];

  const filteredRelatedProducts =
    relatedProducts?.filter((item) => item.seo.slug !== productSlug) || [];
  const filteredRecommendedProducts =
    recommendedProducts?.filter((item) => item.seo.slug !== productSlug) || [];

  const processDescription = (desc: string) => {
    if (typeof desc !== "string") return { textOnly: desc, images: [] };

    // Check if it's HTML
    if (!/<[a-z][\s\S]*>/i.test(desc)) {
      return { textOnly: desc, images: [] };
    }

    const images: { src: string; alt: string }[] = [];

    // Extract images
    const imgRegex = /<img([^>]+)>/gi;
    let match;
    while ((match = imgRegex.exec(desc)) !== null) {
      const imgAttrs = match[1];
      const srcMatch = imgAttrs.match(/src\s*=\s*(['"])(.*?)\1/i);
      const altMatch = imgAttrs.match(/alt\s*=\s*(['"])(.*?)\1/i);

      if (srcMatch && srcMatch[2]) {
        images.push({
          src: srcMatch[2],
          alt: altMatch ? altMatch[2] : "",
        });
      }
    }

    // Remove all img tags and empty paragraphs left behind
    let cleanHtml = desc.replace(/<img[^>]*>/gi, "");
    cleanHtml = cleanHtml.replace(/<p>\s*(?:<br\s*\/?>)?\s*<\/p>/gi, "");
    cleanHtml = cleanHtml.replace(/&nbsp;/g, " ");

    return { textOnly: cleanHtml, images };
  };

  const { textOnly, images } = useMemo(
    () => processDescription(description),
    [description]
  );

  return (
    <div className="lg:hidden">
      {/* ── REVIEWS SECTION ──────────────────────── */}
      <div className="h-2 bg-gray-100" />
      <section id="mobile-section-reviews" className="py-4 px-3">
        <h2 className="text-base font-semibold text-black mb-3 flex items-center gap-2">
          <span>Reviews</span>
        </h2>
        <ProductReviews
          productId={productId}
          userId={userId}
          isAuthenticated={Boolean(authToken)}
        />
      </section>

      {/* ── DESCRIPTION SECTION ──────────────────── */}
      <div className="h-2 bg-gray-100" />
      <section id="mobile-section-description" className="py-4">
        <h2 className="text-base font-semibold text-black mb-3 px-3">
          Product Description
        </h2>
        
        {/* Description Text */}
        <div className="text-gray-700 text-sm leading-relaxed rich-text mb-4 px-3">
          {typeof textOnly === "string" &&
          /<[a-z][\s\S]*>/i.test(textOnly) ? (
            <>{ReactHtmlParser(textOnly)}</>
          ) : (
            <p>{textOnly}</p>
          )}
        </div>

        {/* Extracted Images + Gallery Images in Column View */}
        {(images.length > 0 || productImages.length > 0) && (
          <div className="flex flex-col w-full mt-4">
            {images.map((img, idx) => (
              <Image
                key={`desc-img-${idx}`}
                src={img.src}
                alt={img.alt || `Product detail ${idx + 1}`}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto block object-contain"
              />
            ))}
            {productImages.map((img, idx) => (
              <Image
                key={`gallery-img-${idx}`}
                src={img.src}
                alt={img.alt || `Product gallery ${idx + 1}`}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto block object-contain"
              />
            ))}
          </div>
        )}
      </section>

      {/* ── RELATED PRODUCTS SECTION ─────────────── */}
      <div className="h-2 bg-gray-100" />
      <section id="mobile-section-related" className="py-4 px-3">
        <h2 className="text-base font-semibold text-black mb-3">
          Related Products
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-100 animate-pulse rounded"
              />
            ))}
          </div>
        ) : filteredRelatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {filteredRelatedProducts.map((item) => (
              <div key={item._id}>
                <MainCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-6 text-sm">
            No related products found
          </p>
        )}
      </section>

      {/* ── RECOMMENDATIONS SECTION ──────────────── */}
      <div className="h-2 bg-gray-100" />
      <section id="mobile-section-recommended" className="py-4 px-3">
        <h2 className="text-base font-semibold text-black mb-3">
          Recommended For You
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-100 animate-pulse rounded"
              />
            ))}
          </div>
        ) : filteredRecommendedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {filteredRecommendedProducts.map((item) => (
              <div key={item._id}>
                <MainCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-6 text-sm">
            No recommendations found
          </p>
        )}
      </section>

      {/* Bottom padding for the sticky action bar */}
      <div className="h-20" />
    </div>
  );
};

MobileSectionsContainer.displayName = "MobileSectionsContainer";

export default MobileSectionsContainer;
