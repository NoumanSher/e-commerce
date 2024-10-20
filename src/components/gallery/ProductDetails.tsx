// components/ProductDetails.tsx
"use client";
import { useWishlist } from "@/components/hooks/useWishlist";
import QuantitySelector from "@/components/gallery/QuantitySelector";
import { useState } from "react";
// import Select from "@/components/Select/select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  images: { src: string; alt: string }[];
  availableColors: string[]; // Array of available colors
  availableSizes: string[]; // Array of available sizes
}

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.availableColors[0]
  ); // Default to the first color
  const [selectedSize, setSelectedSize] = useState(product.availableSizes[0]); // Default to the first size
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  return (
    <div className="p-8 lg:w-[40%] w-full border-2 border-blue-500">
      <h1 className="text-2xl font-medium">{product.title}</h1>
      <p className="text-lg font-medium mt-4">${product.price}</p>
      <p className="text-gray-600 mt-2">{product.description}</p>

      <div className="flex justify-between mt-3 gap-3">
      <Select>
      <SelectTrigger className="flex-1 h-12 rounded-none">
        <SelectValue placeholder="Select color" />
      </SelectTrigger>
      <SelectContent className="rounded-none">
        <SelectGroup>
          <SelectLabel>Color</SelectLabel>
          {product.availableColors.map((color, index) => (
            <SelectItem key={index} value={color.toLowerCase()}>
              {color}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
      <Select>
      <SelectTrigger className="flex-1 h-12 rounded-none">
        <SelectValue placeholder="Select size" />
      </SelectTrigger>
      <SelectContent className="rounded-none">
        <SelectGroup>
          <SelectLabel>Size</SelectLabel>
          {product.availableSizes.map((size, index) => (
            <SelectItem key={index} value={size.toLowerCase()}>
              {size}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
        {/* <Select
          label="Size"
          options={product.availableSizes}
          selectedOption={selectedSize}
          setSelectedOption={setSelectedSize}
          className="flex-1"

        /> */}
      </div>

      <div className="flex items-center mt-4">
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
      </div>

      {/* Wishlist Button */}
      <button
        className={`mt-4 py-2 px-4 ${
          isInWishlist ? "bg-red-500" : "bg-gray-800"
        } text-white`}
        onClick={() =>
          isInWishlist
            ? removeFromWishlist(product.id)
            : addToWishlist({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.images[0].src,
                quantity: quantity,
                color: selectedColor, 
                size: selectedSize,
              })
        }
      >
        {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      </button>
    </div>
  );
};

export default ProductDetails;
