import { StaticImageData } from "next/image";

export interface ServicesDataProps {
    _id: string;
    Title: string;
    description: string;
    icon: React.ComponentType;
  }
  export interface FooterCopyRightProps {
    _id: string;
    Title: string;
    Value: string;
  }
  export interface FooterLinksProps {
    _id: string;
    icon: React.ComponentType;
    path:string
  }
  export interface FooterItem {
    title: string;
    items: string[];
  }
  export interface BannerProductProps {
    _id: string;
    bannerimage: StaticImageData;
    title: string;
    desc: string;
    bannerimage1: StaticImageData;
    title1: string;
    desc1: string;
  }
  export interface BannerSectionProps {
    _id: string;
    bannerimage: StaticImageData;
    title: string;
    desc: string;
  }
  export interface ProductCardDataProps {
    _id:string;
    productName:string;
    productCategory:string;
    description:string
    isVarirnt:boolean
    stock:number
    price:string;
    discount?:string;
    isNew?:boolean;
    isSale?:boolean;
    thumbNailImage1:StaticImageData;
    thumbNailImage2:StaticImageData;
    colors?:string[];
    availableSizes?:string[];
    images:{ src: StaticImageData; alt: string }[]
  }

