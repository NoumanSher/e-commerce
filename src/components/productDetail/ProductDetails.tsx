"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import QuantitySelector from "@/components/productDetail/components/QuantitySelector";
import WhatsAppButton from "@/components/productDetail/components/WhatsAppButton";
import SelectColorAndSize from "./components/SelectVarient";
import WishlistButton from "./components/WishlistButton";
import ProductMetaInfo from "./components/ProductMetaInfo";
import ProductBasicInfo from "./components/ProductBasicInfo";
import CheckOutBtn from "./components/CheckOutBtn";
import Tabs from "./components/DialogModal";
import MobileActionBar from "./components/MobileActionBar";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Product } from "./productDetailDto";
import { useAppUIContext } from "@/context/AppUIContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { calculateDiscountedPrice } from "@/lib/utils";
const SocialMediaShareWithNoSSR = dynamic(
  () => import("./components/SocialMediaShare"),
  { ssr: false, loading: () => <div className="h-10 w-20  animate-pulse rounded-lg bg-gray-300" /> }
);

interface ProductDetailsProps {
  product: Product;
  onGalleryHandlersReady?: (handlers: {
    handleAddToCart: () => void;
    handleCheckout: () => void;
    availableStock: number;
  }) => void;
  onReviewClick?: () => void;
}

const ProductInfo: React.FC<ProductDetailsProps> = ({ product, onGalleryHandlersReady, onReviewClick }) => {
  const { updateProductDetailData } = useAppUIContext();
  const { userId } = useAuth();
  const { addToCart } = useCart();
  const {
    _id,
    productName,
    salePrice,
    description,
    options,
    isVariant,
    stock,
    variants,
    sku,
    parentCategoryName,
    childCategoryName,
    discount,
    seo
  } = product;

  const colors = useMemo(() => {
    if (!options) return [];
    const opt = options.find((o) => o.title.toLowerCase() === "color");
    return opt?.values ?? [];
  }, [options]);

  const sizes = useMemo(() => {
    if (!options) return [];
    const opt = options.find((o) => o.title.toLowerCase() === "size");
    return opt?.values ?? [];
  }, [options]);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVarientId, setSelectedVarientId] = useState("");
  const [availableStock, SetAvailabelStock] = useState<number>(stock < 0 ? 0 : stock || 0);
  const [extraCost, SetExtraCost] = useState<number>(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [productPrice, SetProductPrice] = useState<number>(calculateDiscountedPrice(salePrice, discount || 0) || 0);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [validation, setValidation] = useState({
    colorRequired: false,
    sizeRequired: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (stock) {
      SetAvailabelStock(stock < 0 ? 0 : stock);
    }
    if (salePrice) {
      // Initialize with discounted base price
      const initialPrice = calculateDiscountedPrice(salePrice, discount || 0);
      SetProductPrice(initialPrice);
    }
  }, [salePrice, stock, discount]);

  useEffect(() => {
    let variantName = "";
    if (colors.length > 0 && sizes.length > 0) {
      if (selectedColor && selectedSize) {
        variantName = `${selectedColor.trim()} - ${selectedSize}`;
      }
    } else if (colors.length > 0) {
      if (selectedColor) variantName = selectedColor.trim();
    } else if (sizes.length > 0) {
      if (selectedSize) variantName = selectedSize.trim();
    }

    if (variantName) {
      const selectVariat = variants?.find(
        (item) => item.name.toLowerCase().trim() === variantName.toLowerCase().trim()
      );
      if (selectVariat?._id) {
        setSelectedVarientId(selectVariat._id);
      }
      SetAvailabelStock(
        selectVariat?.stock !== undefined ? (selectVariat.stock > 0 ? selectVariat.stock : 0) : 0
      );

      const newExtraCost = selectVariat?.additionalSalePrice ?? 0;
      SetExtraCost(newExtraCost);
      const basePlusExtra = salePrice + newExtraCost;
      const finalPrice = calculateDiscountedPrice(basePlusExtra, discount || 0);
      SetProductPrice(finalPrice);
    } else if (!isVariant) {
      // For non-variant products, ensure discount is applied to base price
      const finalPrice = calculateDiscountedPrice(salePrice, discount || 0);
      SetProductPrice(finalPrice);
    }
  }, [selectedColor, selectedSize, salePrice, discount, variants, colors.length, sizes.length, isVariant]);
  const handleAddToCart = useCallback(() => {
    setIsAddingToCart(true);
    if (isVariant) {
      let variantName = "";
      if (colors.length > 0 && sizes.length > 0) {
        variantName = `${selectedColor.trim()} - ${selectedSize}`;
      } else if (colors.length > 0) {
        variantName = selectedColor.trim();
      } else if (sizes.length > 0) {
        variantName = selectedSize.trim();
      }
      const selectVariat = variants?.find(
        (item) => item.name.toLowerCase().trim() === variantName.toLowerCase().trim()
      );
      const isColorMissing = colors.length > 0 && !selectedColor;
      const isSizeMissing = sizes.length > 0 && !selectedSize;

      if (isColorMissing || isSizeMissing) {
        const el = document.getElementById('select-varient');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setValidation((prev) => ({
          ...prev,
          colorRequired: isColorMissing,
          sizeRequired: isSizeMissing,
        }));
        setIsAddingToCart(false);
        return;
      }
      addToCart({
        product,
        quantity:
          selectedQuantity > availableStock ? availableStock : selectedQuantity,
        variantID: selectVariat?._id,
        color: selectedColor.trim(),
        size: selectedSize,
      });
    } else {
      addToCart({
        product,
        quantity:
          selectedQuantity > availableStock ? availableStock : selectedQuantity,
      });
    }
    setTimeout(() => setIsAddingToCart(false), 500);
  }, [
    isVariant,
    selectedSize,
    selectedColor,
    variants,
    addToCart,
    product,
    selectedQuantity,
    availableStock,
    colors.length,
    sizes.length
  ]);

  // Handle Checkout logic
  const handleCheckout = useCallback(() => {
    setIsCheckingOut(true);
    if (isVariant) {
      const isColorMissing = colors.length > 0 && !selectedColor;
      const isSizeMissing = sizes.length > 0 && !selectedSize;

      if (isColorMissing || isSizeMissing) {
        const el = document.getElementById('select-varient');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setValidation((prev) => ({
          ...prev,
          colorRequired: isColorMissing,
          sizeRequired: isSizeMissing,
        }));
        setIsCheckingOut(false);
        return;
      }
    }

    let variantName = "";
    if (isVariant) {
      if (colors.length > 0 && sizes.length > 0) {
        variantName = `${selectedColor.trim()} - ${selectedSize}`;
      } else if (colors.length > 0) {
        variantName = selectedColor.trim();
      } else if (sizes.length > 0) {
        variantName = selectedSize.trim();
      }
    }

    let dataToPass = {
      productName: productName,
      userId: userId,
      productId: _id,
      items: [
        {
          productId: _id,
          variantId: selectedVarientId,
          variantName: variantName,
          price: productPrice, // already discounted in state
          quantity: selectedQuantity,
          lineTotal: productPrice * selectedQuantity,
        },
      ],

      deliveryFee: 0,
      totalPrice: productPrice * selectedQuantity,
      subTotal: productPrice * selectedQuantity,
    };
    updateProductDetailData(dataToPass);

    router.push("/cart?section=checkout");
    // Proceed with checkout logic
  }, [
    _id,
    isVariant,
    productName,
    productPrice,
    router,
    selectedColor,
    selectedQuantity,
    selectedSize,
    selectedVarientId,
    updateProductDetailData,
    userId,
    colors.length,
    sizes.length
  ]);


  const handleQuantityChange = (quantity: number) => {
    if (quantity < 0) {
      setSelectedQuantity(0);
      SetAvailabelStock(0);
    }
    setSelectedQuantity(quantity);
  };

  // Notify parent when handlers are ready
  useEffect(() => {
    if (onGalleryHandlersReady) {
      onGalleryHandlersReady({
        handleAddToCart,
        handleCheckout,
        availableStock,
      });
    }
  }, [onGalleryHandlersReady, handleAddToCart, handleCheckout, availableStock]);

  return (
    <>
      <div className="lg:pl-8 pt-2 lg:w-[40%] flex flex-col w-full">
        <ProductBasicInfo
          title={productName}
          stockAvailability={availableStock}
          price={productPrice}
          description={description}
          discount={discount}
        />

        {/* Mobile: Quick Actions Header (Moved below Product Info) */}
        <div className="lg:hidden flex items-center justify-between mb-3 px-2 pt-2 border-t border-gray-100">
          <WishlistButton product={product} />
          <button className="pb-2 text-sm font-medium text-opacity-80 text-black" onClick={onReviewClick}>Reviews ⭐</button>
          <SocialMediaShareWithNoSSR
            url={`https://www.pakshipper.com/product-detail/${seo.slug}`}
          />
        </div>

        {(colors.length > 0 || sizes.length > 0) && (
          <SelectColorAndSize
            availableColors={colors}
            availableSizes={sizes}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            variants={variants}
            setSelectedColor={setSelectedColor}
            setSelectedSize={setSelectedSize}
            validation={validation}
            setValidation={setValidation}
          />
        )}

        {/* Desktop: Original Layout */}
        <div className="hidden lg:flex md:items-center justify-between md:justify-normal gap-x-3 mb-4">
          {availableStock > 0 && (
            <QuantitySelector
              className="h-14"
              quantity={
                selectedQuantity > availableStock
                  ? availableStock
                  : selectedQuantity
              }
              stock={availableStock}
              onQuantityChange={handleQuantityChange}
            />
          )}
          <Button
            onClick={handleAddToCart}
            disabled={availableStock === 0}
            loading={isAddingToCart}
            className={`rounded-none shadow-none h-14 flex-1 uppercase py-3 transition-all duration-300 group ${
              availableStock === 0
                ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-black border-2 border-black hover:bg-gray-100"
            }`}
          >
            <p className="text-[14px] font-semibold leading-[1.72]">
              {availableStock === 0 ? "Sold Out" : "add to cart"}
            </p>
          </Button>
          {/* Desktop: Sticky Checkout Button */}
          <div className="hidden lg:block flex-1">
            <CheckOutBtn
              availableStock={availableStock}
              className="flex-1 !w-full"
              onClick={handleCheckout}
              selectedQuantity={selectedQuantity}
              loading={isCheckingOut}
            />
          </div>
        </div>

        {/* Desktop: Social and Wishlist */}
        <div className="hidden lg:flex gap-x-7 items-center mb-3">
          <WishlistButton product={product} />

          <SocialMediaShareWithNoSSR
            url={`https://www.pakshipper.com/product-detail/${seo.slug}`}
          />
        </div>

        <ProductMetaInfo
          sku={sku}
          categories={parentCategoryName}
          tags={childCategoryName}
        />

        <Tabs />

        <WhatsAppButton
          product={{
            name: productName,
            price: productPrice,
            sku: sku,
            size: selectedSize,
            color: selectedColor,
            url: `https://www.pakshipper.com/product-detail/${seo.slug}`,
          }}
        />
      </div>

      {/* Mobile: Sticky Bottom Action Bar */}
      <MobileActionBar
        availableStock={availableStock}
        selectedQuantity={selectedQuantity}
        onQuantityChange={handleQuantityChange}
        onAddToCart={handleAddToCart}
        onCheckout={handleCheckout}
        isCheckingOut={isCheckingOut}
        isAddingToCart={isAddingToCart}
      />
    </>
  );
};

export default ProductInfo;
