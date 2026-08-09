import React from "react";
import ProfilePageClient from "./ProfilePageClient";
import AquaMistProfilePage from "@/themes/aquamist/(pages)/profile/page";
import { resolveActiveTheme } from "@/utils/theme";

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
