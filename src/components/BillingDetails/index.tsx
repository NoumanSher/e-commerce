// src/components/BillingDetailsComponent.tsx
import React from "react";
import { useFormContext } from "react-hook-form";

const BillingDetailsComponent: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4 col-span-full">Billing Details</h2>
      <div className="flex gap-x-2 mb-3">
        <div className="flex-1">
          <label className="block text-sm font-medium">First Name *</label>
          <input
            {...register("firstName")}
            type="text"
            className={`mt-1 p-2 h-14 w-full border rounded ${errors.firstName ? 'border-red-500' : ''}`}
          />
          {errors.firstName && (
            <div className="text-red-500 text-xs mt-1">
              {errors.firstName?.message as string}
            </div>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Last Name *</label>
          <input
            {...register("lastName")}
            type="text"
            className={`mt-1 p-2 w-full h-14 border rounded ${errors.lastName ? 'border-red-500' : ''}`}
          />
          {errors.lastName && (
            <div className="text-red-500 text-xs mt-1">
              {errors.lastName?.message as string}
            </div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium">Street address *</label>
        <input
          {...register("streetAddress")}
          placeholder='house number and street name'
          type="text"
          className={`mt-1 p-2 w-full h-14 border rounded ${errors.streetAddress ? 'border-red-500' : ''}`}
        />
        {errors.streetAddress && (
          <div className="text-red-500 text-xs mt-1">
            {errors.streetAddress?.message as string}
          </div>
        )}
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Town / City *</label>
        <input
          {...register("city")}
          type="text"
          className={`mt-1 p-2 w-full h-14 border rounded ${errors.city ? 'border-red-500' : ''}`}
        />
        {errors.city && (
          <div className="text-red-500 text-xs mt-1">
            {errors.city?.message as string}
          </div>
        )}
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">ZIP Code *</label>
        <input
          {...register("zipCode")}
          type="text"
          className={`mt-1 p-2 w-full h-14 border rounded ${errors.zipCode ? 'border-red-500' : ''}`}
        />
        {errors.zipCode && (
          <div className="text-red-500 text-xs mt-1">
            {errors.zipCode?.message as string}
          </div>
        )}
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Phone *</label>
        <input
          {...register("phone")}
          type="text"
          className={`mt-1 p-2 w-full h-14 border rounded ${errors.phone ? 'border-red-500' : ''}`}
        />
        {errors.phone && (
          <div className="text-red-500 text-xs mt-1">
            {errors.phone?.message as string}
          </div>
        )}
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium">Email *</label>
        <input
          {...register("email")}
          type="email"
          className={`mt-1 p-2 w-full h-14 border rounded ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && (
          <div className="text-red-500 text-xs mt-1">
            {errors.email?.message as string}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingDetailsComponent;
