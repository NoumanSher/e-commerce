'use client'
import { useState, useMemo } from "react";

interface Tab {
  label: string;
  step: number;
  description: string;
}

const CartTabs = () => {
  const tabs: Tab[] = useMemo(
    () => [
      { label: "SHOPPING BAG", step: 1, description: "Manage Your Items List" },
      { label: "SHIPPING AND CHECKOUT", step: 2, description: "Checkout Your Items List" },
      { label: "CONFIRMATION", step: 3, description: "Review And Submit Your Order" }
    ],
    []
  );

  const [activeTab, setActiveTab] = useState<number>(1);
  const [validations, setValidations] = useState({
    shoppingBag: false,
    shippingCheckout: false,
    confirmation: false
  });

  const isTabClickable = (step: number): boolean => {
    if (activeTab === 3) return false; // Disable navigation once on the confirmation step
    if (step === 1) return true; // First tab always clickable
    if (step === 2) return validations.shoppingBag; // Second tab clickable after shopping bag validation
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
    <div className="w-full py-6">
      <div className="flex justify-between border-b border-gray-300 mb-6">
        {tabs.map((tab) => (
          <div
            key={tab.step}
            className={`flex-1 text-center py-4 cursor-pointer ${
              isTabClickable(tab.step) ? "text-black" : "text-gray-400 cursor-not-allowed"
            } ${activeTab === tab.step ? "border-b-4 border-black font-semibold" : ""}`}
            onClick={() => handleTabClick(tab.step)}
          >
            <h2 className="text-xl">{tab.label}</h2>
            <p className="text-sm">{tab.description}</p>
          </div>
        ))}
      </div>

      <div className="p-6 border border-gray-200 rounded-md">
        {activeTab === 1 && (
          <div>
            <h3 className="text-2xl mb-4">Shopping Bag</h3>
            {/* Add your shopping bag form/logic */}
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => completeValidation(1)}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
        {activeTab === 2 && (
          <div>
            <h3 className="text-2xl mb-4">Shipping and Checkout</h3>
            {/* Add your shipping/checkout form/logic */}
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => completeValidation(2)}
            >
              Place Order
            </button>
          </div>
        )}
        {activeTab === 3 && (
          <div>
            <h3 className="text-2xl mb-4">Confirmation</h3>
            {/* Add your confirmation form/logic */}
            <p>Thank you for your order!</p>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              onClick={() => completeValidation(3)}
            >
              Submit Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTabs;
