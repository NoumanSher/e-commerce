import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { getStoreSettingServer } from "@/services/settingsService.server";
import { resolveActiveTheme } from "@/utils/theme";
import RichTextRenderer from "@/components/RichTextRenderer";
import { Award, Heart, Truck, ShieldCheck, Leaf, Star, Clock, Headset, Sparkles, CheckCircle2 } from "lucide-react";

export const revalidate = 60; // Cache for 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  let host = "default";
  try {
    host = headers().get("host") ?? "default";
    const cleanHost = host.split(":")[0].toLowerCase();
    if (cleanHost === "localhost" || cleanHost === "127.0.0.1") {
      host = process.env.NEXT_PUBLIC_DEVELOPMENT_HOST || "sandbox.localhost";
    }
  } catch {}

  const storeSettings = await getStoreSettingServer(host);
  const storeName = storeSettings?.title || "PakShipper";
  return {
    title: `About Us | ${storeName}`,
    description: storeSettings?.aboutUs?.heroSubtitle || storeSettings?.description || "Learn about our story, mission, and values",
  };
}

/** Render vector icon based on preset icon name */
function ValueIcon({ iconName, isAqua }: { iconName?: string; isAqua: boolean }) {
  const colorClass = isAqua ? "w-6 h-6 text-sky-400" : "w-6 h-6 text-blue-600";
  if (!iconName) return <Award className={colorClass} />;
  const name = iconName.toLowerCase().trim();

  if (name.includes("leaf") || name.includes("sustain") || name.includes("eco")) return <Leaf className={colorClass} />;
  if (name.includes("heart") || name.includes("custom") || name.includes("focus")) return <Heart className={colorClass} />;
  if (name.includes("truck") || name.includes("ship") || name.includes("fast")) return <Truck className={colorClass} />;
  if (name.includes("shield") || name.includes("secur")) return <ShieldCheck className={colorClass} />;
  if (name.includes("star") || name.includes("excel")) return <Star className={colorClass} />;
  if (name.includes("clock") || name.includes("time")) return <Clock className={colorClass} />;
  if (name.includes("headset") || name.includes("supp")) return <Headset className={colorClass} />;
  if (name.includes("sparkle") || name.includes("innov")) return <Sparkles className={colorClass} />;
  if (name.includes("check")) return <CheckCircle2 className={colorClass} />;

  return <Award className={colorClass} />;
}

export default async function AboutUsPage() {
  let host = "default";
  try {
    host = headers().get("host") ?? "default";
    const cleanHost = host.split(":")[0].toLowerCase();
    if (cleanHost === "localhost" || cleanHost === "127.0.0.1") {
      host = process.env.NEXT_PUBLIC_DEVELOPMENT_HOST || "sandbox.localhost";
    }
  } catch {}

  const activeTheme = await resolveActiveTheme();
  const isAqua = activeTheme === "aquamist";

  const settings = await getStoreSettingServer(host);
  const aboutUs = settings?.aboutUs;

  const heroTitle = aboutUs?.heroTitle || "Our Story";
  const heroSubtitle = aboutUs?.heroSubtitle || "Crafting exceptional experiences and timeless products.";
  const storyTitle = aboutUs?.storyTitle || "Our Journey";
  const storyContent = aboutUs?.storyContent || "";
  const storyImage = aboutUs?.storyImage || "https://placehold.co/600x400?text=Our+Story";

  // Respect empty array if merchant explicitly saved stats/values as empty []
  const stats = aboutUs?.stats !== undefined ? aboutUs.stats : [
    { number: "10k+", label: "Happy Customers" },
    { number: "99.8%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Customer Support" },
  ];
  const values = aboutUs?.values !== undefined ? aboutUs.values : [
    { title: "Premium Quality", description: "Crafted with meticulously tested materials for long-lasting performance.", icon: "award" },
    { title: "Customer First", description: "Dedicated support team ensuring smooth shopping from order to delivery.", icon: "heart" },
    { title: "Fast Shipping", description: "Express dispatch and tracked delivery across Pakistan.", icon: "truck" },
  ];

  return (
    <div className={`min-h-screen pt-[100px] pb-20 px-4 md:px-8 max-w-6xl mx-auto ${isAqua ? "text-white" : "text-gray-900"}`}>

      {/* ── Hero Banner Section ───────────────────────────────────────── */}
      <div className={`relative rounded-3xl overflow-hidden p-8 sm:p-16 text-center mb-12 shadow-2xl ${
        isAqua 
          ? "bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-slate-900/50 border border-white/10 backdrop-blur-xl text-white" 
          : "bg-gradient-to-r from-slate-900 via-blue-900 to-slate-950 text-white"
      }`}>
        <div className="max-w-3xl mx-auto relative z-10 space-y-4">
          <h1 className="font-eb-garamond text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-md">
            {heroTitle}
          </h1>
          <p className="font-inter text-base sm:text-xl text-white/85 font-light leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </div>

      {/* ── Our Journey / Story Section ────────────────────────────────── */}
      <div className={`rounded-2xl p-6 sm:p-12 mb-12 shadow-xl ${
        isAqua 
          ? "bg-white/5 border border-white/10 backdrop-blur-xl" 
          : "bg-white border border-gray-200/80 shadow-sm"
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h2 className={`font-eb-garamond text-2xl sm:text-3xl font-bold pb-4 ${
              isAqua ? "text-white border-b border-white/10" : "text-gray-900 border-b border-gray-200"
            }`}>
              {storyTitle}
            </h2>
            {storyContent ? (
              <div className="policy-content">
                <RichTextRenderer content={storyContent} className={isAqua ? "text-white/80 leading-relaxed" : "text-gray-700 leading-relaxed"} />
                {isAqua && (
                  <style>{`
                    .policy-content .rich-text *,
                    .policy-content .rich-text p,
                    .policy-content .rich-text span {
                      color: rgba(255, 255, 255, 0.85) !important;
                      background-color: transparent !important;
                    }
                  `}</style>
                )}
              </div>
            ) : (
              <p className={isAqua ? "text-white/80 leading-relaxed text-sm md:text-base" : "text-gray-600 leading-relaxed text-sm md:text-base"}>
                Welcome to {settings?.title || "our store"}. Founded with a passion for quality and craftsmanship, we strive to bring you the finest products backed by exceptional customer service. Every item in our collection is carefully selected to meet our rigorous standards.
              </p>
            )}
          </div>

          <div className={`relative aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-xl ${
            isAqua ? "border border-white/10 bg-white/5" : "border border-gray-200 bg-gray-100"
          }`}>
            <Image
              src={storyImage}
              alt={storyTitle}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* ── Stats Counters Grid ────────────────────────────────────────── */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {stats.map((stat: { number: string; label: string }, i: number) => (
            <div key={i} className={`rounded-2xl p-6 text-center transition-all ${
              isAqua 
                ? "bg-white/5 border border-white/10 backdrop-blur-xl hover:border-white/20" 
                : "bg-white border border-gray-200/80 shadow-sm hover:border-blue-500/30"
            }`}>
              <span className={`font-eb-garamond text-4xl sm:text-5xl font-bold block mb-1 ${
                isAqua ? "text-sky-400" : "text-blue-600"
              }`}>
                {stat.number}
              </span>
              <span className={`font-inter text-xs sm:text-sm uppercase tracking-wider font-medium ${
                isAqua ? "text-white/70" : "text-gray-500"
              }`}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Brand Values Section ──────────────────────────────────────── */}
      {values.length > 0 && (
        <div className={`rounded-2xl p-6 sm:p-12 ${
          isAqua 
            ? "bg-white/5 border border-white/10 backdrop-blur-xl" 
            : "bg-white border border-gray-200/80 shadow-sm"
        }`}>
          <h2 className={`font-eb-garamond text-2xl sm:text-3xl font-bold text-center mb-8 pb-4 ${
            isAqua ? "text-white border-b border-white/10" : "text-gray-900 border-b border-gray-200"
          }`}>
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val: { title: string; description: string; icon?: string }, i: number) => {
              const isCustomImage = val.icon?.startsWith("http") || val.icon?.startsWith("/");

              return (
                <div
                  key={i}
                  className={`space-y-3 p-6 sm:p-8 rounded-2xl transition-all flex flex-col items-center text-center group ${
                    isAqua 
                      ? "bg-white/5 border border-white/10 hover:border-sky-400/30" 
                      : "bg-gray-50 border border-gray-100 hover:border-blue-500/20 shadow-none hover:shadow-md"
                  }`}
                >
                  {/* Icon in Center */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform ${
                    isAqua 
                      ? "bg-sky-400/10 border border-sky-400/20 text-sky-400" 
                      : "bg-blue-50 border border-blue-100 text-blue-600"
                  }`}>
                    {isCustomImage ? (
                      <Image src={val.icon!} alt={val.title} width={28} height={28} className="object-contain" unoptimized />
                    ) : (
                      <ValueIcon iconName={val.icon} isAqua={isAqua} />
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className={`text-lg font-semibold ${isAqua ? "text-white" : "text-gray-900"}`}>
                    {val.title}
                  </h3>
                  <p className={`text-sm leading-relaxed max-w-xs ${isAqua ? "text-white/70" : "text-gray-600"}`}>
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Call to Action ────────────────────────────────────────────── */}
      <div className="mt-16 text-center">
        <Link
          href="/collections"
          className={`inline-block font-medium px-8 py-3.5 rounded-full transition-colors shadow-lg ${
            isAqua 
              ? "bg-sky-400 text-slate-950 hover:bg-sky-300 hover:shadow-sky-400/20" 
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/20"
          }`}
        >
          Explore Our Collection
        </Link>
      </div>

    </div>
  );
}
