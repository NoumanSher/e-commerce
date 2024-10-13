// components/ProductDetails.tsx
'use client'
import { useWishlist } from '@/components/hooks/useWishlist';

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  images: { src: string, alt: string }[];
}

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  return (
    <div className="p-8 w-[45%] border-2 border-blue-500">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <p className="text-lg font-semibold mt-4">${product.price}</p>
      <p className="text-gray-600 mt-2">{product.description}</p>

      {/* Wishlist Button */}
      <button
        className={`mt-4 py-2 px-4 ${isInWishlist ? 'bg-red-500' : 'bg-gray-800'} text-white`}
        onClick={() =>
          isInWishlist ? removeFromWishlist(product.id) : addToWishlist({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.images[0].src
          })
        }
      >
        {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </button>
    </div>
  );
};

export default ProductDetails;
