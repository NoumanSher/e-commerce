import React, { useState, useCallback, memo } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Adjust based on your setup

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

const ProductDetailTabs: React.FC = memo(() => {
  const [activeTabContent, setActiveTabContent] = useState<string>(TABS[0].content);

  // Memoized function to handle tab clicks
  const handleTabClick = useCallback((content: string) => {
    setActiveTabContent(content);
  }, []);

  return (
    <div>
      <div className="tabs flex flex-wrap justify-between">
        {TABS.map((tab) => (
          <Dialog key={tab.id}>
            <DialogTrigger asChild>
              <button
                onClick={() => handleTabClick(tab.content)}
                className="nav-link pb-[2px] pt-2 focus:outline-none"
              >
                <p className="text-black text-sm font-medium text-opacity-95">
                  {tab.label}
                </p>
              </button>
            </DialogTrigger>
            {activeTabContent === tab.content && (
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Product Information</DialogTitle>
                  <DialogDescription>{activeTabContent}</DialogDescription>
                </DialogHeader>
              </DialogContent>
            )}
          </Dialog>
        ))}
      </div>
    </div>
  );
});
ProductDetailTabs.displayName = "ProductDetailTabs";

export default ProductDetailTabs;
