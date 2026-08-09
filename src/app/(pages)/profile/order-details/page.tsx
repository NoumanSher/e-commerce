import React from "react";
import OrderDetailsPageClient from "./OrderDetailsPageClient";
import AquaMistOrderDetailsPage from "@/themes/aquamist/(pages)/profile/order-details/page";
import { resolveActiveTheme } from "@/utils/theme";

/**
 * Order Details page entrypoint.
 *
 * Resolves activeTheme and delegates rendering to AquaMistOrderDetailsPage
 * or the default OrderDetailsPageClient.
 */
export default async function OrderDetailsPage() {
  const activeTheme = await resolveActiveTheme();

  if (activeTheme === "aquamist") {
    return <AquaMistOrderDetailsPage />;
  }

  return <OrderDetailsPageClient />;
}
