"use client";

import { useState, useMemo } from "react";
import { useGetStoreSettings } from "@/components/Slider/query/storeSettingQuery";
import { useCategoriesQuery } from "@/hooks/useProductsQuery";
import { subscribeNewsletter } from "@/services/newsletterService";

export const MAX_FOOTER_CATEGORIES = 6;
export const MAX_FOOTER_LINKS = 6;

export interface FooterLinkItem {
  name: string;
  url: string;
}

export interface FooterSocialLink {
  platform: "facebook" | "instagram" | "pinterest" | "twitter" | "youtube";
  url: string;
  label: string;
}

export interface NormalizedFooterData {
  storeInfo: {
    name: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    logo?: string;
    socialLinks: FooterSocialLink[];
  };
  categories: {
    title: string;
    items: Array<{
      id: string;
      name: string;
      slug: string;
      href: string;
    }>;
  };
  navigation: {
    title: string;
    items: FooterLinkItem[];
  };
  newsletter: {
    email: string;
    setEmail: (value: string) => void;
    subscribed: boolean;
    loading: boolean;
    errorMsg: string;
    handleSubscribe: (e: React.FormEvent) => Promise<void>;
  };
  bottom: {
    copyright: string;
    privacyPolicy: { label: string; href: string };
    termsOfService: { label: string; href: string };
  };
}

const DEFAULT_FOOTER_LINKS: FooterLinkItem[] = [
  { name: "FAQ", url: "/faq" },
  { name: "Contact Us", url: "/contact-us" },
  { name: "Shipping & Returns", url: "/shipping-and-returns" },
  { name: "Privacy Policy", url: "/privacy-policy" },
  { name: "Terms of Service", url: "/terms-of-service" },
];

export function useFooterData(): NormalizedFooterData {
  const { data: storeSettings } = useGetStoreSettings();
  const { data: categoriesResponse } = useCategoriesQuery();

  // Newsletter state
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setErrorMsg("");
    try {
      await subscribeNewsletter(email.trim());
      setSubscribed(true);
      setEmail("");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Normalized Store Info & Social Links
  const storeInfo = useMemo(() => {
    const rawSocial: Array<FooterSocialLink | null> = [
      storeSettings?.facebookUrl
        ? { platform: "facebook", url: storeSettings.facebookUrl, label: "Facebook" }
        : null,
      storeSettings?.instagramUrl
        ? { platform: "instagram", url: storeSettings.instagramUrl, label: "Instagram" }
        : null,
      storeSettings?.pinterestUrl
        ? { platform: "pinterest", url: storeSettings.pinterestUrl, label: "Pinterest" }
        : null,
      storeSettings?.twitterUrl
        ? { platform: "twitter", url: storeSettings.twitterUrl, label: "Twitter" }
        : null,
      storeSettings?.youtubeUrl
        ? { platform: "youtube", url: storeSettings.youtubeUrl, label: "YouTube" }
        : null,
    ];

    const validSocialLinks = rawSocial.filter(
      (s): s is FooterSocialLink => s !== null && !!s.url && s.url.trim().length > 0
    );

    return {
      name: storeSettings?.title || "Store",
      description:
        storeSettings?.description ||
        "Elevating your atmosphere through innovative design and atmospheric luxury.",
      email: storeSettings?.email || "",
      phone: storeSettings?.mobile || "",
      address: storeSettings?.address || "",
      logo: storeSettings?.logo,
      socialLinks: validSocialLinks,
    };
  }, [storeSettings]);

  // 2. Normalized Categories (Active only, Max 6)
  const categories = useMemo(() => {
    const activeCats = (categoriesResponse?.categories || [])
      .filter((c) => c.isActive !== false)
      .slice(0, MAX_FOOTER_CATEGORIES)
      .map((c) => ({
        id: c._id || c.slug,
        name: c.name,
        slug: c.slug,
        href: `/collections?parentCategorySlug=${c.slug}`,
      }));

    return {
      title: "Categories",
      items:
        activeCats.length > 0
          ? activeCats
          : [
              {
                id: "all-collections",
                name: "All Collections",
                slug: "all",
                href: "/collections",
              },
            ],
    };
  }, [categoriesResponse]);

  // 3. Normalized Footer Navigation (Max 6)
  const navigation = useMemo(() => {
    const section = storeSettings?.footerLinks?.[0];
    const title = section?.title?.trim() || "Customer Support";
    const rawItems = section?.items && section.items.length > 0 ? section.items : DEFAULT_FOOTER_LINKS;

    const items: FooterLinkItem[] = rawItems
      .slice(0, MAX_FOOTER_LINKS)
      .map((item: any) => ({
        name: item.name || "",
        url: item.url || "/",
      }));

    return {
      title,
      items,
    };
  }, [storeSettings]);

  // 4. Bottom bar information
  const currentYear = new Date().getFullYear();
  const bottom = useMemo(
    () => ({
      copyright: `© ${currentYear} ${storeInfo.name}. All rights reserved.`,
      privacyPolicy: { label: "Privacy Policy", href: "/privacy-policy" },
      termsOfService: { label: "Terms of Service", href: "/terms-of-service" },
    }),
    [currentYear, storeInfo.name]
  );

  return {
    storeInfo,
    categories,
    navigation,
    newsletter: {
      email,
      setEmail,
      subscribed,
      loading,
      errorMsg,
      handleSubscribe,
    },
    bottom,
  };
}
