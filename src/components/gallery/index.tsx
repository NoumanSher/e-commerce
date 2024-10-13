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
    <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-[65%] border-2 border-green-500">
      {/* Thumbnails */} 
      <div className="overflow-x-auto  flex lg:flex-col flex-row space-y-2 lg:order-1 order-2">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            width={160}
            // layout="fill" // Use layout="fill" to fill the thumbnail container
            objectFit="cover" // Ensure the image covers the container and keeps its aspect ratio
            height={160}
            // sizes='(max-width:160px), 100vw,160px'
            className={`cursor-pointer h-[100px] aspect-square w-[100px] lg:h-[120px] overflow-clip lg:w-[120px] rounded ${index === currentIndex ? 'opacity-100' : 'opacity-50'}`}
            onClick={() => setCurrentIndex(index)}
            priority={index === 0} 
          />
        ))}
      </div>

      {/* Main Image */}
      <div className="lg:w-[82%] w-full relative lg:order-2 order-1">
        <div className="relative lg:h-[600px] h-[400px] w-full"> 
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            layout="fill"
            objectFit="cover" // Ensures the image is displayed nicely
            className="rounded"
          />
        </div>

        {/* Navigation Buttons */}
        <button onClick={handlePrev} className="absolute -left-[20px] lg:left-0 -bottom-[101px] lg:top-1/2 transform -translate-y-1/2  text-white p-2">
          ⬅️
        </button>
        <button onClick={handleNext} className="absolute -bottom-[101px] lg:right-0 -right-[20px] lg:top-1/2 transform -translate-y-1/2 text-white p-2">
          ➡️
        </button>
      </div>
    </div>
  );
};

export default ImageGallery;
