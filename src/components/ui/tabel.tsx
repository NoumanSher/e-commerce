// /components/ProductTable.tsx

import { useState } from "react";
import QuantitySelector from "../productDetail/components/QuantitySelector";
import { useCart } from "../hooks/useCart";
import { toast } from "react-toastify";

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
          {cartItems.map((item) => {
            const selectedVariant = item.product.variants?.find(
              (varient) => varient._id === item.variantID
            );
            const basePrice = item.product.salePrice;
            const extaPrice = selectedVariant?.additionalSalePrice || 0;
            const finalPrice = basePrice + extaPrice;
            return (
              <tr key={item.product._id} className="border-b border-gray-200">
                <td className="py-4">
                  <img
                    src={item.product.images[0].src}
                    alt={item.product.images[0].alt}
                    className="w-20 h-24 object-cover"
                  />
                </td>
                <td className="py-4 text-gray-700">
                  {item.product.productName}
                </td>
                <td className="py-4 text-gray-700">${finalPrice.toFixed(0)}</td>
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
                  ${(finalPrice * item.quantity).toFixed(0)}
                </td>
                <td
                  className="py-4 text-gray-700 cursor-pointer"
                  onClick={() =>
                    removeFromCart(item.product._id, item.variantID)
                  }
                >
                  ×
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Compact Column View for Mobile Screens */}
      <div className="block md:hidden space-y-6">
        {cartItems.map((item) => {
          const selectedVariant = item.product.variants?.find(
            (varient) => varient._id === item.variantID
          );
          const basePrice = item.product.salePrice;
          const extaPrice = selectedVariant?.additionalSalePrice || 0;
          const finalPrice = basePrice + extaPrice;
          return (
            <div
              key={item.product._id}
              className="border-b border-gray-300 py-4 flex flex-col space-y-2"
            >
              {/* Row with image, name, and delete icon */}
              <div className="flex items-center">
                <img
                  src={item.product.images[0].src}
                  alt={item.product.images[0].alt}
                  className="w-20 h-20 object-cover mr-4"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {item.product.productName}
                  </p>
                </div>
                <button
                  className="text-red-500 ml-4"
                  onClick={() =>
                    removeFromCart(item.product._id, item.variantID)
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
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
        })}
      </div>
    </div>
  );
};

export default ProductTable;
