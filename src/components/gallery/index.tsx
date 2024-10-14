// components/ImageGallery.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
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
        <div className="relative  h-[327px] md:h-auto overflow-y-hidden">
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            height={500}
            width={500}
            // objectFit="contain"
            layout="responsive"
            className="rounded w-full h-full"
          />
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute -left-[20px] lg:left-7 flex justify-center items-center bg-white h-12 w-12 rounded-full shadow-sm lg:invisible group-hover:lg:visible  -bottom-[101px] lg:top-1/2 transform -translate-y-1/2 p-2"
        >
          <MdOutlineKeyboardArrowLeft size={100} />
        </button>
        <button
          onClick={handleNext}
          className="absolute -bottom-[101px] h-12 w-12 flex justify-center items-center rounded-full shadow-sm lg:right-7 lg:invisible bg-white group-hover:lg:visible  -right-[20px] lg:top-1/2 transform -translate-y-1/2  p-2"
        >
          <MdOutlineKeyboardArrowRight size={100} />
        </button>
      </div>
    </div>
  );
};

export default ImageGallery;
