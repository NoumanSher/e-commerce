import { FooterCopyRightData } from "@/data/data";
import React from "react";

export default function FooterCopyRight() {
  return (
    <div>
      <div className="border-t border-t-[#cfcdcd] pt-5 px-4 md:pt-7 md:pb-6  lg:py-9 pb-4 md:mx-8 md:flex md:items-center md:justify-between xl:max-w-[1440px] xl:px-0 xl:mx-auto">
        <p className="text-[14px] font-normal leading-[1.71430em] ">
          ©2023 Company
        </p>
        <div className="md:flex items-center pt-3  md:gap-4 xl:gap-8">
          {FooterCopyRightData.map((item) => (
            <div key={item._id} className="flex pb-3 md:pb-0 md:pt-0 ">
              <p className="text-[14px] font-normal leading-[1.71430em] text-[#767676] !mr-2 ">
                {item.Title}
              </p>
              <p className="text-[14px] font-normal leading-[1.71430em]  ">
                {item.Value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
