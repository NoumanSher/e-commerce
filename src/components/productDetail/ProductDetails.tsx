"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import QuantitySelector from "@/components/productDetail/components/QuantitySelector";
import WhatsAppButton from "@/components/productDetail/components/WhatsAppButton";
import SelectColorAndSize from "./components/SelectVarient";
import WishlistButton from "./components/WishlistButton";
import ProductMetaInfo from "./components/ProductMetaInfo";
import ProductBasicInfo from "./components/ProductBasicInfo";
import CheckOutBtn from "./components/CheckOutBtn";
import Tabs from "./components/DialogModal";
// import Breadcrumb from "./components/Breadcrumb";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Product } from "./productDetailDto";
import { useStore } from "@/Context/storeContext";
import { useCart } from "../hooks/useCart";
const SocialMediaShareWithNoSSR = dynamic(
  () => import("./components/SocialMediaShare"),
  { ssr: false }
);

interface ProductDetailsProps {
  product: Product;
}

const ProductInfo: React.FC<ProductDetailsProps> = ({ product }) => {
  const { updateProductDetailtData, userId } = useStore();
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
  } = product;

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVarientId, setSelectedVarientId] = useState("");
  const [availableStock, SetAvailabelStock] = useState<number>(0);
  const [extraCost, SetExtraCost] = useState<number>(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [productPrice, SetProductPrice] = useState<number>(0);

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
      SetProductPrice(salePrice);
    }
  }, [salePrice, stock]);

  useEffect(() => {
    if (selectedColor && selectedSize) {
      const colorSize = `${selectedColor.trim()} - ${selectedSize}`; // Ensure correct format
      const selectVariat = variants?.find((item) => item.name === colorSize);
      if (selectVariat?._id) {
        setSelectedVarientId(selectVariat._id);
      }
      SetAvailabelStock(
        selectVariat?.stock !== undefined && selectVariat.stock > 0
          ? selectVariat.stock
          : 0
      );

      SetExtraCost(selectVariat?.additionalSalePrice ?? 0);
      SetProductPrice(salePrice + extraCost);
    }
  }, [selectedColor, selectedSize, salePrice, variants, extraCost]);
  const handleAddToCart = useCallback(() => {
    if (isVariant) {
      const colorSize = `${selectedColor.trim()} - ${selectedSize}`;
      const selectVariat = variants?.find((item) => item.name === colorSize);
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

  // Handle Checkout logic
  const handleCheckout = useCallback(() => {
    if (isVariant) {
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
    }

    let dataToPass = {
      productName: productName,
      userId: userId,
      productId: _id,
      items: [
        {
          productId: _id,
          variantId: selectedVarientId,
          price: productPrice,
          quantity: selectedQuantity,
          lineTotal: productPrice * selectedQuantity,
        },
      ],

      deliveryFee: 0,
      totalPrice: productPrice * selectedQuantity,
      subTotal: productPrice * selectedQuantity,
    };
    updateProductDetailtData(dataToPass);

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
    updateProductDetailtData,
    userId,
  ]);

  const colors = options ? (options[0]?.values ?? []) : [];
  const sizes = options ? (options[1]?.values ?? []) : [];
  const handleQuantityChange = (quantity: number) => {
    if (quantity < 0) {
      setSelectedQuantity(0);
      SetAvailabelStock(0);
    }
    setSelectedQuantity(quantity);
  };
  return (
    <div className="lg:px-8 pt-2 lg:w-[40%] flex flex-col   w-full">
      {/* <Breadcrumb /> */}
      <ProductBasicInfo
        title={productName}
        stockAvailability={availableStock}
        price={Number(productPrice)}
        description={description}
      />
      {colors.length > 0 && (
        <SelectColorAndSize
          availableColors={colors}
          availableSizes={sizes}
          setSelectedColor={setSelectedColor}
          setSelectedSize={setSelectedSize}
          validation={validation}
          setValidation={setValidation}
        />
      )}

      <div className="flex md:items-center justify-between md:justify-normal mt-4 gap-x-4 mb-5">
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
        <Button
          onClick={handleAddToCart}
          className="rounded-none shadow-none bg-opacity-95 bg-black border-0 h-14 w-[50%] uppercase py-3 transition-all duration-500 hover:bg-white group hover:border border-black"
        >
          <p className="text-[14px] font-semibold leading-[1.72] group-hover:text-black">
            add to cart
          </p>
        </Button>
      </div>

      <div className="flex gap-x-7 items-center mb-5">
        <WishlistButton product={product} />
        <SocialMediaShareWithNoSSR />
      </div>

      <ProductMetaInfo
        sku={sku}
        categories={parentCategoryName}
        tags={childCategoryName}
      />

      <Tabs />

      <div className="lg:mt-auto  sticky bottom-0">
        <CheckOutBtn
          availableStock={availableStock}
          className="!w-[100%]"
          onClick={handleCheckout}
          selectedQuantity={selectedQuantity}
        />
      </div>
      <WhatsAppButton
        product={{
          name: productName,
          price: productPrice,
          sku: sku,
          size: selectedSize,
          color: selectedColor,
          url: `https://e-commerce-pink-iota.vercel.app/product-detail/${_id}`,
        }}
      />
    </div>
  );
};

export default ProductInfo;
