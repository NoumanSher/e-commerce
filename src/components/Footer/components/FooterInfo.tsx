import Image from "next/image";
import React, { memo } from "react";
import Logo from "../../../assets/img/Logo.png";
import { FooterLinksData } from "@/data/data";

 const FooterInfo=()=> {
  return (
    <div>
      <Image src={Logo} alt="Logo" className="pb-[48px]" />
      <p className="text-[#222222] text-[14px] font-normal leading-[1.7173em] mb-5">
        174 Pize Drive, Cola Street, Don Jones Lukhesciw{" "}
      </p>
      <a
        className="text-[#222222] text-[14px] lg:text-[12px] font-semibold leading-[1.7173em] mt-4"
        href="mailto:iamusmanmunawar@gmail.com"
      >
        iamusmanmunawar@gmail.com
      </a>
      <br />
      <a
        className="text-[#222222] text-[14px] lg:mt-5 font-medium leading-[1.7173px] mt-4"
        href="tel:+923174303225"
      >
        +92 317 4303225
      </a>
      <div className="flex gap-8 xl:gap-5 mt-8 lg:flex-wrap">
        {FooterLinksData.map((item, index) => (
          <a href={item.path} target="_blank" key={index} className="cursor-pointer">{React.createElement(item.icon)}</a>
        ))}
      </div>
    </div>
  );
}
export default memo(FooterInfo)