"use client";

import React, { useMemo } from "react";
import Header from "./components/Header";
import AddressInfo from "../components/AddressInfo";
import OrderSummary from "./components/OrderSummary";
import ProductTable from "./components/ProductTable";
import OrderStepper from "./components/Stepper";
import { useSearchParams } from "next/navigation";
import { useGetOrderDetailByOrderNumber } from "../profileQuery";
import Loader from "@/components/Loader";

const getSafeData = (data: any) => {
  if (data) {
    const addressObj = data?.address ?? {};
    const address = addressObj.streetAddress ?? "";
    const user = data.user ?? {};
    return {
      username: user.username ?? "",
      fullName: `${addressObj.firstName ?? "User"} ${addressObj.lastName ?? "Name"}`,
      email: addressObj.email ?? "xyz@gmail.com",
      streetAddress: address ?? "xyz street",
      phone: addressObj.phone ?? "030176776",
      orders: data,
    };
  }
  return null;
};

const OrderDetailsPageClient = () => {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderId");
  const { data, isLoading } = useGetOrderDetailByOrderNumber(orderNumber as string);
  const profileData = useMemo(() => getSafeData(data?.data), [data]);

  if (isLoading) return <Loader />;

  return (
    <div className="w-full py-2 lg:py-6 lg:px-4">
      <Header orderDate={profileData?.orders?.createdAt} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-6 lg:mt-8 mb-8 lg:mb-10">
        <AddressInfo
          name={profileData?.fullName ?? ""}
          email={profileData?.email ?? ""}
          phone={profileData?.phone ?? ""}
          address={profileData?.streetAddress ?? ""}
        />
        <OrderSummary
          orderId={profileData?.orders?.orderNo ?? ""}
          paymentMethod={profileData?.orders?.paymentMethod ?? ""}
          subtotal={profileData?.orders?.subTotal ?? ""}
          delivery={profileData?.orders?.deliveryFee ?? ""}
          total={profileData?.orders?.orderDetails?.totalPrice ?? profileData?.orders?.totalPrice ?? profileData?.orders?.subTotal ?? ""}
          discountAmount={profileData?.orders?.orderDetails?.discountAmount ?? profileData?.orders?.discountAmount ?? 0}
        />
      </div>

      <div className="mb-10 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Order Tracking</h3>
        <OrderStepper orderStatusHistory={profileData?.orders?.orderStatuses} />
      </div>

      <div className="w-full">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
        <ProductTable products={profileData?.orders?.items ?? []} />
      </div>
    </div>
  );
};

export default OrderDetailsPageClient;
