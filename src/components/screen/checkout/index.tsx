// src/pages/Checkout.tsx
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import BillingDetailsComponent from "@/components/BillingDetails";
import OrderSummaryComponent from "@/components/OrderSummary";
import PaymentMethodComponent from "@/components/PaymentMethod";

const CheckoutSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
//   country: Yup.string().required("Country is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
//   state: Yup.string().required("State is required"),
  zip: Yup.string().required("ZIP code is required"),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  paymentMethod: Yup.string().required("Please select a payment method"),
});
interface CheckoutProps {
    checkValidation: any
  }
export default function Checkout({checkValidation}:CheckoutProps) {
  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        country: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
        email: "",
        paymentMethod: "",
      }}
      validationSchema={CheckoutSchema}
      onSubmit={(values) => {
        debugger
        console.log("Form submitted with values:", values);
        checkValidation()
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit} className="flex lg:flex-row flex-col gap-x-4">
          <div className=" lg:w-[70%] w-full">
            <BillingDetailsComponent  />
          </div>
          <div className="lg:w-[30%] w-full">
            <OrderSummaryComponent />
            <PaymentMethodComponent />
            <button
              type="submit"
              className="w-full bg-black text-white py-3 mt-4 lg:h-14 h-10 flex items-center justify-center"
            >
              Place Order
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
