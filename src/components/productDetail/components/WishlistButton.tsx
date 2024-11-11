import { FaHeart } from "react-icons/fa";
import { useWishlist } from "@/components/hooks/useWishlist";
import React from "react";
import { StaticImageData } from "next/image";
import { ProductCardDataProps } from "@/data/dataProps";
interface WishlistButtonProps {
  product: ProductCardDataProps;
}
const WishlistButton: React.FC<WishlistButtonProps> = ({product}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlistClick = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="btn-link1" onClick={handleWishlistClick}>
      <div className="flex gap-x-2 items-center pb-2 cursor-pointer">
        {isInWishlist(product._id) ? (
          <FaHeart size={20} fill="#FF0000" />
        ) : (
          <FaHeart size={20} fill="white" strokeWidth={20} stroke="black" />
        )}
        <div className="uppercase text-sm font-medium text-opacity-80 text-black">
          {isInWishlist(product._id) ? "remove from wishlist" : "add to wishlist"}
        </div>
      </div>
    </div>
  );
};
WishlistButton.displayName = "WishlistButton";

export default React.memo(WishlistButton);
