"use client";
import { useEffect, useState } from "react";
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
  // Preload adjacent images
  useEffect(() => {
    images.forEach((img) => {
      const preloadImg = new window.Image();
      preloadImg.src = img.src;
    });
  }, [images]);
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-[60%]">
      {/* Thumbnails */}
      <div className="overflow-x-auto lg:overflow-x-hidden  flex lg:flex-col flex-row gap-1 lg:order-1 order-2">
        {images.map((image, index) => (
          <div key={index} className="w-[100px] h-[100px] ">
            <Image
              key={index}
              src={image.src}
              alt={image.alt}
              width={160}
              height={160}
              sizes='(max-width:160px), 100vw,160px'
              className={`cursor-pointer   aspect-auto w-full h-full rounded transition-opacity duration-200 ${
                index === currentIndex ? "opacity-100" : "opacity-50"
              }`}
              onClick={() => setCurrentIndex(index)}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Main Image */}
      <div className="lg:w-[82%] h-fit w-full relative  lg:order-2 order-1 group transition-all duration-300 ease-in-out">
        <div className="relative  h-auto md:h-[690px] lg:h-[700px] overflow-y-hidden">
          <Image
            src={images[currentIndex]?.src}
            alt={images[currentIndex]?.alt}
            height={500}
            width={500}
            loading="eager"
            // layout="responsive"
            className="rounded w-full h-full aspect-auto"
          />
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute -left-[15px] border-black border lg:border-0 lg:left-7 flex justify-center items-center bg-white lg:hover:bg-red-500 lg:h-12 lg:w-12 h-8 w-8 rounded-full shadow-sm lg:invisible group-hover:lg:visible  top-1/2 transform -translate-y-1/2 p-2"
        >
          <MdOutlineKeyboardArrowLeft size={100} className="text-black  lg:hover:text-white" />
        </button>
        <button
          onClick={handleNext}
          className="absolute border-black border lg:border-0 -bottom-[88px] lg:-bottom-[101px] lg:h-12 lg:w-12 h-8 w-8 flex justify-center items-center rounded-full shadow-sm lg:right-7 lg:invisible bg-white lg:hover:bg-red-500 group-hover:lg:visible  -right-[15px] top-1/2 transform -translate-y-1/2  p-2"
        >
          <MdOutlineKeyboardArrowRight size={100} className="text-black lg:hover:text-white"/>
        </button>
      </div>
    </div>
  );
};

export default ImageGallery;
