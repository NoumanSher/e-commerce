import React, { Suspense } from "react";
import type { Metadata } from "next";
import AquaMistCheckoutContent from "@/themes/aquamist/components/CheckoutContent";
import { AuthModal } from "@/components/AuthModal";

export const metadata: Metadata = {
  title: "Secure Checkout — HumidAura",
  description:
    "Complete your order securely. Enter your shipping and payment details to finalise your HumidAura purchase.",
};

export default function AquaMistCheckoutPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-aq-on-surface-variant font-inter">Loading checkout…</div>}>
      <AquaMistCheckoutContent />
      <AuthModal from="checkout" />
    </Suspense>
  );
}

