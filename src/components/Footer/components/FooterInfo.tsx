"use client";
import Image from "next/image";
import React, { memo, useEffect, useState } from "react";
import Logo from "../../../assets/img/logo.webp";
import { FooterLinksData } from "@/data/data";
import { CiMail } from "react-icons/ci";
import { MdOutlinePhone } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/services/settingsService";

const FooterInfo = () => {
  const queryClient = useQueryClient();
  const [logo, setLogo] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");

  // Prefetch data
  useEffect(() => {
    const loadSettingData = async () => {
      let cacheData = queryClient.getQueryData(["settings"]) as any;
      if (!cacheData) {
        try {
          cacheData = await queryClient.fetchQuery({
            queryKey: ["settings"],
            queryFn: () => settingsService.getStoreSetting(),
          });
          setLogo(cacheData.logo);
          setNumber(cacheData.mobile);
          setEmail(cacheData.email);
        } catch (error) {
          console.error("Failed to fetch logo:", error);
        }
      } else {
        setLogo(cacheData.logo);
        setNumber(cacheData.mobile);
        setEmail(cacheData.email);
      }
    };

    loadSettingData();
  }, [queryClient]);
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
      <div className="flex gap-2 mt-8 items-center cursor-pointer">
        <CiMail size={20} />
        <a
          className="text-[#222222] text-[14px]  font-semibold leading-[1.7173em]"
          href="mailto:pakshipperstore@gmail.com"
        >
          {email}
        </a>
      </div>

      <br />
      <div className="flex gap-3 items-center cursor-pointer">
        <MdOutlinePhone />
        <a
          className="text-[#222222] text-[14px]   font-medium leading-[1.7173px]"
          href="tel:+923176872900"
        >
          {number}
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
