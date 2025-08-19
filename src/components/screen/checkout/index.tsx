"use client";
import React, { useCallback, useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import BillingDetailsComponent from "@/components/BillingDetails";
import OrderSummaryComponent from "@/components/OrderSummary";
import PaymentMethodComponent from "@/components/PaymentMethod";
import { useStore } from "@/Context/storeContext";
import { useOrderCreate } from "./query/orderCreateQuery";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/components/hooks/useCart";
import { toast } from "react-toastify";
import PreviousAddressComponent from "@/components/previousAddress/PreviousAddressComponent";
import { useInvalidateProductQueries } from "@/hooks/useInvalidateProductQueries";

const CheckoutSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  streetAddress: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  zipCode: Yup.string().required("ZIP code is required"),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  paymentMethod: Yup.string().required("Please select a payment method"),
});

interface CheckoutProps {
  checkValidation: () => void;
}

export default function Checkout({ checkValidation }: CheckoutProps) {
  // Hooks at top level
  const searchParams = useSearchParams();
  const section = searchParams.get("section");
  const router = useRouter();
  const { productDetail, cartItems, userId, isLogIn } = useStore();
  const { mutate, isSuccess, isPending, data } = useOrderCreate();
  const { subTotal } = useCart();

  // Memoized cart items
  const cartMappedItems = useMemo(
    () =>
      cartItems.map((item) => ({
        ...(item?.variantID && { variantId: item.variantID }),
        productId: item.product._id,
        price: item.product.salePrice,
        quantity: item.quantity,
        lineTotal: item.product.salePrice * item.quantity,
      })),
    [cartItems]
  );

  // Side effect handling
  useInvalidateProductQueries(
    isSuccess,
    section,
    data?.data.orderNo,
    checkValidation
  );

  // Extracted payload creation logic
  const createOrderPayload = useCallback(
    (values: any) => {
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

  // Handle submit with useCallback
  const handleSubmit = useCallback(
    (values: any) => {
      if (!isLogIn) {
        toast.error("Please login to place order");
        const callbackUrl = encodeURIComponent("/cart?section=checkout");
        setTimeout(
          () => router.push(`/login?callbackUrl=${callbackUrl}`),
          3000
        );
        return;
      }

      const payload = createOrderPayload(values);
      mutate(payload);
    },
    [isLogIn, router, createOrderPayload, mutate]
  );

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        streetAddress: "",
        city: "",
        zipCode: "",
        phone: "",
        email: "",
        paymentMethod: "cash",
      }}
      validationSchema={CheckoutSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, ...formik }) => (
        <>
          <Form
            onSubmit={handleSubmit}
            className=" flex lg:flex-row flex-col gap-x-4 "
          >
            <div className="lg:w-[70%] w-full">
              <PreviousAddressComponent
                userId={userId}
                onSelect={(prevAddress) => {
                  formik.setValues({
                    ...formik.values,
                    ...(prevAddress
                      ? {
                          firstName: prevAddress.firstName,
                          lastName: prevAddress.lastName,
                          streetAddress: prevAddress.streetAddress,
                          city: prevAddress.city,
                          zipCode: prevAddress.zipCode,
                          phone: prevAddress.phone,
                          email: prevAddress.email,
                        }
                      : {
                          firstName: "",
                          lastName: "",
                          streetAddress: "",
                          city: "",
                          zipCode: "",
                          phone: "",
                          email: "",
                        }),
                  });
                }}
              />
              <BillingDetailsComponent />
            </div>
            <div className="lg:w-[30%] w-full">
              <OrderSummaryComponent />
              <PaymentMethodComponent />

              <button
                type="submit"
                className="sticky bottom-0 w-full bg-black text-white py-3 mt-4 lg:h-14 h-10 flex items-center justify-center"
              >
                {isPending ? "loading..." : "Place Order"}
              </button>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
}
// This code is a React component for a checkout screen that uses Formik for form handling and Yup for validation.
