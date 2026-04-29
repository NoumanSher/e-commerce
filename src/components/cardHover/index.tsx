import { useCartContext } from "@/context/CartContext";
import React, { memo, useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { MdOutlineShoppingBag } from "react-icons/md";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { Product } from "@/components/productDetail/productDetailDto";
import { FiHeart } from "react-icons/fi";

interface ICardHover {
  isHovered: boolean;
  product?: Product;
}
const CardHover = ({ isHovered, product }: ICardHover) => {
  const { setIsCartOpen } = useCartContext();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, removeFromWishlist, addToWishlist } = useWishlist();
  const [isTrue, setIsTrue] = useState(false);
  useEffect(() => {
    if (product?._id) {
      setIsTrue(isInWishlist(product?._id));
    }
  }, [product?._id, isInWishlist]);

  const handleAddToCart = (
    e: React.MouseEvent<HTMLDivElement>, // Use the correct type for the event
    isVariant: boolean
  ) => {
    if (!product) {
      return;
    }
    e.stopPropagation(); // Prevent event bubbling
    e.preventDefault(); // Prevent link navigation

    if (isVariant) {
      // Redirect to product details page if the product has variants
      router.push(`/product-detail/${product.seo.slug}`);
    } else {
      // Add product to cart
      addToCart({ product, quantity: 1 });

      setTimeout(() => {
        setIsCartOpen(true);
      }, 2000);
    }
  };

  const handleAddToWishlist = (e: { stopPropagation: () => void; preventDefault: () => void }) => {
    e.stopPropagation();
    e.preventDefault();
    if (product) addToWishlist(product);
  };

  const handleRemoveFromWishlist = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (product) removeFromWishlist(product?._id);
  };

  return (
    <div>
      <div
        className={`absolute bottom-[10px] mb-2 flex justify-center w-full gap-2 transition-all duration-300 ease-in-out transform ${isHovered
            ? "opacity-100 visible translate-y-[-10px]"
            : "opacity-0 invisible translate-y-5"
          }`}
      >
        <div
          onClick={(e) => handleAddToCart(e, product?.isVariant as boolean)}
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
          {isTrue ? (
            <FiHeart size={20} fill="red" stroke="red" />
          ) : (
            <FiHeart size={20} />
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CardHover);
