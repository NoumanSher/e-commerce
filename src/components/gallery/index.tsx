// components/ImageGallery.tsx
'use client'
import { useState } from 'react';
import Image from 'next/image';  // Importing Next.js Image

interface ImageGalleryProps {
  images: { src: string, alt: string }[];  // Updated to include 'alt' for accessibility
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full lg:[50%]">
      {/* Thumbnails */}
      <div className="lg:w-1/5 w-full flex lg:flex-col flex-row space-y-2 lg:order-1 order-2">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            width={200}
            height={200}
            className={`cursor-pointer rounded ${index === currentIndex ? 'opacity-100' : 'opacity-50'}`}
            onClick={() => setCurrentIndex(index)}
            priority={index === 0} // Optimize the first image
          />
        ))}
      </div>

      {/* Main Image */}
      <div className="lg:w-4/5 w-full relative lg:order-2 order-1">
        <div className="relative lg:h-[500px] h-[400px] w-full"> {/* Fixed height of 500px */}
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            layout="fill"
            objectFit="cover" // Ensures the image is displayed nicely
            className="rounded"
          />
        </div>

        {/* Navigation Buttons */}
        <button onClick={handlePrev} className="absolute left-0 top-1/2 transform -translate-y-1/2  text-white p-2">
          ⬅️
        </button>
        <button onClick={handleNext} className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white p-2">
          ➡️
        </button>
      </div>
    </div>
  );
};

export default ImageGallery;
