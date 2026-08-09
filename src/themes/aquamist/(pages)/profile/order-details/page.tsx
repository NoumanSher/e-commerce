import React from "react";
import type { Metadata } from "next";
import AquaMistProfileOrderDetailsContent from "@/themes/aquamist/components/ProfileOrderDetailsContent";

export const metadata: Metadata = {
  title: "Order Details — HumidAura",
  description: "View your order tracking status and detailed purchase summary.",
};

export default function AquaMistOrderDetailsPage() {
  return <AquaMistProfileOrderDetailsContent />;
}
