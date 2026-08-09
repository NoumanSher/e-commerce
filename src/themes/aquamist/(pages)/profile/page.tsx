import React from "react";
import type { Metadata } from "next";
import AquaMistProfileOverviewContent from "@/themes/aquamist/components/ProfileOverviewContent";

export const metadata: Metadata = {
  title: "My Account — HumidAura",
  description: "Manage your profile, addresses and view your recent orders.",
};

export default function AquaMistProfilePage() {
  return <AquaMistProfileOverviewContent />;
}
