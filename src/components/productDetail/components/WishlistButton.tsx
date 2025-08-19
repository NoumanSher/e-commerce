import { useWishlist } from "@/components/hooks/useWishlist";
import React from "react";
import { Product } from "@/components/productDetail/productDetailDto";
import { FiHeart } from "react-icons/fi";
interface WishlistButtonProps {
  product: Product;
}
const WishlistButton: React.FC<WishlistButtonProps> = ({ product }) => {
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
      <div className="flex gap-x-2 items-center  pb-2 cursor-pointer">
        {isInWishlist(product._id) ? (
          <FiHeart size={20} fill="red" stroke="red" />
        ) : (
          <FiHeart size={20} />
        )}
        <div className="uppercase text-sm font-medium text-opacity-80 text-black">
          {isInWishlist(product._id)
            ? "remove from wishlist"
            : "add to wishlist"}
        </div>
      </div>
    </div>
  );
};
WishlistButton.displayName = "WishlistButton";

export default React.memo(WishlistButton);
