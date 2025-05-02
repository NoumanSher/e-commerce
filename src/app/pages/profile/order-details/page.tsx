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
const order = {
  date: "9 October, 2024",
  productTitle: "Product1",
  orderId: "#TAN-O-0590",
  paymentMethod: "KNET",
  subtotal: "40 KWD",
  delivery: "5 KWD",
  total: "45 KWD",
  orderStatuses: [
    {
      _id: "1",
      status: "Pending",
      statusDesc: "Order has been placed and is awaiting processing.",
      updatedAt: "2024-11-05T10:15:00Z",
    },
    {
      _id: "2",
      status: "Shipped",
      statusDesc:
        "Order has been shipped and is on its way to the destination.",
      updatedAt: "2024-11-05T14:30:00Z",
    },
    {
      _id: "3",
      status: "Delivered",
      statusDesc: "Order has been delivered to the recipient.",
      updatedAt: "2024-11-06T09:45:00Z",
    },
  ],
  billing: {
    name: "mohamed",
    address: "Sharq...",
    email: "mohamed@gmail.com",
    phone: "99663322",
  },
  shipping: {
    name: "mohamed",
    address: "Sharq...",
    email: "mohamed@gmail.com",
    phone: "99663322",
  },
  products: [
    {
      name: "Alex Evenings Women's Long Cold Shoulder Dress",
      price: "45 KWD",
      quantity: "1",
      subtotal: "45",
    },
  ],
};
const getSafeData = (data: any) => {
  if (data) {
    const addressObj = data?.address;

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
};
const OrderDetailsPage = () => { 
  const searchParams = useSearchParams(); // Access query parameters
  const orderNumber = searchParams.get("orderId"); // Get 'section' param
  const { data, isLoading } = useGetOrderDetailByOrderNumber(
    orderNumber as string
  );
  const profileData = useMemo(() => getSafeData(data?.data), [data]);

  if (isLoading) return <Loader />;
  return (
    <div className="lg:py-6 py-3">
      <Header orderDate={profileData?.orders.createdAt} />

      <div className="flex gap-4 flex-col lg:flex-row mt-3">
        <AddressInfo
          name={profileData?.fullName ?? ""}
          email={profileData?.email}
          phone={profileData?.phone}
          address={profileData?.streetAddress}
        />
        <div className="hidden lg:contents">
          <OrderSummary
            orderId={profileData?.orders?.orderNo ?? ""}
            paymentMethod={profileData?.orders?.paymentMethod ?? ""}
            subtotal={profileData?.orders?.subTotal ?? ""}
            delivery={profileData?.orders?.deliveryFee}
            total={profileData?.orders?.subTotal ?? ""}
          />
        </div>
      </div>
      {/* <OrderStatusTimeline statuses={order.statuses} /> */}
      <div className="my-5">
        <OrderStepper orderStatusHistory={profileData?.orders?.orderStatuses} />
      </div>
      <ProductTable products={profileData?.orders?.items} />
      <div className="lg:hidden mt-4">
        <OrderSummary
          orderId={profileData?.orders?.orderNo ?? ""}
          paymentMethod={profileData?.orders?.paymentMethod ?? ""}
          subtotal={profileData?.orders?.subTotal ?? ""}
          delivery={profileData?.orders?.deliveryFee}
          total={profileData?.orders?.subTotal ?? ""}
        />
      </div>
    </div>
  );
};

export default OrderDetailsPage;
