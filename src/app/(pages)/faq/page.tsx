import React from "react";
import type { Metadata } from "next";
import { resolveActiveTheme } from "@/utils/theme";
import AquaMistFaqPage from "@/themes/aquamist/(pages)/faq/page";
import FAQ from "@/components/FAQ";
import { getLandingMetadata } from "@/app/utils/metadata/landingMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return getLandingMetadata("Frequently Asked Questions");
}

export default async function FaqRoutePage() {
  const activeTheme = await resolveActiveTheme();

  if (activeTheme === "aquamist") {
    return <AquaMistFaqPage />;
  }

  // Default / Base theme FAQ page
  return (
    <div className="min-h-screen bg-gray-50 pt-[100px] pb-12">
      <FAQ />
    </div>
  );
}
