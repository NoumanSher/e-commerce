import React from "react";
import type { Metadata } from "next";
import ProfilePageClient from "./ProfilePageClient";
import AquaMistProfilePage from "@/themes/aquamist/(pages)/profile/page";
import { resolveActiveTheme } from "@/utils/theme";
import { getLandingMetadata } from "@/app/utils/metadata/landingMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const base = await getLandingMetadata("My Account");
  return { ...base, robots: { index: false, follow: true } };
}



/**
 * Profile Page entrypoint.
 *
 * Delegates to theme-specific profile overview if AquaMist is configured,
 * otherwise falls back to the default profile screen client.
 */
export default async function ProfilePage() {
  const activeTheme = await resolveActiveTheme();

  if (activeTheme === "aquamist") {
    return <AquaMistProfilePage />;
  }

  return <ProfilePageClient />;
}
