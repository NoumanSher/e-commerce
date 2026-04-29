"use client";
import React from "react";
import { FormProvider } from "react-hook-form";
import BillingDetailsComponent from "@/components/BillingDetails";
import OrderSummaryComponent from "@/components/OrderSummary";
import PaymentMethodComponent from "@/components/PaymentMethod";
import PreviousAddressComponent from "@/components/PreviousAddress/PreviousAddressComponent";
import { useInvalidateProductQueries } from "@/hooks/useInvalidateProductQueries";
import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { useCheckoutViewModel } from "@/hooks/useCheckoutViewModel";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

interface CheckoutProps {
  checkValidation: () => void;
}

export default function Checkout({ checkValidation }: CheckoutProps) {
  const {
    methods,
    onFormSubmit,
    isPending,
    isSuccess,
    section,
    orderNo,
    userId,
  } = useCheckoutViewModel(checkValidation);

  const { handleSubmit, setValue } = methods;

  useInvalidateProductQueries(
    isSuccess,
    section,
    orderNo,
    checkValidation
  );

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
// This code is a React component for a checkout screen that uses Formik for form handling and Yup for validation.
