import React, { memo } from "react";
import { BannerCardProps } from "./types/BannerCardDto";
import Banner from "./components/banner";

const BannerCard = ({ item }: BannerCardProps) => {
  return (
    <div>
      <div >
        <Banner bannerimage={item.bannerimage} desc={item.desc} title={item.title}  />
        <Banner bannerimage={item.bannerimage1} desc={item.desc1} title={item.title1}  />
      </div>
    </div>
  );
};
export default memo(BannerCard);
