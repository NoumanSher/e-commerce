// pages/index.tsx
import ImageGallery from '@/components/gallery';
import ProductDetails from '@/components/gallery/ProductDetails';
import P1 from '@/assets/img/P4.jpg';
import P2 from '@/assets/img/P5.jpg';
import P3 from '@/assets/img/P6.jpg';

const product = {
  id: '1',
  title: 'Dresses Fully Beaded Gown',
  price: 95.00,
  description: 'Phasellus sed volutpat orci. Fusce eget lorem mauris...',
  images: [
    { src: P1.src, alt: 'Grid Banner 1' },  // Updated to include 'src' and 'alt'
    { src: P2.src, alt: 'Grid Banner 2' },  // Updated to include 'src' and 'alt'
    { src: P3.src, alt: 'Grid Banner 2' },  // Updated to include 'src' and 'alt'
  ],
};

const ProductDetail: React.FC = () => {
  return (
    <div className="flex  flex-col lg:flex-row lg:p-8 p-4 border-2 border-red-500">
      <ImageGallery images={product.images} /> 
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductDetail;
