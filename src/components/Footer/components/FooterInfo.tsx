import Image from "next/image";
import React, { memo } from "react";
import Logo from "../../../assets/img/Logo.png";
import { FooterLinksData } from "@/data/data";
import { CiMail } from "react-icons/ci";
import { MdOutlinePhone } from "react-icons/md";

const FooterInfo = () => {
  return (
    <div>
      <Image
        src={Logo}
        priority={true}
        loading="eager"
        alt="Logo"
        className=""
      />
      <div className="flex gap-2 mt-8 items-center cursor-pointer">
        <CiMail size={20} />
        <a
          className="text-[#222222] text-[14px]  font-semibold leading-[1.7173em]"
          href="mailto:pakshipperstore@gmail.com"
        >
          pakshipperstore@gmail.com
        </a>
      </div>

      <br />
      <div className="flex gap-3 items-center cursor-pointer">
        <MdOutlinePhone />
         <a
        className="text-[#222222] text-[14px]   font-medium leading-[1.7173px]"
        href="tel:+923176872900"
      >
        03176872900
      </a>
      </div>
     
      <div className="flex gap-8 xl:gap-5 mt-8 lg:flex-wrap">
        {FooterLinksData.map((item, index) => (
          <a
            href={item.path}
            target="_blank"
            key={index}
            className="cursor-pointer text-3xl"
          >
            {React.createElement(item.icon)}
          </a>
        ))}
      </div>
    </div>
  );
};
export default memo(FooterInfo);
