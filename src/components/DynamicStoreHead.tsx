"use client";

import { useEffect, useState } from "react";
import { useGetStoreSettings } from "@/components/Slider/query/storeSettingQuery";

export default function DynamicStoreHead() {
  const { data: storeSettings } = useGetStoreSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !storeSettings) return;

    const storeTitle = storeSettings.title;
    const storeLogo = storeSettings.logo;

    // 1. Update Document Title safely (preventing double replace like PakShipperStoreStore)
    if (storeTitle && document.title) {
      if (document.title.includes("PakShipperStore")) {
        document.title = document.title.replace("PakShipperStore", storeTitle);
      } else if (document.title.includes("PakShipper")) {
        document.title = document.title.replace("PakShipper", storeTitle);
      } else if (document.title.includes("HumidAura")) {
        document.title = document.title.replace("HumidAura", storeTitle);
      }
    } else if (storeTitle) {
      document.title = storeTitle;
    }

    // 2. Safely update favicon hrefs without removing nodes from DOM tree
    if (storeLogo) {
      const existingIcons = document.querySelectorAll("link[rel*='icon']");
      if (existingIcons.length > 0) {
        existingIcons.forEach((icon) => {
          (icon as HTMLLinkElement).href = storeLogo;
        });
      } else {
        const link = document.createElement("link");
        link.id = "dynamic-store-favicon";
        link.rel = "icon";
        link.href = storeLogo;
        document.head.appendChild(link);
      }
    }
  }, [mounted, storeSettings]);

  return null;
}
