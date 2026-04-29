"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ShoppingBag from "../shoppingBag";
import Checkout from "../checkout";
import OrderConfirmation from "../../OrderConfirmation";
import { AuthModal } from "@/components/AuthModal";
interface Tab {
  label: string;
  step: number;
  description: string;
}

type CartStep = 1 | 2 | 3;

interface CartState {
  activeTab: CartStep;
  validations: {
    shoppingBag: boolean;
    shippingCheckout: boolean;
    confirmation: boolean;
  };
}

type CartAction =
  | { type: "INITIALIZE"; section: string | null }
  | { type: "SET_TAB"; step: CartStep }
  | { type: "COMPLETE_STEP"; step: CartStep };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "INITIALIZE":
      if (action.section === "checkout" || action.section === "fscm") {
        return {
          ...state,
          activeTab: 2,
          validations: { ...state.validations, shoppingBag: true },
        };
      }
      return { ...state, activeTab: 1 };
    case "SET_TAB":
      // Disable navigation if user is on tab 3
      if (state.activeTab === 3) return state;
      // Second tab logic: only clickable after the shopping bag is validated
      if (action.step === 2 && !state.validations.shoppingBag) return state;
      return { ...state, activeTab: action.step };
    case "COMPLETE_STEP":
      if (action.step === 1) {
        return {
          ...state,
          activeTab: 2,
          validations: { ...state.validations, shoppingBag: true },
        };
      }
      if (action.step === 2) {
        return {
          ...state,
          activeTab: 3,
          validations: { ...state.validations, shippingCheckout: true },
        };
      }
      if (action.step === 3) {
        return {
          ...state,
          validations: { ...state.validations, confirmation: true },
        };
      }
      return state;
    default:
      return state;
  }
};

const CartScreen = () => {
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  const [state, dispatch] = React.useReducer(cartReducer, {
    activeTab: 1,
    validations: {
      shoppingBag: false,
      shippingCheckout: false,
      confirmation: false,
    },
  });

  const tabs: Tab[] = [
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
  ];

  useEffect(() => {
    dispatch({ type: "INITIALIZE", section });
  }, [section]);

  const isTabClickable = (step: number): boolean => {
    if (state.activeTab === 3) return false;
    if (step === 1) return section !== "checkout";
    if (step === 2) return state.validations.shoppingBag;
    return false;
  };

  const handleTabClick = (step: number) => {
    if (isTabClickable(step)) {
      dispatch({ type: "SET_TAB", step: step as CartStep });
    }
  };

  const completeValidation = (step: number) => {
    dispatch({ type: "COMPLETE_STEP", step: step as CartStep });
  };

  return (
    <div className="w-full py-6 container mx-auto lg:px-16 px-4">
      <h1 className="text-4xl font-semibold uppercase">Cart</h1>
      <div className="flex lg:flex-row flex-col justify-normal lg:justify-between border-b border-gray-300 mb-6">
        {tabs.map((tab) => (
          <div
            key={tab.step}
            className={`flex-1 text-start py-4 cursor-pointer ${isTabClickable(tab.step)
              ? "text-black"
              : "text-gray-400 cursor-not-allowed"
              } ${state.activeTab === tab.step
                ? "border-b-4 border-black font-semibold"
                : ""
              }`}
            onClick={() => handleTabClick(tab.step)}
          >
            <h2
              className={`${state.activeTab === tab.step ? "text-black" : "text-gray-400 "
                } text-xl`}
            >
              {tab.label}
            </h2>
            <p
              className={`${state.activeTab === tab.step ? "text-black" : "text-gray-400"
                } text-sm`}
            >
              {tab.description}
            </p>
          </div>
        ))}
      </div>

      <div>
        {state.activeTab === 1 && (
          <ShoppingBag checkValidation={(discount) => completeValidation(1)} />
        )}
        {state.activeTab === 2 && (
          <Checkout checkValidation={() => completeValidation(2)} />
        )}
        {state.activeTab === 3 && <OrderConfirmation />}
      </div>
      <AuthModal from="cart" />
    </div>
  );
};

export default CartScreen;
