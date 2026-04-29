import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAppUIContext } from "@/context/AppUIContext";
import { useAuth } from "@/context/AuthContext";
import { useSubmitOrder } from "@/hooks/mutations/useOrderMutations";
import { useCart } from "@/hooks/useCart";
import { useFirstOrderDiscount } from "@/hooks/useFirstOrderDiscount";
import { calculateDiscountedPrice } from "@/lib/utils";

import { PaymentMethod } from "@/types";

export const checkoutSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  streetAddress: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    errorMap: () => ({ message: "Please select a valid payment method" }),
  }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function useCheckoutViewModel(checkValidation: () => void) {
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  const { productDetail, setIsAuthModalOpen } = useAppUIContext();
  const { cartItems, subTotal: cartSubTotal } = useCart();
  const { userId, authToken } = useAuth();
  const { mutate, isSuccess, isPending, data } = useSubmitOrder();

  const isBuyNow = section === "checkout";
  const activeSubTotal = isBuyNow
    ? (productDetail?.items[0].price ?? 0) * (productDetail?.items[0].quantity ?? 0)
    : cartSubTotal;

  const { isEligible, discountAmount: computedDiscountAmount } = useFirstOrderDiscount(activeSubTotal);

  const methods = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      streetAddress: "",
      city: "",
      zipCode: "",
      phone: "",
      email: "",
      paymentMethod: PaymentMethod.Cash,
    },
  });

  const cartMappedItems = useMemo(
    () =>
      cartItems.map((item) => {
        const variant = item?.variantID
          ? item.product.variants?.find((v) => v._id === item.variantID)
          : null;
        const additionalSalePrice = variant?.additionalSalePrice || 0;
        const basePrice = item.product.salePrice + additionalSalePrice;
        const discountedPrice = calculateDiscountedPrice(basePrice, item.product.discount || 0);

        return {
          ...(item?.variantID && { variantId: item.variantID }),
          variantName: variant?.name,
          productId: item.product._id,
          price: discountedPrice,
          quantity: item.quantity,
          lineTotal: discountedPrice * item.quantity,
        };
      }),
    [cartItems]
  );

  const createOrderPayload = useCallback(
    (values: CheckoutFormValues) => {
      const { paymentMethod, ...rest } = values;
      const commonData = {
        userId,
        address: rest,
        isSaved: true,
        paymentMethod,
      };

      if (section === "checkout") {
        const rawSubTotal = productDetail?.subTotal ?? 0;
        const rawDelivery = productDetail?.deliveryFee ?? 0;
        const discountAmount = isEligible ? computedDiscountAmount : 0;
        const rawTotal = rawSubTotal + rawDelivery - discountAmount;
        return {
          ...commonData,
          deliveryFee: rawDelivery,
          discountAmount,
          items: [
            {
              ...(productDetail?.items[0]?.variantId && {
                variantId: productDetail.items[0].variantId,
              }),
              productId: productDetail?.items[0].productId ?? "",
              price: productDetail?.items[0].price ?? 0,
              quantity: productDetail?.items[0].quantity ?? 0,
              lineTotal:
                (productDetail?.items[0].price ?? 0) *
                (productDetail?.items[0].quantity ?? 0),
            },
          ],
          totalPrice: rawTotal,
          subTotal: rawSubTotal,
        };
      }

      const discountAmount = isEligible ? computedDiscountAmount : 0;
      return {
        ...commonData,
        items: cartMappedItems,
        totalPrice: cartSubTotal - discountAmount,
        subTotal: cartSubTotal,
        deliveryFee: 0,
        discountAmount,
      };
    },
    [section, productDetail, cartMappedItems, cartSubTotal, userId, isEligible, computedDiscountAmount]
  );

  const onFormSubmit = useCallback(
    (values: CheckoutFormValues) => {
      if (!authToken) {
        toast.error("Please login to place order");
        setIsAuthModalOpen(true);
        return;
      }

      const payload = createOrderPayload(values);
      if (!payload.items.length) {
        toast.error("Your cart is empty");
        return;
      }
      mutate(payload);
    },
    [authToken, createOrderPayload, mutate, setIsAuthModalOpen]
  );

  return {
    methods,
    onFormSubmit,
    isPending,
    isSuccess,
    section,
    orderNo: data?.data.orderNo,
    userId,
  };
}
