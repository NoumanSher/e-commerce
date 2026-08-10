import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";

export interface FirstOrderPromoConfig {
  enabled: boolean;
  discountType: "percentage" | "fixed";
  discountValue: number;
  title?: string;
  subtitle?: string;
  startDate?: string | null;
  endDate?: string | null;
}

interface FirstOrderDiscountResponse {
  eligible: boolean;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  discountPercent?: number;
  timeRemainingText?: string;
  config?: FirstOrderPromoConfig;
}

/**
 * Checks whether the currently logged-in user is eligible for
 * the first-order discount configured by the merchant.
 */
export const useFirstOrderDiscount = (customSubTotal?: number) => {
  const { userId, authToken } = useAuth();
  const { subTotal: cartSubTotal } = useCart();

  const activeSubTotal = customSubTotal !== undefined ? customSubTotal : cartSubTotal;

  const { data, isLoading } = useQuery<FirstOrderDiscountResponse>({
    queryKey: ["firstOrderDiscount", userId],
    queryFn: () =>
      get<FirstOrderDiscountResponse>(`/auth/first-order-discount/${userId}`),
    enabled: !!userId && !!authToken,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  const isEligible = data?.eligible ?? false;
  const discountType = data?.discountType || "percentage";
  const discountValue = data?.discountValue ?? data?.discountPercent ?? 0;
  const discountPercent = discountType === "percentage" ? discountValue : 0;
  const timeRemainingText = data?.timeRemainingText || "";

  let discountAmount = 0;
  if (isEligible) {
    if (discountType === "fixed") {
      discountAmount = Math.min(activeSubTotal, discountValue);
    } else {
      discountAmount = Math.round(activeSubTotal * (discountValue / 100));
    }
  }

  return {
    isEligible,
    discountType,
    discountValue,
    discountPercent,
    discountAmount,
    timeRemainingText,
    config: data?.config,
    isLoading,
  };
};
