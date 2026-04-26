import QuantitySelector from "../productDetail/components/QuantitySelector";
import { useCart } from "../hooks/useCart";
import { toast } from "react-toastify";
import Image from "next/image";
import { RiDeleteBin6Line } from "react-icons/ri";
import { calculateDiscountedPrice } from "@/lib/utils";

const ProductTable: React.FC = () => {
  const { removeFromCart, cartItems, updateItemQuantity } = useCart();
  const handleQuantityChange = (
    productId: string,
    quantity: number,
    variantId?: string
  ) => {
    const item = cartItems.find(
      (item) => item.product._id === productId && item.variantID === variantId
    );
    if (item) {
      const selectedVariant = item.product?.variants?.find(
        (variant) => variant._id === variantId
      );
      const availableStock = selectedVariant
        ? selectedVariant.stock
        : item.product.stock;

      if (quantity > availableStock) {
        toast.error(`Only ${availableStock} available.`);
        quantity = availableStock; // Cap quantity at available stock
        return;
      }
    }
    updateItemQuantity(productId, quantity, variantId);
  };
  return (
    <div className="w-full border-b border-gray-300 pb-4">
      {/* Table View for Larger Screens */}
      <table className="hidden md:table w-full">
        <thead>
          <tr className="text-left border-b border-gray-300 text-gray-600">
            <th className="py-4">IMAGE</th>
            <th className="py-4">PRODUCT NAME</th>
            <th className="py-4">PRICE</th>
            <th className="py-4">QUANTITY</th>
            <th className="py-4">SUB TOTAL</th>
            <th className="py-4"></th>
          </tr>
        </thead>
        <tbody>
          {cartItems.length > 0 ? (
            cartItems.map((item) => {
              const selectedVariant = item.product.variants?.find(
                (varient) => varient._id === item.variantID
              );
              const basePrice = item.product.salePrice;
              const extaPrice = selectedVariant?.additionalSalePrice || 0;
              const discount = item.product.discount || 0;
              const finalPrice = calculateDiscountedPrice(basePrice + extaPrice, discount);
              return (
                <tr key={item.product._id} className="border-b border-gray-200">
                  <td className="py-4">
                    <Image
                      src={item.product.images[0].src}
                      alt={item.product.images[0].alt}
                      height={96}
                      width={80}
                      className="w-20 h-24 object-cover"
                    />
                  </td>
                  <td className="py-[6px] pr-2 text-gray-700 lg:w-[150px] xl:w-[300px]">
                    <div className="font-medium">{item.product.productName}</div>
                    {selectedVariant && (
                      <div className="text-xs text-gray-400 mt-1 uppercase font-medium">
                        Variant: {selectedVariant.name}
                      </div>
                    )}
                  </td>
                  <td className="py-4 text-gray-800 ">
                    {finalPrice.toFixed(0)}
                  </td>
                  <td className="py-4">
                    <QuantitySelector
                      className="h-14"
                      quantity={item.quantity}
                      stock={
                        selectedVariant?.stock
                          ? selectedVariant?.stock
                          : item.product.stock
                      }
                      onQuantityChange={(quantity) =>
                        handleQuantityChange(
                          item.product._id,
                          quantity,
                          item.variantID
                        )
                      }
                    />
                  </td>
                  <td className="py-4 text-gray-700">
                    {(finalPrice * item.quantity).toFixed(0)}
                  </td>
                  <td
                    className="py-4 text-gray-700 cursor-pointer"
                    onClick={() =>
                      removeFromCart(item.product._id, item.variantID)
                    }
                  >
                    <RiDeleteBin6Line
                      color="red"
                      title="Delete item"
                      size={22}
                      className="hover:scale-110"
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="py-12 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <svg
                    className="w-16 h-16 mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>

                  <p className="text-lg font-medium">No Cart item yet</p>
                  <p className="text-sm mt-1">
                    Your cart history will appear here
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Compact Column View for Mobile Screens */}
      <div className="block md:hidden space-y-6">
        {cartItems.length > 0 ? (
          cartItems.map((item) => {
            const selectedVariant = item.product.variants?.find(
              (varient) => varient._id === item.variantID
            );
            const basePrice = item.product.salePrice;
            const extaPrice = selectedVariant?.additionalSalePrice || 0;
            const discount = item.product.discount || 0;
            const finalPrice = calculateDiscountedPrice(basePrice + extaPrice, discount);
            return (
              <div
                key={item.product._id}
                className="border p-2 rounded-lg border-gray-300 py-4 flex flex-col space-y-2"
              >
                {/* Row with image, name, and delete icon */}
                <div className="flex items-center">
                  <Image
                    src={item.product.images[0].src}
                    alt={item.product.images[0].alt}
                    height={80}
                    width={80}
                    className="w-20 h-20 object-cover mr-4"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 line-clamp-3">
                      {item.product.productName}
                    </p>
                    {selectedVariant && (
                      <p className="text-xs text-gray-400 mt-1 uppercase font-medium">
                        Variant: {selectedVariant.name}
                      </p>
                    )}
                  </div>
                  <button
                    className="text-red-500 ml-4"
                    onClick={() =>
                      removeFromCart(item.product._id, item.variantID)
                    }
                  >
                    <RiDeleteBin6Line
                      color="red"
                      title="Delete item"
                      size={22}
                      className="hover:scale-110"
                    />
                  </button>
                </div>

                {/* Row with price, quantity selector, and total */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">{finalPrice.toFixed(0)}</span>
                  <QuantitySelector
                    quantity={item.quantity}
                    stock={
                      selectedVariant?.stock
                        ? selectedVariant?.stock
                        : item.product.stock
                    }
                    onQuantityChange={(quantity) =>
                      handleQuantityChange(
                        item.product._id,
                        quantity,
                        item.variantID
                      )
                    }
                    className="flex items-center !w-24"
                  />
                  <span className="text-gray-700 font-semibold">
                    {(finalPrice * item.quantity).toFixed(0)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500">
            <svg
              className="w-16 h-16 mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>

            <p className="text-lg font-medium">No Cart item yet</p>
            <p className="text-sm mt-1">Your cart history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTable;
