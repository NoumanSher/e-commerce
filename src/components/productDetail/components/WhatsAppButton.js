"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useGetStoreSettings } from "@/components/Slider/query/storeSettingQuery";

const WhatsAppButton = ({ product }) => {
  const { data: storeSettings } = useGetStoreSettings();

  // Derive phone dynamically from store settings
  const rawNumber =
    storeSettings?.mobile ||
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE ||
    "923176872900";
  const whatsappNumber = rawNumber.replace(/\D/g, "") || "923176872900";

  const generateWhatsAppText = () => {
    try {
      const lines = [
        "Hello! I'm interested in ordering this product:\n",
        `🛍️ *Product:* ${product?.name || "Product"}`,
        product?.price ? `💰 *Price:* PKR ${product.price}` : "",
        product?.sku ? `📦 *SKU:* ${product.sku}` : "",
        product?.size ? `📏 *Size:* ${product.size}` : "",
        product?.color ? `🎨 *Color:* ${product.color}` : "",
        product?.url ? `🔗 *Link:* ${product.url}` : "",
        "\nPlease let me know about availability and delivery.",
      ]
        .filter(Boolean)
        .join("\n");

      return encodeURIComponent(lines);
    } catch (error) {
      console.error("Error generating WhatsApp text:", error);
      return encodeURIComponent("Hello! I'm interested in your products.");
    }
  };

  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${generateWhatsAppText()}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-12 lg:bottom-0 right-6 z-50 animate-bounce hover:animate-none"
      aria-label="Contact via WhatsApp"
    >
      <div className="bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-lg flex items-center gap-2 transition-colors duration-300">
        <FaWhatsapp size={24} />
        <span className="hidden sm:inline font-semibold">Chat on WhatsApp</span>
      </div>
    </a>
  );
};

export default WhatsAppButton;
