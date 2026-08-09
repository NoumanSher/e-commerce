"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import { useCategoriesQuery, useProductsQuery } from "@/hooks/useProductsQuery";
import type { Product } from "@/components/productDetail/productDetailDto";
import CategorySlider from "@/components/CategorySlider/CategorySlider";

// Resilient mock products in case database is empty or loading
const MOCK_PRODUCTS: Partial<Product>[] = [
  {
    _id: "aura-obsidian",
    productName: "Aura Obsidian",
    description: "Ultra-quiet ultrasonic diffusion with 12-hour continuous misting capacity.",
    salePrice: 149,
    discount: 0,
    images: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_229ABYm8CCqdF2qScfH8Rr-FTPV4fXRIYsfZQv_gi7kt5CQZV7JpReGnVYlF0Rllsb-tmJAURPWCIRfJqCwnBUtxIdaAyScxB0-nbug7M6_TcHXemdNA27t2kUVewHaz8suB_9GM2owDP5zcO-6JJgZfjTsflHaIRp1lQ5EPL-cSSuhIrKksenYxfyvFSKk41RE5FBwtRBqfCl651pu2qBHowv3RpRmU67g7cGrYJ6H0jgfYXB6jtRnrRJN1mNsc_WO3GTcUOlw",
        alt: "Matte black cylindrical humidifier emitting cool teal mist",
        blurDataURL: "",
        isThumbnail: true,
        _id: "img-1",
      },
    ],
    seo: { slug: "aura-obsidian", metaTitle: "Aura Obsidian", metaDescription: "", metaKeywords: [] },
    parentCategoryName: "Bedroom",
    isNew: false,
    isLimited: false,
    options: [],
    variants: [],
  },
  {
    _id: "strato-tower",
    productName: "Strato Tower",
    description: "High-capacity evaporative humidification for spaces up to 800 sq ft.",
    salePrice: 289,
    discount: 0,
    images: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgpXYHmdBqMSH4GZP0jf_2n4FQZ6VrocxcTuu8NjZH4gFw6azgipVWd26DrD-V8ypkVYBOJZT0L1ECFwZPsv3TxeZRnbTe4nVxVfUl-faNtFGQgHDgMj6mU378QWFZYRbhbim9D-f8y2aqDc9mHx6BniKzHsFqmPxPkRSXfoeYlR2U_xoyW7wv3Ys5AkaaAO24QWzk_kANpEz7mkJQDYhkZJO4zrG9bMGqAT3inJofTGXQz-jCOMVPfBQtA9obc_bm95ZR1mbO9jw",
        alt: "Tall brushed silver and frosted glass humidifier with teal backlighting",
        blurDataURL: "",
        isThumbnail: true,
        _id: "img-2",
      },
    ],
    seo: { slug: "strato-tower", metaTitle: "Strato Tower", metaDescription: "", metaKeywords: [] },
    parentCategoryName: "Living Room",
    isNew: true,
    isLimited: false,
    options: [],
    variants: [],
  },
  {
    _id: "zenith-pebble",
    productName: "Zenith Pebble",
    description: "Personal hydration zone creator with USB-C power and mood lighting.",
    salePrice: 89,
    discount: 0,
    images: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWLGDwrC1sZhgBrosty3pCdkmBLo_8x86fBmaj1tV2ezpTXRpoo_1ccy0HoNUDqCcmccfYX5r8S9lK90cn4PqMGCacdS42OPYsbj9IIoPlXKSN7fIOlQroOH5-VsUnBgek-9FJng9-cPVocItuvH1Lv69U2YGV9xLX19NUZ-Yx3tED02OEgVjBHeJbKPU86yleNPKEr8usK805gF2rwwrKHBieMIUu9bJ6JXGyUrXkyaGUQ_nhe2ytAhLJ1r6JpIUW3DIS_jG3TNI",
        alt: "Compact pebble-shaped matte stone gray desktop humidifier",
        blurDataURL: "",
        isThumbnail: true,
        _id: "img-3",
      },
    ],
    seo: { slug: "zenith-pebble", metaTitle: "Zenith Pebble", metaDescription: "", metaKeywords: [] },
    parentCategoryName: "Office",
    isNew: false,
    isLimited: false,
    options: [],
    variants: [],
  },
  {
    _id: "aqua-clarity",
    productName: "Aqua Clarity",
    description: "Visible water reservoir with ambient base lighting and essential oil tray.",
    salePrice: 129,
    discount: 0,
    images: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAILu-zLyS-E2p1ttDV-_7znjQiNOXOE8u82YZM8g07r6vQKC2yD05-50rExyLL8OzsxdnkadBLjPe4FqTQKQwQKXYxUJ7LTsD_cHvlc5LBe8sOanE7KfvMenBratANasq4heC6BG72vEIIc5hj_jtLjTCb49616zMVNZGJrcol-HBGjmkL5CUpoAR2kCKMAJ-gyYfOMHhVLISv9EhlpwhCze4Vdral1CLZcq9xNFSEZWp9xGp5eF65XtAYScAY_TdwMMir6py_nkU",
        alt: "Transparent glass reservoir humidifier with glowing teal base",
        blurDataURL: "",
        isThumbnail: true,
        _id: "img-4",
      },
    ],
    seo: { slug: "aqua-clarity", metaTitle: "Aqua Clarity", metaDescription: "", metaKeywords: [] },
    parentCategoryName: "Bedroom",
    isNew: false,
    isLimited: false,
    options: [],
    variants: [],
  },
  {
    _id: "nimbus-connect",
    productName: "Nimbus Connect",
    description: "App-controlled humidity management with integrated air quality sensors.",
    salePrice: 219,
    discount: 0,
    images: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB41A-1_c2uRzS3lnWLHydeDiufluj82D6ivnItsb5BUZlchDAOdgad-xb-F85rGtkTR-B-IOovJ1Jn0wk_Wk2iNV74WdoM9HdU-HEPwaik7wgMly_SqvZdlsPeLEbulVzFY3pRDJ7Ay5tGMXKhtVESuaBwh4AIiN1xRZMBBBqiWCqTO_fbb_x5bLNEy3efkutJdtIMtGOeiqWyHBq_TqesefVGriNCWRjp1oavCL6j4RB_dWNoeF21-nYMQrMbrbwMDm-gmuokBU4",
        alt: "Futuristic geometric humidifier with integrated digital display",
        blurDataURL: "",
        isThumbnail: true,
        _id: "img-5",
      },
    ],
    seo: { slug: "nimbus-connect", metaTitle: "Nimbus Connect", metaDescription: "", metaKeywords: [] },
    parentCategoryName: "Smart Series",
    isNew: false,
    isLimited: true,
    options: [],
    variants: [],
  },
  {
    _id: "monolith",
    productName: "Monolith",
    description: "Architectural statement piece delivering massive moisture output for open plans.",
    salePrice: 450,
    discount: 0,
    images: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDuRke00fAbsEcwttAdyLsCr3_K7UqUcwzNQWhBO-X-daj7iHFunoj6KMFxU439NZCB6rPpeiGKLcu0dvUGPc-ZlMUwxiz9o9jU30_t11SNsXtMmMDx8tHcry2OAE7ZzVWz5NxYus3hmSuFQ2oCH0L5QYK3-mUCXJOrV73ag97mS7oP8npHh_dREPuKtYhUdG1J2qkWOyxDAvF1v063P30G0ysfs80lLtU7YT1CtgD6ZZ5rEV4p6LDdquQdeq1OwIqjF50nY4P2lA",
        alt: "Floor-standing sculptural midnight blue humidifier",
        blurDataURL: "",
        isThumbnail: true,
        _id: "img-6",
      },
    ],
    seo: { slug: "monolith", metaTitle: "Monolith", metaDescription: "", metaKeywords: [] },
    parentCategoryName: "Large Spaces",
    isNew: false,
    isLimited: false,
    options: [],
    variants: [],
  },
];

const ITEMS_PER_PAGE = 6;

export default function AquaMistCollectionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("parentCategorySlug") || "All";
  const [activeFilter, setActiveFilter] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const productGridRef = useRef<HTMLDivElement>(null);

  // Scroll back to product grid top whenever page changes
  useEffect(() => {
    if (productGridRef.current) {
      productGridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  // Sync filter when the URL query changes (e.g. footer nav → category)
  useEffect(() => {
    const slug = searchParams.get("parentCategorySlug") || "All";
    setActiveFilter(slug);
    setPage(1);
  }, [searchParams]);

  // Fetch parent categories dynamically — only active ones
  const { data: categoriesResponse } = useCategoriesQuery();
  const categories = useMemo(
    () => (categoriesResponse?.categories || []).filter((c) => c.isActive !== false),
    [categoriesResponse]
  );

  // Dynamically generate filter tabs
  const FILTER_TABS = useMemo(() => {
    return [
      { label: "All", slug: "All" },
      ...categories.map((c) => ({ label: c.name, slug: c.slug })),
    ];
  }, [categories]);

  // Fetch dynamic products based on active category and page
  const { data: productsResponse, isLoading } = useProductsQuery({
    categorySlug: activeFilter === "All" ? undefined : activeFilter,
    page,
    limit: ITEMS_PER_PAGE,
    mode: "client",
  });

  // Calculate pages
  const totalProducts = productsResponse?.pagination?.totalProducts ?? 0;
  const apiTotalPages = productsResponse?.pagination?.totalPages ?? 1;

  // Use live data if present, otherwise fall back to mock data
  const hasApiProducts = productsResponse?.data && productsResponse.data.length > 0;
  
  const displayProducts = useMemo(() => {
    if (hasApiProducts) {
      return productsResponse.data;
    }
    // Client-side filtering & paging for mock data
    const filteredMock = activeFilter === "All"
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => p.parentCategoryName === activeFilter);
    
    return filteredMock.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE) as Product[];
  }, [hasApiProducts, productsResponse?.data, activeFilter, page]);

  const totalPages = useMemo(() => {
    if (hasApiProducts) return apiTotalPages;
    const filteredMock = activeFilter === "All"
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => p.parentCategoryName === activeFilter);
    return Math.ceil(filteredMock.length / ITEMS_PER_PAGE) || 1;
  }, [hasApiProducts, apiTotalPages, activeFilter]);

  const handleFilterChange = (slug: string) => {
    setActiveFilter(slug);
    setPage(1);
    // Keep URL in sync so the filter is shareable and back-nav works
    if (slug === "All") {
      router.push("/collections", { scroll: false });
    } else {
      router.push(`/collections?parentCategorySlug=${slug}`, { scroll: false });
    }
  };

  return (
    <main className="flex-grow pt-[120px] pb-12 px-5 md:px-20 max-w-[1280px] mx-auto w-full">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <header className="text-center mb-12">
        <span className="inline-block font-inter text-[14px] font-semibold tracking-[0.2em] text-aq-primary mb-3 uppercase">
          Explore
        </span>
        <h1 className="font-eb-garamond text-[40px] md:text-[48px] leading-[48px] md:leading-[56px] text-aq-on-surface mb-3">
          Our Collections
        </h1>
      </header>

      {/* ── Category Slider Carousel ────────────────────────────────────────── */}
      <div className="mb-8">
        <CategorySlider
          theme="aquamist"
          onSelectCategory={handleFilterChange}
          title=""
        />
        {activeFilter !== "All" && (
          <div className="flex justify-center mt-2">
            <button
              onClick={() => handleFilterChange("All")}
              className="text-xs font-semibold uppercase tracking-wider text-sky-400 hover:text-sky-300 underline underline-offset-4 transition-colors"
            >
              Clear Filter (Show All Products)
            </button>
          </div>
        )}
      </div>

      {/* ── Product Grid ─────────────────────────────────────────────────── */}
      <div ref={productGridRef} className="scroll-mt-32" />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aquamist-loader-card aspect-[3/4] rounded-[20px] bg-white/5 border border-white/10 animate-pulse"
            />
          ))}
        </div>
      ) : displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 animate-fadeIn">
          {displayProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-white/10 rounded-[20px] bg-white/3 backdrop-blur-md max-w-lg mx-auto">
          <span className="material-symbols-outlined text-6xl text-aq-on-surface-variant mb-4 block">
            inventory_2
          </span>
          <p className="font-inter text-aq-on-surface-variant font-medium">
            No products in this category yet.
          </p>
        </div>
      )}

      {/* ── Pagination ───────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="aq-glass-panel rounded-full px-4 py-2 flex items-center gap-4 border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-aq-on-surface/50 hover:text-aq-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center p-1"
              aria-label="Previous page"
            >
              <span className="material-symbols-outlined text-xl">
                chevron_left
              </span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={[
                  "w-8 h-8 rounded-full font-inter text-sm font-semibold flex items-center justify-center transition-all duration-300",
                  n === page
                    ? "bg-aq-primary text-aq-on-primary shadow-[0_0_10px_rgba(56,189,248,0.25)]"
                    : "text-aq-on-surface hover:text-aq-primary hover:bg-white/5",
                ].join(" ")}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-aq-on-surface/50 hover:text-aq-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center p-1"
              aria-label="Next page"
            >
              <span className="material-symbols-outlined text-xl">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
