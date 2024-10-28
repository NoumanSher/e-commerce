"use client";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import QuantitySelector from "@/components/productDetail/components/QuantitySelector";
import SelectColorAndSize from "./components/SelectVarient";
import WishlistButton from "./components/WishlistButton";
import SocialMediaShare from "./components/SocialMediaShare";
import ProductMetaInfo from "./components/ProductMetaInfo";
import ProductBasicInfo from "./components/ProductBasicInfo";
import CheckOutBtn from "./components/CheckOutBtn";
import Tabs from "./components/Tabs";
import Breadcrumb from "./components/Breadcrumb";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  images: { src: string; alt: string }[];
  availableColors: string[];
  availableSizes: string[];
}

interface ProductDetailsProps {
  product: Product;
}

const ProductInfo: React.FC<ProductDetailsProps> = ({ product }) => {
  const { id, title, price, description, images, availableColors, availableSizes } = product;

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [validation, setValidation] = useState({
    colorRequired: false,
    sizeRequired: false,
  });
const router = useRouter()
  // Handle Add to Cart logic
  const handleAddToCart = useCallback(() => {
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

    // Proceed with add to cart logic
  }, [selectedColor, selectedSize]);

  // Handle Checkout logic
  const handleCheckout = useCallback(() => {
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

router.push('/pages/cart?section=checkout')
    // Proceed with checkout logic
  }, [router, selectedColor, selectedSize]);

  return (
    <div className="lg:px-8 pt-2 lg:w-[40%]  w-full border-2 border-blue-500">
      <Breadcrumb />
      <ProductBasicInfo title={title} price={price} description={description} />

      {/* <SelectColorAndSize
        availableColors={availableColors}
        availableSizes={availableSizes}
        setSelectedColor={setSelectedColor}
        setSelectedSize={setSelectedSize}
        validation={validation}
        setValidation={setValidation}
      /> */}

      <div className="flex md:items-center justify-between md:justify-normal mt-4 gap-x-4 mb-5">
        {/* <QuantitySelector
          quantity={quantity}
          setQuantity={setQuantity}
          className="h-14"
        /> */}
        {/* <Button
          onClick={handleAddToCart}
          className="rounded-none shadow-none bg-opacity-95 bg-black border-0 h-14 w-[50%] uppercase py-3 transition-all duration-500 hover:bg-white group hover:border border-black"
        >
          <p className="text-[14px] font-semibold leading-[1.72] group-hover:text-black">
            add to cart
          </p>
        </Button> */}
      </div>

      <div className="flex gap-x-7 items-center mb-5">
        {/* <WishlistButton
          productId={id}
          title={title}
          price={price}
          image={images[0].src}
          quantity={quantity}
          color={selectedColor}
          size={selectedSize}
        /> */}
        {/* <SocialMediaShare /> */}
      </div>

      {/* <ProductMetaInfo sku="n/t4" categories="dresses,women" tags="dresses,women" /> */}

      {/* <Tabs /> */}

      <div className="flex justify-center mt-5">
        <CheckOutBtn className="!w-[100%]" onClick={handleCheckout} />
      </div>
    </div>
  );
};

export default ProductInfo;
