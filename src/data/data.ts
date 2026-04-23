import {
  DeliveryIcon,
  FaFacebookFIcon,
  IoLogoInstagramIcon,
  MoneyBackGuaranteeIcon,
  ServiceIcon,
} from "@/assets/svg/common";

import {
  FooterCopyRightProps,
  FooterItem,
  FooterLinksProps,
  // ProductCardDataProps,
  ServicesDataProps,
} from "./dataProps";

export const servicesData: ServicesDataProps[] = [
  {
    _id: "abc",
    Title: "free and fast delivery",
    description: "Free delivery for all orders over 2000/Pkr",
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
    description: "We retun money within 7 days.",
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
    path: "https://www.facebook.com/people/PakShipper/61577806854227/",
  },

  {
    _id: "instagram",
    icon: IoLogoInstagramIcon,
    path: "https://www.instagram.com/pakshipper/",
  },

];

export const footerData: FooterItem[] = [
  {
    title: "Company",
    items: [
      { name: "About Us", url: "/about-us" },
      { name: "Privacy Policy", url: "/privacy-policy" },
      { name: "Terms of Service", url: "/terms-of-service" }
    ]
  },

  {
    title: "Help",
    items: [
      { name: "My Account", url: "" },
      { name: "Contact Us", url: "/contact-us" }
    ]
  }
];


