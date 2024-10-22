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
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CiHeart } from "react-icons/ci";
import { PiShareNetworkThin } from "react-icons/pi";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { FaHeart } from "react-icons/fa";
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
          <SelectTrigger className="flex-1 h-14 rounded-none">
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
          <SelectTrigger className="flex-1 h-14 rounded-none">
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
      </div>

      <div className="flex items-center mt-4 gap-x-3">
        <QuantitySelector
          quantity={quantity}
          setQuantity={setQuantity}
          className="h-14"
        />
        <Button
          className="rounded-none shadow-none bg-opacity-95 bg-black  border-0 h-14 w-[45%] uppercase py-3 transition-all duration-500 hover:bg-white group hover:border border-black"
          size={"lg"}
        >
          <p className="text-[14px] font-semibold leading-[1.72]  group-hover:text-black">
            add to cart
          </p>{" "}
        </Button>
      </div>

      {/* Wishlist Button */}
      {/* <button
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
      </button> */}
      <div className="flex gap-x-7 items-center  mt-4">
        <div className="btn-link1">
          <div
            className="flex gap-x-2 items-center pb-2 cursor-pointer"
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
            {isInWishlist ? (
              <FaHeart
                size={20}
                width={20}
                title="add to click save"
                fill="#FF0000"
              />
            ) : (
              <FaHeart
                strokeWidth={"13px"}
                size={20}
                color="black"
                title="add to click save"
                fill="white"
                stroke="black"
              />
            )}

            <div className="uppercase text-sm font-medium text-opacity-80 text-black">
              add to wishtlist
            </div>
          </div>
        </div>

        <HoverCard openDelay={100}>
          <HoverCardTrigger className="group cursor-pointer">
            <div className="flex gap-x-2 items-center pb-2">
              <PiShareNetworkThin
                className="group-hover:text-rose-800 "
                size={20}
                title="share with your love"
              />
              <p className="uppercase group-hover:text-rose-800 text-sm font-medium">
                share
              </p>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="flex flex-col w-32">
            <a href="http://" className="hover:text-rose-800">
              Facebook
            </a>
            <a href="http://" className="hover:text-rose-800">
              Twitter
            </a>
            <a href="http://" className="hover:text-rose-800">
              Linkedin
            </a>
            <a href="http://" className="hover:text-rose-800">
              Pinterest
            </a>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
};

export default ProductDetails;
