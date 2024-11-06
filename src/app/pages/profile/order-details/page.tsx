// OrderDetailsPage.tsx
import React from "react";
import Header from "./components/Header";
import AddressInfo from "../components/AddressInfo";
import OrderSummary from "./components/OrderSummary";
import OrderStatusTimeline from "./components/OrderStatusTimeline";
import ProductTable from "./components/ProductTable";

const order = {
  date: "9 October, 2024",
  productTitle: "Product1",
  orderId: "#TAN-O-0590",
  paymentMethod: "KNET",
  subtotal: "40 KWD",
  delivery: "5 KWD",
  total: "45 KWD",
  statuses: [
    {
      date: "Wednesday, October 09",
      time: "09:43 PM",
      status: "Order placed and pending confirmation",
    },
    {
      date: "Wednesday, October 09",
      time: "09:44 PM",
      status: "Order paid and confirmed",
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
  <div className="pt-6">
    <Header orderDate={order.date} productTitle={order.productTitle} />

    <div className="flex gap-4 flex-col lg:flex-row">
      <AddressInfo
        name={order.billing.name}
        address={order.billing.address}
        email={order.billing.email}
        phone={order.billing.phone}
      />
      <OrderSummary
        orderId={order.orderId}
        paymentMethod={order.paymentMethod}
        subtotal={order.subtotal}
        delivery={order.delivery}
        total={order.total}
      />
    </div>
    <OrderStatusTimeline statuses={order.statuses} />
    <ProductTable products={order.products} />
  </div>
);

export default OrderDetailsPage;
