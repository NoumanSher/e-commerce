import { BannerProductProps } from "@/data/dataProps";
import { StaticImageData } from "next/image";
 

export interface BannerCardProps{
    item:BannerProductProps
}

export interface BannerProps{
    bannerimage: StaticImageData;
    title: string;
    desc: string;
}