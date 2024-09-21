import Image from "next/image";
import React, { memo } from "react";
import masterCard from "../../../assets/img/mc_sym_debit_pos.svg";

const FooterSubscribe=()=> {
  return (
    <div>
      <div>
        <h1 className="mt-[14px] uppercase text-[16px] leading-[1.2em] font-semibold mb-[14px] lg:mb-[30px] lg:mt-0">
          Subscribe
        </h1>
        <p className="text-[14px] leading-[1.7em] font-normal mb-[16px] mt-[3px]  py-2">
          Be the first to get the latest news about trends, promotions, and much
          more!
        </p>
        <div className="relative md:mb-8">
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            id="email"
            className="block w-full px-4 py-5 text-sm font-normal leading-tight text-gray-800 bg-white border border-gray-300 rounded-none shadow-none transition duration-150 ease-in-out focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="absolute top-[20px] cursor-pointer uppercase pr-[15px] text-[16px] font-semibold right-0">
            Join
          </p>
        </div>
        <div className="mt-4 pt-3">
          <h1 className=" uppercase text-[12px] lg:text-[10px] leading-[1.2em] font-semibold mb-[14px]">
            Secure Payments
          </h1>
          <div className="flex gap-4 my-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <>
                <Image
                  src={masterCard}
                  alt="masterCard"
                    priority={true}
              loading='eager'
                  className="w-[35px] h-[35px]"
                />
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default  memo(FooterSubscribe)
