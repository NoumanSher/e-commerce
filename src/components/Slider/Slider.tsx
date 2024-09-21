"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import P1 from "@/assets/img/P1.jpg";
import P2 from "@/assets/img/P2.jpg";

export default function Slider() {
  const slides = [
    { id: 1, img: P1 },
    { id: 2, img: P2 },
    { id: 3, img: P1 },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-play functionality with pause on hover
  useEffect(() => {
    if (!isHovered) {
      const autoPlay = setInterval(nextSlide, 5000); // Change slide every 5 seconds
      return () => clearInterval(autoPlay);
    }
  }, [isHovered]);

  // Slide-specific animations
  const getAnimation = () => {
    switch (currentSlide) {
      case 0:
        return "animate-fade-in-left";
      case 1:
        return "animate-zoom-in";
      case 2:
        return "animate-slide-in-right";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="relative w-full h-[80vh] overflow-x-hidden">
        <div
          className=""
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`absolute inset-0 flex transition-transform duration-700 ${getAnimation()}`}
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className="w-full flex-shrink-0">
                <Image
                 priority={true}
              loading='eager'
                  src={slide.img}
                  className="object-cover w-full h-full"
                  alt={`Slide ${slide.id}`}
                />
              </div>
            ))}
          </div>

        </div>
      </div>
      <div className="relative o top-3 pl-4 flex space-x-4 pb-5 border-3 border-red-500">
        <button
          className="w-10 h-10 bg-black  text-white  rounded-full flex items-center justify-center"
          onClick={prevSlide}
        >
          &larr;
        </button>
        <button
          className="w-10 h-10 bg-black  text-white rounded-full flex items-center justify-center"
          onClick={nextSlide}
        >
          &rarr;
        </button>
      </div>
    </>
  );
}
