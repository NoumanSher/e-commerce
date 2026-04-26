import React from "react";
import { useStore } from "@/context/storeContext";
import { useSearchParams } from "next/navigation";
import { useCart } from "../hooks/useCart";
const OrderSummaryComponent: React.FC = () => {
  const searchParams = useSearchParams(); // Access query parameters
  const section = searchParams.get("section"); // Get 'section' param
  const { productDetail } = useStore();
  const { cartItems, subTotal, totalCost } = useCart();
  return (
    <div className="p-4 border rounded mb-4">
      <h2 className="text-xl font-bold mb-4">Your Order</h2>
      <div className="flex justify-between text-gray-700 border-b py-2">
        <span>{cartItems.length > 1 ? "Items" : "Item"}</span>
      </div>

      {section === "checkout" ? (
        <>
          <div className="flex flex-col py-2">
            <div className="flex justify-between">
              <span className="flex-1 pr-4">
                {productDetail?.productName} × {productDetail?.items[0].quantity}
              </span>
              <span className="shrink-0 font-medium">{productDetail?.items[0].price}</span>
            </div>
            {productDetail?.items[0].variantName && (
              <span className="text-xs text-gray-400 uppercase font-medium">
                Variant: {productDetail.items[0].variantName}
              </span>
            )}
          </div>
          <div className="flex justify-between text-gray-700 border-t border-b py-2 font-semibold">
            <span>Subtotal</span>
            <span>
              {(productDetail?.items[0].price ?? 0) *
                (productDetail?.items[0].quantity ?? 0)}
            </span>
          </div>
          <div className="py-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="shipping"
                defaultChecked
                className="form-radio"
              />
              <span>Free shipping</span>
            </label>
          </div>
          <div className="flex justify-between text-xl font-bold mt-4">
            <span>Total</span>
            <span>
              {(productDetail?.items[0].price ?? 0) *
                (productDetail?.items[0].quantity ?? 0)}
            </span>
          </div>
        </>
      ) : (
        <div>
          {cartItems.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <div className="flex flex-col py-2 border-b border-gray-50 last:border-0">
                  <div className="flex justify-between">
                    <span className="flex-1 pr-4">
                      {item?.product.productName} × {item?.quantity}
                    </span>
                    <span className="shrink-0 font-medium">
                      {item?.product.discount > 0
                        ? Math.round((item.product.salePrice + (item.product.variants?.find(v => v._id === item.variantID)?.additionalSalePrice || 0)) * (1 - item.product.discount / 100))
                        : item?.product.salePrice + (item.product.variants?.find(v => v._id === item.variantID)?.additionalSalePrice || 0)
                      }
                    </span>
                  </div>
                  {item.variantID && (
                    <span className="text-xs text-gray-400 uppercase font-medium">
                      Variant: {item.product.variants?.find(v => v._id === item.variantID)?.name}
                    </span>
                  )}
                </div>
              </React.Fragment>
            );
          })}
          <div className="flex justify-between text-gray-700 border-t border-b py-2 font-semibold">
            <span>Subtotal</span>
            <span>{subTotal}</span>
          </div>
          <div className="py-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="shipping"
                defaultChecked
                className="form-radio"
              />
              <span>Free shipping</span>
            </label>
          </div>
          <div className="flex justify-between text-xl font-bold mt-4">
            <span>Total</span>
            <span>{totalCost}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummaryComponent;
