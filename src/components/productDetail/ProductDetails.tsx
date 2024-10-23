'use client'
import { useState } from "react";
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
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [warning, setWarning] = useState(""); // State for warning messages

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      setWarning("Please select a color and size");
    } else {
      setWarning(""); // Clear the warning when valid selection is made
      // Add to cart logic here
      console.log("Product added to cart");
    }
  };

  const handleCheckout = () => {
    if (!selectedColor || !selectedSize) {
      setWarning("Please select a color and size before proceeding to checkout");
    } else {
      setWarning(""); // Clear the warning when valid selection is made
      // Proceed to checkout logic here
      console.log("Proceeding to checkout");
    }
  };

  return (
    <div className="px-8 pt-2 lg:w-[40%] w-full border-2 border-blue-500">
      <Breadcrumb />
      <ProductBasicInfo
        title={product.title}
        price={product.price}
        description={product.description}
      />

      <SelectColorAndSize
        availableColors={product.availableColors}
        availableSizes={product.availableSizes}
        setSelectedColor={setSelectedColor}
        setSelectedSize={setSelectedSize}
      />

      {warning && (
        <p className="text-red-500 mb-4">{warning}</p>  
      )}

      <div className="flex items-center mt-4 gap-x-4 mb-5">
        <QuantitySelector
          quantity={quantity}
          setQuantity={setQuantity}
          className="h-14"
        />
        <Button
          onClick={handleAddToCart}
          className="rounded-none shadow-none bg-opacity-95 bg-black  border-0 h-14 w-[50%] uppercase py-3 transition-all duration-500 hover:bg-white group hover:border border-black"
        >
          <p className="text-[14px] font-semibold leading-[1.72] group-hover:text-black">
            add to cart
          </p>
        </Button>
      </div>

      <div className="flex gap-x-7 items-center mb-5">
        <WishlistButton
          productId={product.id}
          title={product.title}
          price={product.price}
          image={product.images[0].src}
          quantity={quantity}
          color={selectedColor}
          size={selectedSize}
        />
        <SocialMediaShare />
      </div>

      <ProductMetaInfo
        sku={"n/t4"}
        categories={"dresses,women"}
        tags={"dresses,women"}
      />

      <Tabs />

      <div className="flex justify-center mt-10">
        <CheckOutBtn className="!w-[70%]" onClick={handleCheckout} />
      </div>
    </div>
  );
};

export default ProductInfo;
