"use client";
import Image from "next/image";
import React, { memo, useEffect, useState } from "react";
import Logo from "../../../assets/img/logo.webp";
import { FooterLinksData } from "@/data/data";
import { CiMail } from "react-icons/ci";
import { MdOutlinePhone } from "react-icons/md";
import { useGetStoreSettings } from "../../Slider/query/storeSettingQuery";

const FooterInfo = () => {
  const { data: storeSettings } = useGetStoreSettings();

  const logo = storeSettings?.logo;
  const number = storeSettings?.mobile;
  const email = storeSettings?.email;
  return (
    <div>
      <Image
        src={logo || Logo}
        priority={true}
        width={125}
        height={125}
        loading="eager"
        alt="Logo"
      />
      <div className="flex gap-3 mt-8 items-center cursor-pointer">
        <CiMail size={20} className="text-gray-500" />
        <a
          className="text-gray-600 hover:text-black transition-colors text-sm font-medium"
          href="mailto:pakshipperstore@gmail.com"
        >
          {email}
        </a>
      </div>

      <div className="flex gap-3 mt-3 items-center cursor-pointer">
        <MdOutlinePhone size={20} className="text-gray-500" />
        <a
          className="text-gray-600 hover:text-black transition-colors text-sm font-medium"
          href="tel:+923176872900"
        >
          {number}
        </a>
      </div>

      <div className="flex gap-6 mt-8 mb-6 lg:mb-0">
        {FooterLinksData.map((item, index) => (
          <a
            href={item.path}
            target="_blank"
            key={index}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {React.createElement(item.icon)}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
export default memo(FooterInfo);
