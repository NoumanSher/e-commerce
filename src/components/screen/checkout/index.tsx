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
  const { productDetail, setOrderNumber, cartItems } = useStore();
  const { mutate, isSuccess, isPending, data } = useOrderCreate();
  const { subTotal, clearCart } = useCart();
  useEffect(() => {
    if (isSuccess) {
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
          let finalCompleteOrderObject = {
            userId: productDetail?.userId as string,

            deliveryFee: productDetail?.deliveryFee as number,
            items: [
              {
                variantId: productDetail?.items[0].variantId as string,
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
          mutate(finalCompleteOrderObject);
        } else {
          const items = cartItems.map((item) => ({
            variantId: item?.variantID,
            productId: item.product._id,
            price: item.product.salePrice,
            quantity: item.quantity,
            lineTotal: item.product.salePrice * item.quantity,
          }));
          let dataToPass = {
            userId: "67d47dd27a43f7958263f0c5",
            items: items,
            totalPrice: subTotal,
            subTotal: subTotal,
            isSaved: true,
            paymentMethod: paymentMethod as "cash",
            address: { ...rest },
            deliveryFee: 0,
          };
          mutate(dataToPass);
        }
      }}
    >
      {({ handleSubmit }) => {
        return (
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
        );
      }}
    </Formik>
  );
}
