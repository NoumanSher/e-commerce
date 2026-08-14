"use client";

import { useMemo } from "react";
import { useGetStoreSettings } from "@/components/Slider/query/storeSettingQuery";

export interface ShippingFeeResult {
  deliveryFee: number;
  isFree: boolean;
  shippingLabel: string;
  displayFee: string; // "Free Delivery" or "PKR 250"
  shippingType: 'free' | 'flat' | 'conditional_free';
  flatRate: number;
  freeShippingMinAmount: number;
  amountNeededForFree: number;
  freeShippingText: string;
}

export function useShippingFee(subtotal: number = 0): ShippingFeeResult {
  const { data: storeSettings } = useGetStoreSettings();

  return useMemo(() => {
    const shipping = storeSettings?.shippingSetting || {
      shippingType: 'free',
      flatRate: 0,
      freeShippingMinAmount: 2000,
      shippingLabel: 'Standard Delivery',
      freeShippingText: 'Free Delivery',
    };

    const shippingType = shipping.shippingType || 'free';
    const flatRate = Math.max(0, Number(shipping.flatRate || 0));
    const freeShippingMinAmount = Math.max(0, Number(shipping.freeShippingMinAmount || 0));
    const shippingLabel = shipping.shippingLabel || 'Standard Delivery';
    const freeShippingText = shipping.freeShippingText || 'Free Delivery';

    if (shippingType === 'free') {
      return {
        deliveryFee: 0,
        isFree: true,
        shippingLabel,
        displayFee: freeShippingText,
        shippingType: 'free',
        flatRate: 0,
        freeShippingMinAmount: 0,
        amountNeededForFree: 0,
        freeShippingText,
      };
    }

    if (shippingType === 'flat') {
      return {
        deliveryFee: flatRate,
        isFree: flatRate === 0,
        shippingLabel,
        displayFee: flatRate === 0 ? freeShippingText : `PKR ${flatRate.toLocaleString()}`,
        shippingType: 'flat',
        flatRate,
        freeShippingMinAmount: 0,
        amountNeededForFree: 0,
        freeShippingText,
      };
    }

    // conditional_free
    const isFree = subtotal >= freeShippingMinAmount;
    const deliveryFee = isFree ? 0 : flatRate;
    const amountNeededForFree = isFree ? 0 : Math.max(0, freeShippingMinAmount - subtotal);

    return {
      deliveryFee,
      isFree,
      shippingLabel,
      displayFee: isFree ? freeShippingText : `PKR ${flatRate.toLocaleString()}`,
      shippingType: 'conditional_free',
      flatRate,
      freeShippingMinAmount,
      amountNeededForFree,
      freeShippingText,
    };
  }, [storeSettings?.shippingSetting, subtotal]);
}
