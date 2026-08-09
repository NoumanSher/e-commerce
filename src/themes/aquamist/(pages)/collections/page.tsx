import React, { Suspense } from "react";
import type { Metadata } from "next";
import AquaMistCollectionsContent from "@/themes/aquamist/components/CollectionsContent";

export const metadata: Metadata = {
  title: "Collections — HumidAura",
  description:
    "Find the perfect mist for every room. Explore our curated selection of premium ultrasonic humidifiers.",
};

export default function AquaMistCollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0F1E]" />}>
      <AquaMistCollectionsContent />
    </Suspense>
  );
}
