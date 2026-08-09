import React from "react";
import type { Metadata } from "next";
import AquaMistCheckoutPage from "@/themes/aquamist/(pages)/checkout/page";
import { resolveActiveTheme } from "@/utils/theme";

export const metadata: Metadata = {
  title: "Secure Checkout — HumidAura",
  description:
    "Complete your order securely. Enter your shipping and payment details to finalise your HumidAura purchase.",
};

/**
 * Root checkout route delegate.
 *
 * Checks the active theme env var and renders the appropriate
 * theme-specific checkout implementation. Falls back to the
 * standard storefront checkout for other themes.
 */
export default async function CheckoutRoutePage() {
  const activeTheme = await resolveActiveTheme();

  if (activeTheme === "aquamist") {
    return <AquaMistCheckoutPage />;
  }

  // Default theme: lazy-import the standard checkout screen
  const DefaultCheckout = require("@/components/screen/checkout").default;
  return <DefaultCheckout />;
}
