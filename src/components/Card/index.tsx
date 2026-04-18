"use client";
import Image from "next/image";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useQueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";
import CardHover from "../cardHover";
import { Product } from "@/components/productDetail/productDetailDto";
import useIsMobileOrTablet from "@/hooks/useIsHoveredOrMobile";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import { useStore } from "@/context/storeContext";
import { FiHeart } from "react-icons/fi";
import { formatPrice } from "@/lib/utils";
import { productsService } from "@/services/productsService";
import { queryKeys } from "@/lib/queryKeys";

interface MainCardProps {
  item: Product;
}

const defaultBlur =
  "data:image/svg+xml;base64," +
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f0f0f0" stop-opacity="1" />
          <stop offset="20%" stop-color="#e0e0e0" stop-opacity="1" />
          <stop offset="40%" stop-color="#f8f8f8" stop-opacity="1" />
          <stop offset="60%" stop-color="#e0e0e0" stop-opacity="1" />
          <stop offset="100%" stop-color="#f0f0f0" stop-opacity="1" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" fill="#f0f0f0" />
      <rect width="32" height="32" fill="url(#shimmer)" opacity="0.7" />
    </svg>`
  );

const MainCard = ({ item }: MainCardProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { addToCart } = useCart();
  const { setIsCartOpen } = useStore();

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  // const [isImageLoaded, setIsImageLoaded] = useState(false);
  const isMobileOrTablet = useIsMobileOrTablet();
  const { isInWishlist, removeFromWishlist, addToWishlist } = useWishlist();
  const [isTrue, setIsTrue] = useState(false);

  const getAspectRatio = (parentCategorySlug: string) => {
    switch (parentCategorySlug) {
      case "Jewellery":
        return "aspect-square";
      case "Women's Clothing":
        return "aspect-[3/4]";
      case "Men's Clothing":
        return "aspect-[3/4]";
      case "Kids":
        return "aspect-[3/4]";
      case "Beauty & Health":
        return "aspect-square";
      default:
        return "aspect-[3/4]";
    }
  };
  useEffect(() => {
    if (item?._id) {
      setIsTrue(isInWishlist(item?._id));
    }
  }, [isInWishlist, item?._id]);
  const isHovered = !isMobileOrTablet && hoveredCard === item.seo.slug; // ✅ hover only desktop

  // Prefetch product data on hover
  const prefetchProduct = useCallback((slug: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.detail(slug),
      queryFn: () => productsService.getProductBySlug(slug),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    });
    // Also prefetch the Next.js page bundle
    router.prefetch(`/product-detail/${slug}`);
  }, [queryClient, router]);

  const handleMouseEnter = useCallback((slug: string) => {
    setHoveredCard(slug);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredCard(null);
  }, []);
  const handleAddToWishlist = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (item) addToWishlist(item);
  };

  const handleRemoveFromWishlist = (e: any) => {
    e.stopPropagation();
    if (item) removeFromWishlist(item?._id);
  };

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>, // Use the correct type for the event
    isVariant: boolean
  ) => {
    if (!item) {
      return;
    }
    e.stopPropagation(); // Prevent event bubbling

    if (isVariant) {
      // Redirect to product details page if the product has variants
      router.push(`/product-detail/${item.seo.slug}`);
    } else {
      // Add product to cart
      let product = item;
      addToCart({ product, quantity: 1 });

      setTimeout(() => {
        setIsCartOpen(true);
      }, 2000);
    }
  };
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div
        className="group relative  overflow-hidden cursor-pointer 
                   bg-white/10 backdrop-blur-md border border-white/20 shadow-md 
                   hover:shadow-xl transition-all duration-300"
        onClick={() => router.push(`/product-detail/${item.seo.slug}`)}
        onMouseEnter={() => prefetchProduct(item.seo.slug)}
        onTouchStart={() => prefetchProduct(item.seo.slug)}
      >
        {/* Image Section */}
        <div
          className={`relative  ${getAspectRatio(item.parentCategoryID.name)} w-full`}
          onMouseEnter={() => handleMouseEnter(item.seo.slug)}
          onMouseLeave={handleMouseLeave}
        >
          {/* {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
              <span className="text-gray-500 text-sm">Loading...</span>
            </div>
          )} */}
          <Image
            src={item.images[0]?.src}
            alt={item.productName}
            fill
            sizes="(max-width:768px) 50vw, (max-width:1280px) 33vw, 25vw"
            className={`object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 `}
            // onLoad={() => setIsImageLoaded(true)}
            loading="lazy"
            placeholder="blur"
            blurDataURL={item.images[0]?.blurDataURL || defaultBlur}
          />
          {/* <div className="absolute top-2 left-2 right-2 flex justify-between gap-2">
            <div className="flex flex-wrap gap-1">
              {item.isNew && (
                <span className="bg-white/80 text-black text-[11px] px-2 py-1 rounded">
                  New
                </span>
              )}
              {item.isLimited && (
                <span className="bg-gray-200 text-black text-[11px] px-2 py-1 rounded">
                  Limited
                </span>
              )}
            </div>

            {item.discount && (
              <div className="flex justify-between gap-1">
                <span className="bg-black hidden lg:inline-block  text-white text-[11px] px-2 py-1 rounded">
                  Sale
                </span>
                <span className="bg-red-600 text-white  h-fit text-[11px] px-2 py-1 rounded">
                  {item.discount}%{" "}
                  <span className="hidden lg:inline-block">OFF</span>
                </span>
              </div>
            )}
          </div> */}
          {item.isNew && (
            <div className="bg-white absolute top-0 mx-[8px] mt-[8px] sm:py-[7px] sm:px-[10px] py-[6px] px-[6px] ">
              <h1 className="uppercase text-black text-[12px] leading-[1.25em] font-normal ">
                New
              </h1>
            </div>
          )}

          {item.salePrice && (
            <div
              className={`bg-black absolute top-0 mx-[8px] mt-[8px] sm:py-[7px] sm:px-[10px] py-[6px] px-[6px] ${item.isNew ? "top-[36px]" : ""
                } `}
            >
              <h1 className="uppercase text-white text-[12px] leading-[1.25em] font-normal ">
                sale
              </h1>
            </div>
          )}
          {item.discount && (
            <div className="bg-[#c32929] absolute left-auto !right-0 top-0 flex flex-col  mx-[8px] mt-[8px] sm:py-[7px] sm:px-[10px] py-[6px] px-[6px] ">
              <h1 className="uppercase text-white text-[12px] leading-[1.25em] font-normal ">
                {item.discount + "% off"}
              </h1>
            </div>
          )}

          {/* Hover Actions (Desktop only) */}
          {!isMobileOrTablet && (
            <CardHover isHovered={isHovered} product={item} />
          )}
        </div>

        {/* Content Section */}
        <div className="p-3 flex flex-col gap-2">
          <p className="text-sm text-gray-700 line-clamp-1">
            {item.productName}
          </p>
          <p className="font-semibold text-lg">PKR {formatPrice(item.salePrice)}</p>

          {/* Colors */}
          {/* <div className="flex items-center gap-2">
            {item.options?.[1]?.values?.map((color, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  handleColorSelect(color);
                }}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${selectedColor === color ? "border-black" : "border-transparent"}`}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
              </button>
            ))}
          </div> */}

          {/* Wishlist + Add to Cart (Mobile only) */}
          {isMobileOrTablet && (
            <div className="flex items-center justify-between mt-2">
              <button
                onClick={
                  isTrue ? handleRemoveFromWishlist : handleAddToWishlist
                }
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                {isTrue ? (
                  <FiHeart size={20} fill="red" stroke="red" />
                ) : (
                  <FiHeart size={20} />
                )}
              </button>
              <button
                onClick={(e) => handleAddToCart(e, item?.isVariant as boolean)}
                className="flex-1 ml-2 flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg 
                           hover:bg-gray-800 transition-colors justify-center"
              >
                <ShoppingCart size={18} />{" "}
                <span className="hidden md:inline-block">Add to cart</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default memo(MainCard);
