"use client";

import React, { useMemo } from "react";
import ProfileInfo from "./components/ProfileInfo";
import AddressInfo from "./components/AddressInfo";
import OrderHistoryTabel from "./components/OrderHistoryTabel";
import { useGetProfileDetailByUserId } from "./profileQuery"; 
import { useStore } from "@/Context/storeContext";
import Loader from "@/components/Loader";

const getSafeData = (data: any) => {
  const profile = data?.data?.[0] ?? {};
  const address = profile.address ?? {};
  const user = profile.user ?? {};

  return {
    username: user.username ?? "",
    fullName: `${address.firstName ?? "User"} ${address.lastName ?? "Name"}`,
    email: address.email ?? "xyz@gmail.com",
    streetAddress: address.streetAddress ?? "xyz street",
    phone: address.phone ?? "030176776",
    orders: data?.data?.slice(0, 3) ?? [],
  };
};

const ProfilePage = () => {
  const { userId } = useStore();
  const { data, isLoading } = useGetProfileDetailByUserId(userId);

  const profileData = useMemo(() => getSafeData(data), [data]);

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-y-3 lg:p-6">
      <div className="flex gap-3 flex-col lg:flex-row mt-5">
        <ProfileInfo
          name={
            profileData.username.charAt(0).toUpperCase() +
            profileData.username.slice(1)
          }
        />
        <AddressInfo
          name={profileData.fullName}
          email={profileData.email}
          phone={profileData.phone}
          address={profileData.streetAddress}
        />
      </div>
      <OrderHistoryTabel
        orders={profileData.orders}
        title="Recent Order History"
        isButtonVisible
      />
    </div>
  );
};

export default ProfilePage;
