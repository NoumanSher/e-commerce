"use client";

import React, { useMemo, useEffect, useState } from "react";
import ProfileInfo from "./components/ProfileInfo";
import AddressInfo from "./components/AddressInfo";
import OrderHistoryTabel from "./components/OrderHistoryTabel";
import {
  useGetOrdersByUserId,
  useGetProfileDetailByUserId,
} from "./profileQuery";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import { Address } from "./profileDtos";

const getSafeData = (data: any) => ({
  orders: data?.data?.slice(0, 3) ?? [],
});

const ProfilePage = () => {
  const { userId, userName } = useAuth();
  const { data, isLoading: isOrdersLoading } = useGetOrdersByUserId(userId);
  const { data: profileDataResponse, isLoading: isProfileLoading } = useGetProfileDetailByUserId(userId);

  const [mounted, setMounted] = useState(false);

  // Ensure hydration consistency
  useEffect(() => {
    setMounted(true);
  }, []);

  const OrdersData = useMemo(() => getSafeData(data), [data]);
  
  // Use profile query data (AddressResponse) first, then fallback to first order's address
  const profileAddress = (profileDataResponse as any)?.address as Address | undefined;
  const profileData = profileAddress || (OrdersData.orders[0] as any)?.address as Address | undefined;

  const isLoading = isOrdersLoading || (isProfileLoading && !profileAddress);

  if (!mounted || (isLoading && !profileData && OrdersData.orders.length === 0)) return <Loader />;

  return (
    <div className="w-full py-2 lg:py-6 lg:px-4">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Account</h1>
        <p className="mt-2 text-sm text-gray-500">Manage your profile information, addresses, and order history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
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
          <div className="bg-white border border-gray-200 w-full p-8 rounded-lg shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[250px]">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No delivery address</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-sm">
              Add your delivery address during checkout to get your orders delivered to your doorstep.
            </p>
          </div>
        )}
      </div>

      <div className="w-full">
        <OrderHistoryTabel
          orders={OrdersData.orders}
          title="Recent Order History"
          ordersLAutalLength={(data as any)?.data?.length || 0}
          isButtonVisible
        />
      </div>
    </div>
  );
};

export default ProfilePage;
