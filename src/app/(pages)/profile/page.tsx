"use client";

import React, { useMemo, useEffect, useState } from "react";
import ProfileInfo from "./components/ProfileInfo";
import AddressInfo from "./components/AddressInfo";
import OrderHistoryTabel from "./components/OrderHistoryTabel";
import {
  useGetOrdersByUserId,
  useGetProfileDetailByUserId,
} from "./profileQuery";
import { useStore } from "@/context/storeContext";
import Loader from "@/components/Loader";
import { Address } from "./profileDtos";

const getSafeData = (data: any) => ({
  orders: data?.data?.slice(0, 3) ?? [],
});

const ProfilePage = () => {
  const { userId, userName } = useStore();
  const { data, isLoading } = useGetOrdersByUserId(userId);
  const { data: profileDataResponse } = useGetProfileDetailByUserId(userId);

  const [mounted, setMounted] = useState(false);

  // Ensure hydration consistency
  useEffect(() => {
    setMounted(true);
  }, []);

  const OrdersData = useMemo(() => getSafeData(data), [data]);
  const profileData = profileDataResponse?.address as Address | undefined;

  if (!mounted || isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-y-3 lg:p-6">
      <div className="flex gap-3 flex-col lg:flex-row mt-5">
        <ProfileInfo
          name={
            profileData
              ? `${profileData.firstName} ${profileData.lastName}`
              : userName
          }
        />

        {profileData ? (
          <AddressInfo
            name={`${profileData.firstName} ${profileData.lastName}`}
            email={profileData.email}
            phone={profileData.phone}
            address={profileData.streetAddress}
          />
        ) : (
          <div className="bg-card lg:w-[50%] w-full text-card-foreground p-4 rounded-lg shadow-md">
            <div className="flex flex-col items-center justify-center text-gray-500 mt-3">
              <svg
                className="w-16 h-16 mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>

              <p className="text-lg font-medium">No delivery address</p>
              <p className="text-sm mt-1 mb-4">
                Add an address to get your orders delivered at checkout
              </p>
            </div>
          </div>
        )}
      </div>

      <OrderHistoryTabel
        orders={OrdersData.orders}
        title="Recent Order History"
        ordersLAutalLength={data?.data?.length || 0}
        isButtonVisible
      />
    </div>
  );
};

export default ProfilePage;
