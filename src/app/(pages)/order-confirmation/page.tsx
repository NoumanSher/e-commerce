import React from "react";
import type { Metadata } from "next";
import AquaMistOrderConfirmationPage from "@/themes/aquamist/(pages)/order-confirmation/page";
import { resolveActiveTheme } from "@/utils/theme";

export const metadata: Metadata = {
  title: "Order Confirmed — HumidAura",
  description:
    "Thank you for your order! Your HumidAura purchase has been completed and is being processed.",
};

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
