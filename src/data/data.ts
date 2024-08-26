import {
  BsYoutubeIcon,
  DeliveryIcon,
  FaFacebookFIcon,
  FaPinterestIcon,
  FaTwitterIcon,
  IoLogoInstagramIcon,
  MoneyBackGuaranteeIcon,
  ServiceIcon,
} from "@/assets/svg/common";
import Banner1 from "../assets/img/grid-banner-1.jpg";
import Banner2 from "../assets/img/grid-banner-2.jpg";
import Banner3 from "../assets/img/grid-banner-3.jpg";
import Banner4 from "../assets/img/grid-banner-4.jpg";
import Product1 from "../assets/img/product-1-2.jpg";
import Product2 from "../assets/img/product-1-1.jpg";
import Product3 from "../assets/img/product-2-1.jpg";
import Product4 from "../assets/img/product-2-2.jpg";
import Product5 from "../assets/img/product-3-1.jpg";
import Product6 from "../assets/img/product-3-2.jpg";
import Product7 from "../assets/img/product-4-1.jpg";
import Product8 from "../assets/img/product-4-2.jpg";
import Product9 from "../assets/img/product-5-1.jpg";
import Product10 from "../assets/img/product-5-2.jpg";
import Product11 from "../assets/img/product-6-1.jpg";
import Product12 from "../assets/img/product-6-2.jpg";
import Product13 from "../assets/img/product-7-1.jpg";
import Product14 from "../assets/img/product-7-2.jpg";
import Product15 from "../assets/img/product-8-1.jpg";
import Product16 from "../assets/img/product-8-2.jpg";
import { StaticImageData } from "next/image";
import {
  BannerProductProps,
  FooterCopyRightProps,
  FooterItem,
  FooterLinksProps,
  ProductCardDataProps,
  ServicesDataProps,
} from "./dataProps";

export const servicesData: ServicesDataProps[] = [
  {
    _id: "abc",
    Title: "free and fast delivery",
    description: "Free delivery for all orders over PKR5000",
    icon: DeliveryIcon,
  },
  {
    _id: "abcd",
    Title: "24/7 customer support",
    description: "Friendly 24/7 customer support",
    icon: ServiceIcon,
  },
  {
    _id: "abcde",
    Title: "moneY BACK GUARANTEE",
    description: "We retun money within 15 days.",
    icon: MoneyBackGuaranteeIcon,
  },
];
export const FooterCopyRightData: FooterCopyRightProps[] = [
  {
    _id: "abc",
    Title: "Language",
    Value: "United Kingdom | English",
  },
  {
    _id: "abcd",
    Title: "Currency",
    Value: "₹ PKR",
  },
];
export const FooterLinksData: FooterLinksProps[] = [
  {
    _id: "abcde",
    icon: FaFacebookFIcon,
  },
  {
    _id: "hello",
    icon: FaTwitterIcon,
  },
  {
    _id: "abcdef",
    icon: IoLogoInstagramIcon,
  },
  {
    _id: "computer",
    icon: BsYoutubeIcon,
  },
  {
    _id: "hi",
    icon: FaPinterestIcon,
  },
];

export const footerData: FooterItem[] = [
  {
    title: "Company",
    items: ["About Us", "Careers", "Affiliates", "Blog", "Contact Us"],
  },
  {
    title: "Shop",
    items: ["New Arrivals", "Accessories", "Men", "Women", "Shop All"],
  },
  {
    title: "Help",
    items: [
      "Customer Service",
      "My Account",
      "Find A Store",
      "Legal & Privacy",
      "Contact",
      "Gift Card",
    ],
  },
];

export const BannerProductsData: BannerProductProps[] = [
  {
    _id: "6543613165665",
    bannerimage: Banner1,
    title: "basic Collection",
    desc: "New Arrivals",
    bannerimage1: Banner2,
    title1: "shop casual",
    desc1: "Free Shipping",
  },
  {
    _id: "6543613165kdjakj65",
    bannerimage: Banner3,
    title: "want and need",
    desc: "the eyegirl wears",
    bannerimage1: Banner4,
    title1: "sales of the week",
    desc1: "running shoes",
  },
];
export const ProductCardData: ProductCardDataProps[] = [
  {
    _id: "12345",
    productName: "Calvin Shorts",
    productCategory: "Dresses",
    price: "45",
    isNew: false, // Optional
    isSale: false, // Optional
    thumbNailImage1: Product1,
    thumbNailImage2: Product2,
    // colors: ["cyan", "black", "gray"]
  },
  {
    _id: "1234",
    productName: "Calvin Shorts",
    productCategory: "Dresses",
    price: "45",
    isNew: true, // Optional
    isSale: false, // Optional
    thumbNailImage1: Product3,
    thumbNailImage2: Product4,
    colors: ["cyan", "black", "gray"],
  },
  {
    _id: "12332af1w651f65aw45",
    productName: "Calvin Shorts",
    productCategory: "Dresses",
    price: "45",
    isNew: false, // Optional
    isSale: false, // Optional
    thumbNailImage1: Product5,
    thumbNailImage2: Product6,
  },
  {
    _id: "123432af12waF5",
    productName: "Calvin Shorts",
    productCategory: "Dresses",
    price: "45",
    discount: "67", // Optional
    isNew: false, // Optional
    isSale: false, // Optional
    thumbNailImage1: Product7,
    thumbNailImage2: Product8,
  },
  {
    _id: "1234gawfawva33435",
    productName: "Calvin Shorts",
    productCategory: "Dresses",
    price: "45",
    isNew: false, // Optional
    isSale: true, // Optional
    thumbNailImage1: Product9,
    thumbNailImage2: Product10,
  },
  {
    _id: "12awsegawgawg345",
    productName: "Calvin Shorts",
    productCategory: "Dresses",
    price: "45",
    isNew: false, // Optional
    isSale: false, // Optional
    thumbNailImage1: Product11,
    thumbNailImage2: Product12,
  },
  {
    _id: "1234wwwwwwwwwwwwwf5",
    productName: "Calvin Shorts",
    productCategory: "Dresses",
    price: "45",
    isNew: false, // Optional
    isSale: false, // Optional
    thumbNailImage1: Product13,
    thumbNailImage2: Product14,
  },
  {
    _id: "12dawdawfawfa345",
    productName: "Calvin Shorts",
    productCategory: "Dresses",
    price: "45",
    isNew: false, // Optional
    isSale: false, // Optional
    thumbNailImage1: Product15,
    thumbNailImage2: Product16,
  },
];
