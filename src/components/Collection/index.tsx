"use client";
import "./components/style.css";
import { ProductCardData } from "@/data/data";
import MainCard from "../Card/index";
import React, { useMemo } from "react";
export default function Collection() {
  return (
    <>
      <div className="bg-[#e4e4e4]  bg-opacity-35">
        <div className=" pb-1 md:pb-4 px-[15px] mx-auto md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1440px]">
          <div className="pt-7 xl:pt-24">
            <h1 className="text-[26px] xl:text-[32px] leading-[1.2rem] !font-normal !pb-1 md:!pb-4 xl:!pb-20 !text-center ">
              The Inside Collection
            </h1>
          </div>
          <div className="flex flex-row mt-2  overflow-x-scroll custom-scrollbar ">
            {ProductCardData.map((item, index) => {
              return (
                <div
                  key={item._id}
                  className={`w-[50%] flex-shrink-0 md:!w-[33.333%] mb-6 xl:mb-12  lg:!w-[25%] ${
                    index === 0
                      ? " pr-2  md:pr-3  lg:pr-5 "
                      : " pr-2  md:pr-3  lg:pr-5"
                  } `}
                >
                  <MainCard item={item}/>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
