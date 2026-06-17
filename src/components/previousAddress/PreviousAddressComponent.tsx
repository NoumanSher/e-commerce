"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL_LIVE } from "@/config/env";
interface Address {
  _id: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  zipCode?: string;
  phone: string;
  email: string;
}

interface Props {
  userId: string;
  onSelect: (address: Address | null) => void;
}

export default function PreviousAddressComponent({ userId, onSelect }: Props) {
  const [address, setAddress] = useState<Address | null>(null);
  const [usePrevious, setUsePrevious] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL_LIVE}/order/userAdress/${userId}`
        );
        if (response.data.address) {
          setAddress(response.data.address);
        }
      } catch (error) {
        console.error("Failed to fetch address:", error);
      }
    };

    fetchAddress();
  }, [userId]);

  const handleCheckboxChange = (checked: boolean) => {
    setUsePrevious(checked);
    if (checked && address) {
      onSelect(address);
    } else {
      onSelect(null); // 👈 clear form when unchecked
    }
  };

  if (!address) return null;

  return (
    <>
      <p className="font-semibold text-lg mb-2">Use Previous Address</p>
      <div className="border p-4 mb-6 rounded-md shadow-sm bg-gray-50 lg:w-[20rem] w-full">
        <div className="flex items-center justify-between mb-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-black accent-black"
              checked={usePrevious}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
            />
            <span className="ml-2 text-sm text-gray-700">Use this address</span>
          </label>
        </div>
        <div className="text-sm text-gray-600">
          <p>
            {address.firstName} {address.lastName}
          </p>
          <p>{address.streetAddress}</p>
          <p>
            {address.city}, {address.zipCode}
          </p>
          <p>{address.phone}</p>
          <p>{address.email}</p>
        </div>
      </div>
    </>
  );
}
