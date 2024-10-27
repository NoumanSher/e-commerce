import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface Product {
  id: number;
  productImageUrl: string;
  productTitle: string;
  productColor: string;
  productSize: string;
  productQuantity: number;
  productPrice: number;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
  removeProduct: (id: number) => void;
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  const router = useRouter()
  const subtotal = products.reduce(
    (total, product) => total + product.productPrice * product.productQuantity,
    0
  );
  const totalQuantity = products.reduce(
    (total, product) => total + product.productQuantity,
    0
  );

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpen]);

  return (
    <>
      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Shopping Cart Modal */}
      <div
        className={`fixed top-0 right-0 w-full sm:w-[25rem] h-full bg-white shadow-lg z-50 transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-[#faf9f8] p-6 border-b">
          <h2 className="text-lg font-bold">
            Shopping Cart <span className="text-sm">({totalQuantity})</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 text-4xl hover:text-black"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div key={index}>
                {/* Product Item */}
                <div className="flex h-32 items-center mb-4">
                  <img
                    src={product.productImageUrl}
                    alt={product.productTitle}
                    className="w-[7rem] h-[7rem] object-cover"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="font-semibold">{product.productTitle}</h3>
                    <p className="text-sm text-gray-500">
                      Color: {product.productColor}
                    </p>
                    <p className="text-sm text-gray-500">
                      Size: {product.productSize}
                    </p>
                    <div className="flex mt-2 items-center">
                      <button
                        className="px-2 py-1"
                        onClick={() => product.decrementQuantity(product.id)}
                      >
                        -
                      </button>
                      <span className="mx-2">{product.productQuantity}</span>
                      <button
                        className="px-2 py-1"
                        onClick={() => product.incrementQuantity(product.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col py-[14px] justify-between h-full">
                    <button
                      onClick={() => product.removeProduct(product.id)}
                      className="text-red-500 text-xl hover:text-red-700"
                    >
                      &times;
                    </button>
                    <p className="font-bold">${product.productPrice}</p>
                  </div>
                </div>

                {/* Separator Line */}
                {index < products.length - 1 && (
                  <hr className="border-t border-gray-300 my-4 " />
                )}
              </div>
            ))
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-bold">Subtotal:</span>
            <span className="font-bold">${subtotal.toFixed(2)}</span>
          </div>
          <button className="w-full bg-gray-800 text-white py-2 rounded-md mb-2" onClick={() => router.push('/pages/cart?section=shoppingbag')}>
            View Cart
          </button>
          <button className="w-full bg-blue-600 text-white py-2 rounded-md" onClick={() => router.push('/pages/cart?section=checkout')}>
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
