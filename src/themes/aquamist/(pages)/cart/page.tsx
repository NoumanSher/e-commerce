import React from "react";
import type { Metadata } from "next";
import AquaMistCartContent from "@/themes/aquamist/components/CartContent";

export const metadata: Metadata = {
  title: "Your Cart — HumidAura",
  description:
    "Review your selected HumidAura humidifiers and accessories before proceeding to checkout.",
};

/**
 * AquaMist Cart page route.
 *
 * Thin server-component wrapper that renders the interactive
 * client component for the cart screen.
 */
export default function AquaMistCartPage() {
  return <AquaMistCartContent />;
}
