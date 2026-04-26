"use client";
import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import QuantitySelector from "./QuantitySelector";

interface MobileActionBarProps {
    availableStock: number;
    selectedQuantity: number;
    onQuantityChange: (quantity: number) => void;
    onAddToCart: () => void;
    onCheckout: () => void;
    isCheckingOut?: boolean;
    isAddingToCart?: boolean;
}

const MobileActionBar: React.FC<MobileActionBarProps> = memo(({
    availableStock,
    selectedQuantity,
    onQuantityChange,
    onAddToCart,
    onCheckout,
    isCheckingOut = false,
    isAddingToCart = false,
}) => {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
            <div className="px-3 py-2.5 sm:px-4 sm:py-3">
                {/* Action Buttons */}
                <div className="flex gap-2 sm:gap-3">
                    {/* Quantity Selector */}
                    {availableStock > 0 && (
                        <div className="">
                            <QuantitySelector
                                className="h-11 sm:h-12 text-sm flex-1"
                                quantity={selectedQuantity > availableStock ? availableStock : selectedQuantity}
                                stock={availableStock}
                                onQuantityChange={onQuantityChange}
                            />
                        </div>
                    )}

                    {/* Add to Cart Button */}
                    <Button
                        onClick={onAddToCart}
                        disabled={availableStock === 0}
                        loading={isAddingToCart}
                        className="flex-1 h-11 sm:h-12 bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-100 font-semibold rounded-lg transition-colors disabled:border-gray-300 disabled:text-gray-300 disabled:bg-white disabled:cursor-not-allowed px-3 sm:px-4"
                    >
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>

                    {/* Buy Now Button */}
                    <Button
                        onClick={onCheckout}
                        disabled={availableStock === 0}
                        loading={isCheckingOut}
                        className="flex-1 h-11 sm:h-12 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-xs sm:text-sm px-3 sm:px-4"
                    >
                        {availableStock === 0 ? "Sold Out" : "Buy Now"}
                    </Button>
                </div>
            </div>
        </div>
    );
});

MobileActionBar.displayName = "MobileActionBar";

export default MobileActionBar;
