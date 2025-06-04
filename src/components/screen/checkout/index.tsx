// src/pages/Checkout.tsx
import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import BillingDetailsComponent from "@/components/BillingDetails";
import OrderSummaryComponent from "@/components/OrderSummary";
import PaymentMethodComponent from "@/components/PaymentMethod";
import { useStore } from "@/Context/storeContext";
import { useOrderCreate } from "./query/orderCreateQuery";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/hooks/useCart";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import PreviousAddressComponent from "@/components/previousAddress/PreviousAddressComponent";
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
  checkValidation: any;
}
export default function Checkout({ checkValidation }: CheckoutProps) {
  const searchParams = useSearchParams(); // Access query parameters
  const section = searchParams.get("section"); // Get 'section' param
  const { productDetail, setOrderNumber, cartItems, userId, isLogIn } =
    useStore();
  const { mutate, isSuccess, isPending, data } = useOrderCreate();
  const { subTotal, clearCart } = useCart();
  const queryClient = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    if (isSuccess) {
      // Invalidate the product queries to refresh stock data
      if (section === "checkout" && productDetail?.items[0].productId) {
        queryClient.invalidateQueries({
          queryKey: ["productId", productDetail.items[0].productId],
          exact: true,
        });
      } else if (cartItems.length > 0) {
        // Invalidate all product queries in cart
        cartItems.forEach((item) => {
          if (item.product._id) {
            queryClient.invalidateQueries({
              queryKey: ["productId", item.product._id],
            });
          }
        });
      }

      if (section !== "checkout") {
        clearCart();
      }
      setOrderNumber(data?.data.orderNo);
      checkValidation();
    }
  }, [
    checkValidation,
    clearCart,
    data?.data.orderNo,
    isSuccess,
    section,
    setOrderNumber,
    productDetail,
    cartItems,
    queryClient,
  ]);

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
        paymentMethod: "",
      }}
      validationSchema={CheckoutSchema}
      onSubmit={(values) => {
        const { paymentMethod, ...rest } = values;
        if (section === "checkout") {
          debugger;
          let singleOrderObject = {
            userId: userId,

            deliveryFee: productDetail?.deliveryFee as number,
            items: [
              {
                ...(productDetail?.items[0]?.variantId && {
                  variantId: productDetail.items[0].variantId,
                }),
                productId: productDetail?.items[0].productId as string,
                price: productDetail?.items[0].price as number,
                quantity: productDetail?.items[0].quantity as number,
                lineTotal:
                  (productDetail?.items[0].price ?? 0) *
                  (productDetail?.items[0].quantity ?? 0),
              },
            ],
            totalPrice: productDetail?.totalPrice as number,
            subTotal: productDetail?.subTotal as number,
            isSaved: true,
            paymentMethod: paymentMethod as "cash",
            address: { ...rest },
          };
          if (isLogIn) {
            mutate(singleOrderObject);
          } else {
            toast.error("Please login to place order");
            const callbackUrl = encodeURIComponent(
              "/pages/cart?section=checkout"
            );
            setTimeout(
              () => router.push(`/pages/login?callbackUrl=${callbackUrl}`),
              3000
            );
          }
        } else {
          const items = cartItems.map((item) => ({
            ...(item?.variantID && { variantId: item.variantID }),
            productId: item.product._id,
            price: item.product.salePrice,
            quantity: item.quantity,
            lineTotal: item.product.salePrice * item.quantity,
          }));
          let dataToPass = {
            userId: userId,
            items: items,
            totalPrice: subTotal,
            subTotal: subTotal,
            isSaved: true,
            paymentMethod: paymentMethod as "cash",
            address: { ...rest },
            deliveryFee: 0,
          };
          if (isLogIn) {
            mutate(dataToPass);
          } else {
            toast.error("Please login to place order");
            const callbackUrl = encodeURIComponent(
              "/pages/cart?section=checkout"
            );
            setTimeout(
              () => router.push(`/pages/login?callbackUrl=${callbackUrl}`),
              3000
            );
          }
        }
      }}
    >
      {({ handleSubmit, ...formik }) => {
        return (
          <>
            <PreviousAddressComponent
              userId={userId}
              onSelect={(prevAddress) => {
                if (prevAddress) {
                  formik.setValues((values) => ({
                    ...values,
                    firstName: prevAddress.firstName,
                    lastName: prevAddress.lastName,
                    streetAddress: prevAddress.streetAddress,
                    city: prevAddress.city,
                    zipCode: prevAddress.zipCode,
                    phone: prevAddress.phone,
                    email: prevAddress.email,
                  }));
                } else {
                  // Clear form fields
                  formik.setValues((values) => ({
                    ...values,
                    firstName: "",
                    lastName: "",
                    streetAddress: "",
                    city: "",
                    zipCode: "",
                    phone: "",
                    email: "",
                  }));
                }
              }}
            />

            <Form
              onSubmit={handleSubmit}
              className="flex lg:flex-row flex-col gap-x-4"
            >
              <div className=" lg:w-[70%] w-full">
                <BillingDetailsComponent />
              </div>
              <div className="lg:w-[30%] w-full">
                <OrderSummaryComponent />
                <PaymentMethodComponent />
                {isPending ? (
                  <div className="flex items-center justify-center py-3 mt-4 lg:h-14 h-10">
                    ...loading
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 mt-4 lg:h-14 h-10 flex items-center justify-center"
                  >
                    Place Order
                  </button>
                )}
              </div>
            </Form>
          </>
        );
      }}
    </Formik>
  );
}
