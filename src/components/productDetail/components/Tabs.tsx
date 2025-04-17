import React, { useState, useCallback, memo } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const TABS = [
  {
    id: "delivery",
    label: "DELIVERY AND RETURN",
    content: (
      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
        <li>Standard delivery takes 3–7 business days depending on your location.</li>
        <li>Express shipping options are available at checkout for faster delivery.</li>
        <li>You have 14 days from the delivery date to return your item(s).</li>
        <li>Products must be returned in their original condition, unworn and with tags attached.</li>
        <li>Return shipping costs may apply.</li>
        <li>Refunds are processed within 5–7 business days after receiving your return.</li>
      </ul>
    ),
  },
  {
    id: "shipping",
    label: "SHIPPING INFORMATION",
    content: (
      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
        <li>We offer worldwide shipping.</li>
        <li>Orders are processed within 1–2 business days.</li>
        <li>Shipping rates and delivery times are calculated at checkout based on your location and selected shipping method.</li>
        <li>Once your order is shipped, you’ll receive a confirmation email with tracking information.</li>
        <li>Note: We are not responsible for customs duties or import taxes in your country.</li>
      </ul>
    ),
  },
  {
    id: "composition",
    label: "COMPOSITION AND CARE",
    content: (
      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
        <li>Please refer to the product description for exact material details.</li>
        <li>Most items are made with high-quality fabrics such as cotton, polyester, linen, or blends.</li>
        <li>To maintain the quality of your item:</li>
        <ul className="list-[circle] pl-5 space-y-1">
          <li>Machine wash cold with like colors</li>
          <li>Do not bleach</li>
          <li>Tumble dry low or air dry</li>
          <li>Iron on low heat if needed</li>
          <li>Dry clean when specified</li>
        </ul>
      </ul>
    ),
  },
];

const ProductDetailTabs: React.FC = memo(() => {
  const [activeTabContent, setActiveTabContent] = useState<React.ReactNode>("");

  const handleTabClick = useCallback((content: React.ReactNode) => {
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
                  <DialogTitle>{tab.label}</DialogTitle>
                  <DialogDescription asChild>
                    <div className="text-start">{tab.content}</div>
                  </DialogDescription>
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
