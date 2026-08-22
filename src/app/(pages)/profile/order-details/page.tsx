import React from "react";
import type { Metadata } from "next";
import OrderDetailsPageClient from "./OrderDetailsPageClient";
import AquaMistOrderDetailsPage from "@/themes/aquamist/(pages)/profile/order-details/page";
import { resolveActiveTheme } from "@/utils/theme";
import { getLandingMetadata } from "@/app/utils/metadata/landingMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getLandingMetadata("Order Details");
  return { ...base, robots: { index: false, follow: true } };
}



/**
 * Order Details page entrypoint.
 *
 * Resolves activeTheme and delegates rendering to AquaMistOrderDetailsPage
 * or the default OrderDetailsPageClient.
 */
export default async function OrderDetailsPage() {
  const activeTheme = await resolveActiveTheme();

  if (activeTheme === "aquamist") {
    return <AquaMistOrderDetailsPage />;
  }

  return <OrderDetailsPageClient />;
}
