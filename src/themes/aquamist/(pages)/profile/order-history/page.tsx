import React from "react";
import type { Metadata } from "next";
import AquaMistProfileOrderHistoryContent from "@/themes/aquamist/components/ProfileOrderHistoryContent";

export const metadata: Metadata = {
  title: "Order History — HumidAura",
  description: "View your complete order history and track your past purchases.",
};

export default function AquaMistOrderHistoryPage() {
  return <AquaMistProfileOrderHistoryContent />;
}
