import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../hooks/useCart";
import { ProductCardDataProps } from "@/data/dataProps";

export const useProductSelection = (product: ProductCardDataProps) => {
  const { addToCart } = useCart();
  const router = useRouter();
  const { salePrice, stock, isVariant, variants } = product;

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [availableStock, setAvailableStock] = useState(stock ?? 0);
  const [extraCost, setExtraCost] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [productPrice, setProductPrice] = useState(salePrice ?? 0);
  const [validation, setValidation] = useState({
    colorRequired: false,
    sizeRequired: false,
  });

  useEffect(() => {
    setAvailableStock(stock ?? 0);
    setProductPrice(salePrice ?? 0);
  }, [salePrice, stock]);

  useEffect(() => {
    if (selectedColor && selectedSize) {
      const colorSize = `${selectedSize} - ${selectedColor.trim()}`;
      const selectedVariant = variants?.find((item) => item.name === colorSize);

      if (selectedVariant) {
        setAvailableStock(selectedVariant.stock ?? 0);
        setExtraCost(selectedVariant.additionalSalePrice ?? 0);
        setProductPrice(salePrice + extraCost);
      }
    }
  }, [selectedColor, selectedSize, salePrice, variants, extraCost]);

  const handleAddToCart = useCallback(() => {
    if (isVariant) {
      const colorSize = `${selectedSize} - ${selectedColor.trim()}`;
      const selectedVariant = variants?.find((item) => item.name === colorSize);
      const isColorMissing = !selectedColor;
      const isSizeMissing = !selectedSize;

      if (isColorMissing || isSizeMissing) {
        setValidation((prev) => ({
          ...prev,
          colorRequired: isColorMissing,
          sizeRequired: isSizeMissing,
        }));
        return;
      }

      addToCart({
        product,
        quantity: Math.min(selectedQuantity, availableStock),
        variantID: selectedVariant?._id,
        color: selectedColor.trim(),
        size: selectedSize,
      });
    } else {
      addToCart({
        product,
        quantity: Math.min(selectedQuantity, availableStock),
      });
    }
  }, [
    isVariant,
    selectedSize,
    selectedColor,
    variants,
    addToCart,
    product,
    selectedQuantity,
    availableStock,
  ]);

  const handleCheckout = useCallback(() => {
    if (isVariant && (!selectedColor || !selectedSize)) {
      setValidation((prev) => ({
        ...prev,
        colorRequired: !selectedColor,
        sizeRequired: !selectedSize,
      }));
      return;
    }
    router.push("/pages/cart?section=checkout");
  }, [isVariant, router, selectedColor, selectedSize]);

  const handleQuantityChange = (quantity: number) => {
    setSelectedQuantity(quantity < 0 ? 0 : quantity);
  };

  return {
    setSelectedColor,
    setSelectedSize,
    availableStock,
    productPrice,
    selectedQuantity,
    handleQuantityChange,
    validation,
    setValidation,
    handleAddToCart,
    handleCheckout,
  };
};
