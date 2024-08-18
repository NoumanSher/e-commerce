import { servicesData } from "@/data/data";
import React, { memo } from "react";

const  Services=()=> {
  return (
    <div>
      <div className="flex px-4 md:px-8 lg:px-12   ">
        <div className="md:flex px-[15px] md:px-[15px]  md:items-center lg:justify-center w-full md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1440px]   mx-auto  pb-[36.8px] pt-[48px] border-b border-b-[#cfcdcd]">
          {servicesData.map((item, index) => (
            <div
              key={item._id}
              className={`flex md:justify-center w-full  md:items-center gap-4  xl:w-[33.333%]   md:space-x-0 ${
                index === 2 ? "" : "mb-[48px] md:mb-0 "
              }`}
            >
              <div>{React.createElement(item.icon)}</div>
              <div>
                <h1 className="font-semibold text-[#222222] text-[15px] uppercase">
                  {item.Title}
                </h1>
                <p className="text-[#767676] xl:whitespace-nowrap text-[14px]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default memo(Services)
