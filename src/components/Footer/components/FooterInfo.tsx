"use client";
import Image from "next/image";
import React, { memo } from "react";
import Logo from "../../../assets/img/logo.webp";
import { CiMail } from "react-icons/ci";
import { MdOutlinePhone } from "react-icons/md";
import { useGetStoreSettings } from "../../Slider/query/storeSettingQuery";
import { FaFacebook, FaInstagram, FaPinterest } from "react-icons/fa";

const FooterInfo = () => {
  const { data: storeSettings } = useGetStoreSettings();

  const logo = storeSettings?.logo;
  const number = storeSettings?.mobile;
  const email = storeSettings?.email;

  const socialLinks = [
    {
      url: storeSettings?.facebookUrl,
      icon: FaFacebook,
      colorClass: "text-[#1877F2]",
      label: "Facebook",
    },
    {
      url: storeSettings?.instagramUrl,
      icon: FaInstagram,
      colorClass: "text-[#E1306C]",
      label: "Instagram",
    },
    {
      url: storeSettings?.pinterestUrl,
      icon: FaPinterest,
      colorClass: "text-[#BD081C]",
      label: "Pinterest",
    },
  ].filter(link => link.url);

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
          href={`mailto:${email || 'pakshipperstore@gmail.com'}`}
        >
          {email}
        </a>
      </div>

      <div className="flex gap-3 mt-3 items-center cursor-pointer">
        <MdOutlinePhone size={20} className="text-gray-500" />
        <a
          className="text-gray-600 hover:text-black transition-colors text-sm font-medium"
          href={`tel:${number || '+923176872900'}`}
        >
          {number}
        </a>
      </div>

      <div className="flex gap-5 mt-8 mb-6 lg:mb-0 items-center">
        {socialLinks.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              className={`${item.colorClass} transition-transform duration-300 hover:scale-110 flex items-center justify-center`}
              aria-label={item.label}
            >
              <IconComponent size={32} />
            </a>
          );
        })}
      </div>
    </div>
  );
};
export default memo(FooterInfo);

