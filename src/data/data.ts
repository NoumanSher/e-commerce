import { BsYoutubeIcon, DeliveryIcon, FaFacebookFIcon, FaPinterestIcon, FaTwitterIcon, IoLogoInstagramIcon, MoneyBackGuaranteeIcon, ServiceIcon } from "@/assets/svg/common";

interface ServicesDataProps {
    _id: string;
    Title: string;
    description: string;
    icon: React.ComponentType;
}
interface FooterCopyRightProps {
    _id: string;
    Title: string;
    Value: string;
}
interface FooterLinksProps {
    _id: string;
    icon: React.ComponentType;
}
interface FooterItem {
    title: string;
    items: string[];
  }

export const servicesData : ServicesDataProps[]= [
    {
        _id:"abc",
        Title:"free and fast delivery",
        description:"Free delivery for all orders over PKR5000",
        icon:DeliveryIcon
        
    },
    {
        _id:"abcd",
        Title:"24/7 customer support",
        description:"Friendly 24/7 customer support",
        icon:ServiceIcon
        
    },
    {
        _id:"abcde",
        Title:"moneY BACK GUARANTEE",
        description:"We retun money within 15 days.",
        icon:MoneyBackGuaranteeIcon
        
    }
]
export const FooterCopyRightData : FooterCopyRightProps[]=[
    {
        _id:"abc",
        Title:"Language",
        Value:"United Kingdom | English",

    },
    {
        _id:"abcd",
        Title:"Currency",
        Value:"₹ PKR",

    },
]
export const FooterLinksData : FooterLinksProps[]=[
    {
        _id:"abcde",
        icon:FaFacebookFIcon

    },
    {
        _id:"hello",
        icon:FaTwitterIcon

    },
    {
        _id:"abcdef",
        icon:IoLogoInstagramIcon

    },
    {
        _id:"computer",
        icon:BsYoutubeIcon

    },
    {
        _id:"hi",
        icon:FaPinterestIcon

    },
]


  
export  const footerData: FooterItem[] = [
    {
      title: 'Company',
      items: [
        'About Us',
        'Careers',
        'Affiliates',
        'Blog',
        'Contact Us',
      ],
    },
    {
      title: 'Shop',
      items: [
        'New Arrivals',
        'Accessories',
        'Men',
        'Women',
        'Shop All',
      ],
    },
    {
      title: 'Help',
      items: [
        'Customer Service',
        'My Account',
        'Find A Store',
        'Legal & Privacy',
        'Contact',
        'Gift Card'
      ],
    },
  ];
  