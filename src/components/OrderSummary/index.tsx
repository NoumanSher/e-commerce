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
        <span>Product</span>
      </div>

      {section === "checkout" ? (
        <>
          <div className="flex justify-between py-2">
            <span>
              {productDetail?.productName} × {productDetail?.items[0].quantity}
            </span>
            <span>{productDetail?.items[0].price}</span>
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
                <div className="flex justify-between py-2">
                  <span>
                    {item?.product.productName} × {item?.quantity}
                  </span>
                  <span>{item?.product.salePrice}</span>
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
