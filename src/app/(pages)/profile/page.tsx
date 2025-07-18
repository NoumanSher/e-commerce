"use client";

import React, { useMemo } from "react";
import ProfileInfo from "./components/ProfileInfo";
import AddressInfo from "./components/AddressInfo";
import OrderHistoryTabel from "./components/OrderHistoryTabel";
import {
  useGetOrdersByUserId,
  useGetProfileDetailByUserId,
} from "./profileQuery";
import { useStore } from "@/Context/storeContext";
import Loader from "@/components/Loader";
import { Address } from "./profileDtos";
const getSafeData = (data: any) => {
  return {
    orders: data?.data?.slice(0, 3) ?? [],
  };
};
const getSafeDataForProfile = (data: Address): Address => {
  return data;
};

const ProfilePage = () => {
  const { userId } = useStore();
  const { data, isLoading } = useGetOrdersByUserId(userId);
  const { data: profileDataResponse } = useGetProfileDetailByUserId(userId);
  console.log(profileDataResponse);

  const OrdersData = useMemo(() => getSafeData(data), [data]);
  const profileData = useMemo(
    () => getSafeDataForProfile(profileDataResponse?.address as Address),
    [profileDataResponse]
  );

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-y-3 lg:p-6">
      <div className="flex gap-3 flex-col lg:flex-row mt-5">
        <ProfileInfo
          name={profileData?.firstName + " " + profileData?.lastName}
        />
        <AddressInfo
          name={profileData?.firstName + " " + profileData?.lastName}
          email={profileData?.email}
          phone={profileData?.phone}
          address={profileData?.streetAddress}
        />
      </div>
      <OrderHistoryTabel
        orders={OrdersData.orders}
        title="Recent Order History"
        isButtonVisible
      />
    </div>
  );
};

export default ProfilePage;
