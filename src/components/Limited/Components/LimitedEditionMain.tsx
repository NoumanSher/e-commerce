import Image from "next/image";
import React from "react";
import Imag from "../../../assets/img/product-10.jpg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function LimitedEditionMain() {
  return (
    <div className="bg-[#222222]">
      <div className="px-5 mx-auto py-7  xl:py-24  md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1350px]  ">
        <div className="">
          <h1 className="text-[26px] xl:text-[32px] !font-normal pb-1 xl:pb-4 text-white !leading-[1.2rem] !text-center">
            Limited Edition
          </h1>
        </div>
        <div className="relative">
          <div className="flex mt-2 md:mt-6 gap-2 flex-row overflow-x-scroll">
            {Array(10)
              .fill(0)
              .map((item, index) => (
                <div
                  key={index}
                  className="!w-[50%] md:!w-[33.33%] lg:!w-[25%] xl:!w-[20%] flex-shrink-0  "
                >
                  <div>
                    <Image
                      src={Imag}
                      alt="Product Image"
                      className="aspect-[260/315] w-full"
                    />
                  </div>
                  <div className="p-6 bg-[#e4e4e4]">
                    <h1 className="text-base font-normal leading-[1.2rem]">
                      Calvin Shorts
                    </h1>
                    <p className="text-base font-normal leading-[1.2rem]">
                      $29
                    </p>
                  </div>
                </div>
              ))}
          </div>

          <div className="w-[35px] flex justify-center cursor-pointer items-center h-[35px] absolute rounded-[50%] top-[50%] -left-[17.5px] border-[1.5px] border-white">
            <FaChevronLeft className="text-white" />
          </div>
          <div className="w-[35px] flex justify-center cursor-pointer items-center h-[35px] absolute rounded-[50%] top-[50%] -right-[17.5px] border-[1.5px] border-white">
            <FaChevronRight className="text-white" />
          </div>
        </div>
        <div className="mt-12 mb-4 flex justify-center items-center ">
          <div className="cursor-pointer flex justify-center items-center w-[30px] h-[30px] rounded-[50%]">
            <div className="w-[10px] h-[10px] rounded-[50%] bg-[#fff]" />
          </div>
          <div className="cursor-pointer flex justify-center items-center w-[30px] h-[30px] rounded-[50%]">
            <div className="w-[8px] h-[8px] rounded-[50%] bg-[#343a40]" />
          </div>
          <div className="cursor-pointer flex justify-center items-center w-[30px] h-[30px] rounded-[50%]">
            <div className="w-[8px] h-[8px] rounded-[50%] bg-[#343a40]" />
          </div>
          <div className="cursor-pointer flex justify-center items-center w-[30px] h-[30px] rounded-[50%]">
            <div className="w-[8px] h-[8px] rounded-[50%] bg-[#343a40]" />
          </div>
          <div className="cursor-pointer flex justify-center items-center w-[30px] h-[30px] rounded-[50%]">
            <div className="w-[8px] h-[8px] rounded-[50%] bg-[#343a40]" />
          </div>
          <div className="cursor-pointer flex justify-center items-center w-[30px] h-[30px] rounded-[50%]">
            <div className="w-[8px] h-[8px] rounded-[50%] bg-[#343a40]" />
          </div>
          <div className="cursor-pointer flex justify-center items-center w-[30px] h-[30px] rounded-[50%]">
            <div className="w-[8px] h-[8px] rounded-[50%] bg-[#343a40]" />
          </div>
          <div className="cursor-pointer flex justify-center items-center w-[30px] h-[30px] rounded-[50%]">
            <div className="w-[8px] h-[8px] rounded-[50%] bg-[#343a40]" />
          </div>
          <div className="cursor-pointer flex justify-center items-center w-[30px] h-[30px] rounded-[50%]">
            <div className="w-[8px] h-[8px] rounded-[50%] bg-[#343a40]" />
          </div>
        </div>
      </div>
    </div>
  );
}
