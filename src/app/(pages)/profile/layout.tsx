// layout.tsx
import React from "react";
import Sidebar from "./components/Sidebar";
import { resolveActiveTheme } from "@/utils/theme";
import AquaMistProfileLayout from "@/themes/aquamist/components/ProfileLayout";

/**
 * Profile Layout.
 *
 * Delegates to the AquaMist theme-specific layout when the merchant
 * has selected "aquamist" in store settings. Falls back to the default
 * sidebar layout for all other themes.
 *
 * Theme priority:
 *  1. Database store settings `theme` field  (merchant panel selection)
 *  2. NEXT_PUBLIC_ACTIVE_THEME env var        (developer override)
 *  3. "default"                               (base theme)
 */
const ProfileLayout = async ({ children }: { children: React.ReactNode }) => {
  const activeTheme = await resolveActiveTheme();

  if (activeTheme === "aquamist") {
    return (
      <AquaMistProfileLayout>{children}</AquaMistProfileLayout>
    );
  }

  // Default theme layout
  return (
    <div className="flex flex-col lg:flex-row container mx-auto py-5">
      <Sidebar />
      <main className="lg:w-[80%] px-4 lg:bg-gray-50 rounded-e-lg">
        {children}
      </main>
    </div>
  );
};

export default ProfileLayout;
