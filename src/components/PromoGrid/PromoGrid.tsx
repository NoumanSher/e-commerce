"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PromoCard } from "../Slider/dto/storeSettingDto";

interface PromoGridProps {
  promoCards: PromoCard[];
}

const PromoGrid: React.FC<PromoGridProps> = ({ promoCards }) => {
  if (!promoCards || promoCards.length === 0) return null;

  // Ensure we sort by orderNumber if needed
  const sortedCards = [...promoCards].sort((a, b) => a.orderNumber - b.orderNumber);

  return (
    <div className="bg-[#faf9f8] px-4 md:px-6 py-10">
      <div className="xl:max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {sortedCards.map((card, index) => {
            const CardContent = (
              <div className="relative w-full aspect-square overflow-hidden group bg-gray-200">
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Minimalist Dark Overlay for readability */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none" />
                
                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end text-white z-10 pointer-events-none">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 drop-shadow-md">
                    {card.title}
                  </h3>
                  {card.subtitle && (
                    <p className="text-sm md:text-base font-medium opacity-90 drop-shadow-md">
                      {card.subtitle}
                    </p>
                  )}
                  {card.link && (
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-sm font-semibold uppercase tracking-wider relative overflow-hidden group-hover:after:translate-x-0 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-white after:-translate-x-full after:transition-transform after:duration-300">
                        Shop Now
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:translate-x-1 transition-transform duration-300">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );

            if (card.link) {
              return (
                <Link href={card.link} key={card._id || index} className="block w-full h-full">
                  {CardContent}
                </Link>
              );
            }

            return <div key={card._id || index} className="w-full h-full">{CardContent}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

export default PromoGrid;
