import React from "react";
import OrderHistoryPageClient from "./OrderHistoryPageClient";
import AquaMistOrderHistoryPage from "@/themes/aquamist/(pages)/profile/order-history/page";
import { resolveActiveTheme } from "@/utils/theme";

/**
 * Order History page entrypoint.
 *
 * Resolves activeTheme and delegates rendering to AquaMistOrderHistoryPage
 * or the default OrderHistoryPageClient.
 */
export default async function OrderHistoryPage() {
  const activeTheme = await resolveActiveTheme();

  if (activeTheme === "aquamist") {
    return <AquaMistOrderHistoryPage />;
  }

  return <OrderHistoryPageClient />;
}
