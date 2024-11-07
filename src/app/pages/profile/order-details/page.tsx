// OrderDetailsPage.tsx
import React from "react";
import Header from "./components/Header";
import AddressInfo from "../components/AddressInfo";
import OrderSummary from "./components/OrderSummary";
import OrderStatusTimeline from "./components/OrderStatusTimeline";
import ProductTable from "./components/ProductTable";
import OrderStepper from "./components/Stepper";

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

const OrderDetailsPage = () => (
  <div className="lg:py-6 py-3">
    <Header orderDate={order.date} productTitle={order.productTitle} />

    <div className="flex gap-4 flex-col lg:flex-row mt-3">
      <AddressInfo
        name={order.billing.name}
        address={order.billing.address}
        email={order.billing.email}
        phone={order.billing.phone}
      />
      <div className="hidden lg:contents">
        <OrderSummary
          orderId={order.orderId}
          paymentMethod={order.paymentMethod}
          subtotal={order.subtotal}
          delivery={order.delivery}
          total={order.total}
        />
      </div>
    </div>
    {/* <OrderStatusTimeline statuses={order.statuses} /> */}
    <div className="my-5">
      <OrderStepper orderStatusHistory={order?.orderStatuses} />
    </div>
    <ProductTable products={order.products} />
    <div className="lg:hidden mt-4">
      <OrderSummary
        orderId={order.orderId}
        paymentMethod={order.paymentMethod}
        subtotal={order.subtotal}
        delivery={order.delivery}
        total={order.total}
      />
    </div>
  </div>
);

export default OrderDetailsPage;
