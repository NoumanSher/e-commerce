import { useStore } from "@/Context/storeContext";
import React, { memo, useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { MdOutlineShoppingBag } from "react-icons/md";
import { useWishlist } from "../hooks/useWishlist";
import { ProductCardDataProps } from "@/data/dataProps";
import { HeartIcon } from "@/assets/svg/common";

interface ICardHover {
  isHovered: boolean;
  product?: ProductCardDataProps;
}
const CardHover = ({ isHovered, product }: ICardHover) => {
  const { setIsCartOpen } = useStore();
  const { isInWishlist, removeFromWishlist, addToWishlist } = useWishlist();
  const [isTrue, setIsTrue] = useState(false);

  useEffect(() => {
    if (product?._id) {
      setIsTrue(isInWishlist(product._id));
    }
  }, [product, isInWishlist]);

  const handleAddToCart = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setIsCartOpen(true);
  };

  const handleAddToWishlist = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (product) addToWishlist(product);
  };

  const handleRemoveFromWishlist = (e: any) => {
    e.stopPropagation();
    if (product) removeFromWishlist(product?._id);
  };

  return (
    <div>
      <div
        className={`absolute bottom-[10px] mb-2 flex justify-center w-full gap-2 transition-all duration-300 ease-in-out transform ${
          isHovered
            ? "opacity-100 visible translate-y-[-10px]"
            : "opacity-0 invisible translate-y-5"
        }`}
      >
        <div
          onClick={handleAddToCart}
          className="w-[40px] h-[40px] cursor-pointer rounded-[50%] bg-white flex justify-center items-center"
        >
          <MdOutlineShoppingBag />
        </div>
        <div className="w-[40px] h-[40px] cursor-pointer rounded-[50%] bg-white flex justify-center items-center">
          <FiEye />
        </div>
        <div
          onClick={isTrue ? handleRemoveFromWishlist : handleAddToWishlist}
          className="unselectable w-[40px] h-[40px] cursor-pointer rounded-[50%] bg-white flex justify-center items-center"
        >
          {isTrue ? "❤️" : <HeartIcon className="h-[17px] w-[17px]"  />}
        </div>
      </div>
    </div>
  );
};

export default memo(CardHover); 
