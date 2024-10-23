// src/components/ProductDetailInfo.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Adjust this import based on your ShadCN setup

const TABS = [
  {
    id: "delivery",
    label: "DELIVERY AND RETURN",
    content: "Details about Delivery and Return",
  },
  {
    id: "shipping",
    label: "SHIPPING INFORMATION",
    content: "Details about Shipping Information",
  },
  {
    id: "composition",
    label: "COMPOSITION AND CARE",
    content: "Details about Composition and Care",
  },
];

const ProductDetailInfo: React.FC = () => {
  const [activeTabContent, setActiveTabContent] = useState<string>("");

  // Handle tab click and set content
  const handleTabClick = (content: string) => {
    setActiveTabContent(content);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="tabs flex flex-wrap justify-between">
        {TABS.map((tab) => (
          <Dialog key={tab.id}>
            <DialogTrigger asChild>
              <button
                onClick={() => handleTabClick(tab.content)}
                className="nav-link pb-[2px] pt-2   focus:outline-none"
              >
                <p className="text-black text-sm font-medium text-opacity-95">
                  {tab.label}
                </p>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Product Information</DialogTitle>
                <DialogDescription>{activeTabContent}</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailInfo;
