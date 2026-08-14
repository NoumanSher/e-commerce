"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useGetStoreSettings } from "@/components/Slider/query/storeSettingQuery";

interface ProductInfo {
  name?: string;
  price?: number | string;
  sku?: string;
  size?: string;
  color?: string;
  url?: string;
}

interface WhatsAppFloatingButtonProps {
  product?: ProductInfo;
  phone?: string;
  customMessage?: string;
  className?: string;
}

export default function WhatsAppFloatingButton({
  product,
  phone,
  customMessage,
  className = "fixed bottom-16 sm:bottom-6 right-6 z-40 group",
}: WhatsAppFloatingButtonProps) {
  const { data: storeSettings } = useGetStoreSettings();

  const rawNumber =
    phone ||
    storeSettings?.mobile ||
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE ||
    "923176872900";

  // Clean non-digit characters from phone number
  const whatsappNumber = rawNumber.replace(/\D/g, "") || "923176872900";

  const generateText = () => {
    if (customMessage) {
      return encodeURIComponent(customMessage);
    }

    if (product) {
      return encodeURIComponent(
        `Hello! I'm interested in your product:\n\n` +
          `*${product.name || "Product"}*\n` +
          (product.price ? `💰 Price: PKR ${product.price}\n` : "") +
          (product.sku ? `📦 SKU: ${product.sku}\n` : "") +
          (product.size ? `📏 Size: ${product.size}\n` : "") +
          (product.color ? `🎨 Color: ${product.color}\n` : "") +
          (product.url ? `🔗 Product Link: ${product.url}\n` : "")
      );
    }

    return encodeURIComponent("Hello! I'm interested in your products.");
  };

  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${generateText()}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label="Contact us on WhatsApp"
    >
      <span
        className="absolute inset-0 rounded-full bg-green-400 opacity-60 animate-ping"
        aria-hidden="true"
      />
      <div className="relative bg-[#25D366] hover:bg-[#128C7E] active:scale-95 text-white p-3.5 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 hover:shadow-green-500/40 hover:shadow-lg">
        <FaWhatsapp size={24} />
      </div>
    </a>
  );
}
