import React from "react";
import ProfileInfo from "./components/ProfileInfo";
import AddressInfo from "./components/AddressInfo";
import OrderHistoryTabel from "./components/OrderHistoryTabel";

const orders = [
  {
    id: "#738",
    date: "8 Sep, 2020",
    total: "135.00KWD (5 Products)",
    status: "Processing",
    details: "#",
  },
  {
    id: "#703",
    date: "24 May, 2020",
    total: "25.00KWD (1 Product)",
    status: "On the way",
    details: "#",
  },
  {
    id: "#130",
    date: "22 Oct, 2020",
    total: "250.00KWD (4 Products)",
    status: "Completed",
    details: "#",
  },
  {
    id: "#130",
    date: "22 Oct, 2020",
    total: "250.00KWD (4 Products)",
    status: "Completed",
    details: "#",
  },
  // Add more orders as needed
];

const ProfilePage = () => (
  <div className="flex  flex-col p-6">
    <div className="flex gap-2">
      <ProfileInfo name="Dianne Russell" />
      <AddressInfo
        name="Dianne Russell"
        email="dianne.russell@gmail.com"
        phone="(671) 555-0110"
        address="4140 Parker Rd. Allentown, New Mexico 31134"
      />
    </div>
      <OrderHistoryTabel
        orders={orders.slice(0, 3)}
        title="Recent Order History"
        isButtonVisible={true}
      />
  </div>
);

export default ProfilePage;
