import React, { Suspense } from "react";
import type { Metadata } from "next";
import AquaMistOrderConfirmationContent from "@/themes/aquamist/components/OrderConfirmationContent";

export const metadata: Metadata = {
  title: "Order Confirmed — HumidAura",
  description:
    "Thank you for your order! Your HumidAura purchase has been completed and is being processed.",
};

export default function AquaMistOrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-aq-on-surface-variant font-inter">Loading order details…</div>}>
      <AquaMistOrderConfirmationContent />
    </Suspense>
  );
}
