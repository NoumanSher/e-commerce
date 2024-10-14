// components/ImageGallery.tsx
"use client";
import { useState } from "react";
import Image from "next/image"; 

interface ImageGalleryProps {
  images: { src: string; alt: string }[]; 
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-[60%] border-2 border-green-500">
      {/* Thumbnails */}
      <div className="overflow-x-auto lg:overflow-x-hidden  flex lg:flex-col flex-row gap-1 lg:order-1 order-2">
        {images.map((image, index) => (
          <div key={index} className="w-[100px] h-[100px] ">
            <Image
              key={index}
              src={image.src}
              alt={image.alt}
              width={100}
              height={100}
              // sizes='(max-width:160px), 100vw,160px'
              className={`cursor-pointer   aspect-auto w-full h-full rounded ${
                index === currentIndex ? "opacity-100" : "opacity-50"
              }`}
              onClick={() => setCurrentIndex(index)}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div className="lg:w-[82%] w-full relative lg:order-2 order-1 group transition-all duration-300 ease-in-out">
        <div className="relative lg:h-[691px] h-[327px] overflow-y-hidden">
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            height={500}
            width={500}
            // objectFit="contain"
            // layout="responsive"
            className="rounded w-full h-full"
          />
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute -left-[20px] lg:invisible group-hover:lg:visible lg:left-0 -bottom-[101px] lg:top-1/2 transform -translate-y-1/2  text-white p-2"
        >
          ⬅️
        </button>
        <button
          onClick={handleNext}
          className="absolute -bottom-[101px] lg:invisible group-hover:lg:visible lg:right-0 -right-[20px] lg:top-1/2 transform -translate-y-1/2 text-white p-2"
        >
          ➡️
        </button>
      </div>
    </div>
  );
};

export default ImageGallery;
