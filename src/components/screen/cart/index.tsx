"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ShoppingBag from "../shoppingBag";
import Checkout from "../checkout";
import OrderConfirmation from "../../OrderConfirmation";
interface Tab {
  label: string;
  step: number;
  description: string;
}

const CartScreen = () => {
  const searchParams = useSearchParams(); // Access query parameters
  const section = searchParams.get("section"); // Get 'section' param

  const tabs: Tab[] = useMemo(
    () => [
      {
        label: "01 SHOPPING BAG",
        step: 1,
        description: "Manage Your Items List",
      },
      {
        label: "02 SHIPPING AND CHECKOUT",
        step: 2,
        description: "Checkout Your Items List",
      },
      {
        label: "03 CONFIRMATION",
        step: 3,
        description: "Review And Submit Your Order",
      },
    ],
    []
  );

  const [activeTab, setActiveTab] = useState<number>(1);
  const [validations, setValidations] = useState({
    shoppingBag: false,
    shippingCheckout: false,
    confirmation: false,
  });

  // Set the initial active tab based on the 'section' query
  useEffect(() => {
    if (section === "checkout" || section === "fscm") {
      setActiveTab(2); // Activate second tab
      setValidations((prevState) => ({
        ...prevState,
        shoppingBag: true, // Mark the first tab as validated
      }));
    } else {
      setActiveTab(1); // Default to the first tab
    }
  }, [section]);

  const isTabClickable = (step: number): boolean => {
    // Disable navigation if user is on tab 3
    if (activeTab === 3) return false;

    // Disable the first tab if 'checkout' section is passed
    if (step === 1) {
      return section !== "checkout"; // First tab is only clickable if not in 'checkout' section
    }

    // Second tab logic: only clickable after the shopping bag is validated
    if (step === 2) return validations.shoppingBag;

    return false;
  };

  const handleTabClick = (step: number) => {
    if (isTabClickable(step)) {
      setActiveTab(step);
    }
  };

  const completeValidation = (step: number) => {
    if (step === 1) {
      setValidations({ ...validations, shoppingBag: true });
      setActiveTab(2);
    } else if (step === 2) {
      setValidations({ ...validations, shippingCheckout: true });
      setActiveTab(3);
    } else if (step === 3) {
      setValidations({ ...validations, confirmation: true });
    }
  };

  return (
    <div className="w-full py-6 container mx-auto lg:px-16 px-4">
      <h1 className="text-4xl font-semibold uppercase">Cart</h1>
      <div className="flex lg:flex-row flex-col justify-normal lg:justify-between border-b border-gray-300 mb-6">
        {tabs.map((tab) => (
          <div
            key={tab.step}
            className={`flex-1 text-start py-4 cursor-pointer ${
              isTabClickable(tab.step)
                ? "text-black"
                : "text-gray-400 cursor-not-allowed"
            } ${
              activeTab === tab.step
                ? "border-b-4 border-black font-semibold"
                : ""
            }`}
            onClick={() => handleTabClick(tab.step)}
          >
            <h2
              className={`${
                activeTab === tab.step ? "text-black" : "text-gray-400 "
              } text-xl`}
            >
              {tab.label}
            </h2>
            <p
              className={`${
                activeTab === tab.step ? "text-black" : "text-gray-400"
              } text-sm`}
            >
              {tab.description}
            </p>
          </div>
        ))}
      </div>

      <div>
        {activeTab === 1 && (
          <ShoppingBag checkValidation={() => completeValidation(1)} />
        )}
        {activeTab === 2 && (
          <Checkout checkValidation={() => completeValidation(2)} />
        )}
        {activeTab === 3 && <OrderConfirmation />}
      </div>
    </div>
  );
};

export default CartScreen;
