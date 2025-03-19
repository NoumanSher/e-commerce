// src/components/PaymentMethodComponent.tsx
import React from "react";
import { Field, ErrorMessage } from "formik";

const PaymentMethodComponent: React.FC = () => (
  <div className="p-4 border rounded">
    <h2 className="text-xl font-bold mb-4">Payment Method</h2>
    <div className="mb-4">
      <label className="flex items-center space-x-2">
        <Field type="radio" name="paymentMethod" value="cash" className="form-radio" />
        <span>cash on delivery</span>
      </label>
    </div>
    {/* <div className="mb-4">
      <label className="flex items-center space-x-2">
        <Field type="radio" name="paymentMethod" value="creditCard" className="form-radio" />
        <span>Credit Card</span>
      </label>
    </div>
    <div className="mb-4">
      <label className="flex items-center space-x-2">
        <Field type="radio" name="paymentMethod" value="paypal" className="form-radio" />
        <span>PayPal</span>
      </label>
    </div> */}
    <ErrorMessage name="paymentMethod" component="div" className="text-red-500 text-xs mt-1" />
  </div>
);

export default PaymentMethodComponent;
