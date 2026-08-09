import React from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AquaMistCollectionsPage from "@/themes/aquamist/(pages)/collections/page";
import { resolveActiveTheme } from "@/utils/theme";
import { getLandingMetadata } from "@/app/utils/metadata/landingMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return getLandingMetadata("Collections");
}

export default async function CollectionsRoutePage() {
  const activeTheme = await resolveActiveTheme();

  if (activeTheme === "aquamist") {
    return <AquaMistCollectionsPage />;
  }

  // Fallback to the standard e-commerce products catalog if not using aquamist
  redirect("/all-products");
}
