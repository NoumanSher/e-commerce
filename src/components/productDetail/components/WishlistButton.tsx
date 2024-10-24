import { FaHeart } from "react-icons/fa";
import { useWishlist } from "@/components/hooks/useWishlist";
import React from "react";

interface WishlistButtonProps {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
  size: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  title,
  price,
  image,
  quantity,
  color,
  size,
}) => {
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const isInWishlist = React.useMemo(() => wishlist.some((item) => item.id === productId), [wishlist, productId]);

  const handleWishlistClick = () => {
    if (isInWishlist) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        id: productId,
        title,
        price,
        image,
        quantity,
        color,
        size,
      });
    }
  };

  return (
    <div className="btn-link1" onClick={handleWishlistClick}>
      <div className="flex gap-x-2 items-center pb-2 cursor-pointer">
        {isInWishlist ? (
          <FaHeart size={20} fill="#FF0000" />
        ) : (
          <FaHeart size={20} fill="white" strokeWidth={20} stroke="black" />
        )}
        <div className="uppercase text-sm font-medium text-opacity-80 text-black">
          {isInWishlist ? "remove from wishlist" : "add to wishlist"}
        </div>
      </div>
    </div>
  );
};

export default React.memo(WishlistButton);
