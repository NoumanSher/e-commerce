"use client";
import React, { useCallback, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import BillingDetailsComponent from "@/components/BillingDetails";
import OrderSummaryComponent from "@/components/OrderSummary";
import PaymentMethodComponent from "@/components/PaymentMethod";
import { useStore } from "@/context/storeContext";
import { useAuth } from "@/context/AuthContext";
import { useOrderCreate } from "./query/orderCreateQuery";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/components/hooks/useCart";
import { toast } from "react-toastify";
import PreviousAddressComponent from "@/components/previousAddress/PreviousAddressComponent";
import { useInvalidateProductQueries } from "@/hooks/useInvalidateProductQueries";
import { AuthModal } from "@/components/AuthModal";
import { calculateDiscountedPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const checkoutSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  streetAddress: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutProps {
  checkValidation: () => void;
}

export default function Checkout({ checkValidation }: CheckoutProps) {
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  const router = useRouter();
  const { productDetail, cartItems, setIsAuthModalOpen } =
    useStore();
  const { userId, authToken } = useAuth();
  const { mutate, isSuccess, isPending, data } = useOrderCreate();
  const { subTotal } = useCart();

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
      paymentMethod: "cash",
    },
  });

  const { handleSubmit, setValue } = methods;

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

  useInvalidateProductQueries(
    isSuccess,
    section,
    data?.data.orderNo,
    checkValidation
  );

  const createOrderPayload = useCallback(
    (values: CheckoutFormValues) => {
      const { paymentMethod, ...rest } = values;
      const commonData = {
        userId,
        address: rest,
        isSaved: true,
        paymentMethod: paymentMethod as "cash",
      };

      if (section === "checkout") {
        return {
          ...commonData,
          deliveryFee: productDetail?.deliveryFee ?? 0,
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
          totalPrice: productDetail?.totalPrice ?? 0,
          subTotal: productDetail?.subTotal ?? 0,
        };
      }

      return {
        ...commonData,
        items: cartMappedItems,
        totalPrice: subTotal,
        subTotal: subTotal,
        deliveryFee: 0,
      };
    },
    [section, productDetail, cartMappedItems, subTotal, userId]
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

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className=" flex lg:flex-row flex-col gap-x-4 "
        >
          <div className="lg:w-[70%] w-full">
            <PreviousAddressComponent
              userId={userId}
              onSelect={(prevAddress) => {
                if (prevAddress) {
                  setValue("firstName", prevAddress.firstName);
                  setValue("lastName", prevAddress.lastName);
                  setValue("streetAddress", prevAddress.streetAddress);
                  setValue("city", prevAddress.city);
                  setValue("zipCode", prevAddress.zipCode);
                  setValue("phone", prevAddress.phone);
                  setValue("email", prevAddress.email);
                } else {
                  setValue("firstName", "");
                  setValue("lastName", "");
                  setValue("streetAddress", "");
                  setValue("city", "");
                  setValue("zipCode", "");
                  setValue("phone", "");
                  setValue("email", "");
                }
              }}
            />
            <BillingDetailsComponent />
          </div>
          <div className="lg:w-[30%] w-full">
            <OrderSummaryComponent />
            <PaymentMethodComponent />

            <Button
              id="pobtn"
              type="submit"
              loading={isPending}
              className="sticky bottom-0 w-full bg-black text-white mt-4 lg:h-14 h-10 disabled:opacity-50 rounded-none shadow-none uppercase font-semibold"
            >
              Place Order
            </Button>
          </div>
        </form>
      </FormProvider>
      <AuthModal from="checkout" />
    </>
  );
}
// This code is a React component for a checkout screen that uses Formik for form handling and Yup for validation.
