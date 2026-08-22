import React from "react";
import type { Metadata } from "next";
import OrderHistoryPageClient from "./OrderHistoryPageClient";
import AquaMistOrderHistoryPage from "@/themes/aquamist/(pages)/profile/order-history/page";
import { resolveActiveTheme } from "@/utils/theme";
import { getLandingMetadata } from "@/app/utils/metadata/landingMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getLandingMetadata("Order History");
  return { ...base, robots: { index: false, follow: true } };
}



/**
 * Order History page entrypoint.
 *
 * Resolves activeTheme and delegates rendering to AquaMistOrderHistoryPage
 * or the default OrderHistoryPageClient.
 */
export default async function OrderHistoryPage() {
  const activeTheme = await resolveActiveTheme();

  if (activeTheme === "aquamist") {
    return <AquaMistOrderHistoryPage />;
  }

  return <OrderHistoryPageClient />;
}
