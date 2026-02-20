import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = ({ product }) => {
  // Construct the WhatsApp message with product details
  const generateWhatsAppText = () => {
    try {
      return encodeURIComponent(
        `Hello! I'm interested in your product:\n\n` +
        `*${product?.name || "Product"}*\n` +
        (product?.price ? `💰 Price: ${product.price}\n` : "") +
        (product?.sku ? `📦 SKU: ${product.sku}\n` : "") +
        (product?.size ? `📏 Size: ${product.size}\n` : "") +
        (product?.color ? `🎨 Color: ${product.color}\n` : "") +
        (product?.url ? `🔗 Product Link: ${product.url}\n` : "")
      );
    } catch (error) {
      console.error("Error generating WhatsApp text:", error);
      return encodeURIComponent("Hello! I'm interested in your products.");
    }
  };

  // Your WhatsApp number (with country code, no spaces or special characters)
  const whatsappNumber = "923176872900"; // Pakistan number example
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
