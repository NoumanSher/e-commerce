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
  path: string;
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
  _id: string;
  productName: string;
  productCategory: string;
  categoryID: string;
  description: string;
  isVariant: boolean;
  salePrice: number;
  sku: string;
  costPrice: number;
  discount?: number;
  isNew?: boolean;
  isSale?: boolean;
  images: Image[];
  options?: Option[];
  variants?: Variant[]; 
  stock: number; 
  parentCategoryName:string
  childCategoryName:string
}

export interface Option {
  _id: string;
  title: string;
  values: string[];
}

export interface Image {
  _id: string;
  src: any; 
  alt: string;
  isThumbnail?: boolean; 
}

export interface Variant {
  _id: string;
  name: string;
  attributes: { [key: string]: string | number }; 
  additionalCostPrice: number;
  additionalSalePrice: number;
  stock: number;
  image: string;
}
