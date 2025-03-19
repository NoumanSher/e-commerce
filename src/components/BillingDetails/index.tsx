// src/components/BillingDetailsComponent.tsx
import React from "react";
import { Field, ErrorMessage } from "formik";

const BillingDetailsComponent: React.FC = () => (
  <div className="">
    <h2 className="text-xl font-bold mb-4 col-span-full">Billing Details</h2>
    <div className="flex gap-x-2 mb-3">
      <div className="flex-1">
        <label className="block text-sm font-medium">First Name *</label>
        <Field
          name="firstName"
          type="text"
          className="mt-1 p-2 h-14 w-full border rounded"
        />
        <ErrorMessage
          name="firstName"
          component="div"
          className="text-red-500 text-xs"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium">Last Name *</label>
        <Field
          name="lastName"
          type="text"
          className="mt-1 p-2 w-full h-14 border rounded"
        />
        <ErrorMessage
          name="lastName"
          component="div"
          className="text-red-500 text-xs"
        />
      </div>
    </div>

    <div className="mb-3">
      <label className="block text-sm font-medium">Street address *</label>
      <Field
        name="streetAddress"
        placeholder='house number and street name'
        type="text"
        className="mt-1 p-2 w-full h-14 border rounded"
      />
      <ErrorMessage
        name="streetAddress"
        component="div"
        className="text-red-500 text-xs"
      />
    </div>
    <div className="mb-3">
      <label className="block text-sm font-medium">Town / City *</label>
      <Field
        name="city"
        type="text"
        className="mt-1 p-2 w-full h-14 border rounded"
      />
      <ErrorMessage
        name="city"
        component="div"
        className="text-red-500 text-xs"
      />
    </div>
    <div className="mb-3">
      <label className="block text-sm font-medium">ZIP Code *</label>
      <Field
        name="zipCode"
        type="number"
        className="mt-1 p-2 w-full h-14 border rounded"
      />
      <ErrorMessage
        name="zipCode"
        component="div"
        className="text-red-500 text-xs"
      />
    </div>
    <div className="mb-3">
      <label className="block text-sm font-medium">Phone *</label>
      <Field
        name="phone"
        type="number"
        className="mt-1 p-2 w-full h-14 border rounded"
      />
      <ErrorMessage
        name="phone"
        component="div"
        className="text-red-500 text-xs"
      />
    </div>
    <div className="mb-3">
      <label className="block text-sm font-medium">Email *</label>
      <Field
        name="email"
        type="email"
        className="mt-1 p-2 w-full h-14 border rounded"
      />
      <ErrorMessage
        name="email"
        component="div"
        className="text-red-500 text-xs"
      />
    </div>
    {/* Continue with other fields in a similar pattern */}
  </div>
);

export default BillingDetailsComponent;
