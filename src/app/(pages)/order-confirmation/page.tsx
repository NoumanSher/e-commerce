import React from "react";
import type { Metadata } from "next";
import AquaMistOrderConfirmationPage from "@/themes/aquamist/(pages)/order-confirmation/page";
import { resolveActiveTheme } from "@/utils/theme";
import { getLandingMetadata } from "@/app/utils/metadata/landingMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getLandingMetadata("Order Confirmed");
  return { ...base, robots: { index: false, follow: true } };
}


/**
 * Root order confirmation route delegate.
 *
 * Checks the active theme env var and renders the theme-specific
 * order confirmation page, or delegates to a default success page.
 */
export default async function OrderConfirmationRoutePage() {
  const activeTheme = await resolveActiveTheme();

  if (activeTheme === "aquamist") {
    return <AquaMistOrderConfirmationPage />;
  }

  // Default theme fallback
  const DefaultOrderConfirmation = require("@/components/OrderConfirmation").default;
  return (
    <div className="w-full py-6 container mx-auto lg:px-16 px-4">
      <DefaultOrderConfirmation />
    </div>
  );
}
