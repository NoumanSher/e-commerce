// src/components/PaymentMethodComponent.tsx
import React from "react";
import { useFormContext } from "react-hook-form";

const PaymentMethodComponent: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Payment Method</h2>
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            {...register("paymentMethod")}
            type="radio"
            value="cash"
            className="form-radio"
          />
          <span>cash on delivery</span>
        </label>
      </div>
      {errors.paymentMethod && (
        <div className="text-red-500 text-xs mt-1">
          {errors.paymentMethod?.message as string}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodComponent;
