import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";

interface FirstOrderDiscountResponse {
  eligible: boolean;
  discountPercent: number;
}

/**
 * Checks whether the currently logged-in user is eligible for
 * the first-order 5% discount.
 *
 * Returns:
 *  - isEligible: boolean
 *  - discountPercent: number (5 or 0)
 *  - discountAmount: number (computed from subTotal)
 *  - isLoading: boolean
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
  const discountPercent = data?.discountPercent ?? 0;
  const discountAmount = isEligible
    ? Math.round(activeSubTotal * (discountPercent / 100))
    : 0;

  return { isEligible, discountPercent, discountAmount, isLoading };
};
