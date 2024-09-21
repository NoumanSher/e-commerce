import React, { memo } from "react";
import { BannerCardProps } from "./types/BannerCardDto";
import Banner from "./components/banner";

const BannerCard = ({ item }: BannerCardProps) => {
  return (
    <div>
      <div key={item._id}>
        <Banner bannerimage={item.bannerimage} desc={item.desc} title={item.title} key={item._id}  />
        <Banner bannerimage={item.bannerimage1} desc={item.desc1} title={item.title1} key={item._id}  />
      </div>
    </div>
  );
};
export default memo(BannerCard);
