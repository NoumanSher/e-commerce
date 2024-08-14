import { DeliveryIcon, MoneyBackGuaranteeIcon, ServiceIcon } from "@/assets/svg/common";

interface ServicesDataProps {
    _id: string;
    Title: string;
    description: string;
    icon: React.ComponentType;
}

export const servicesData : ServicesDataProps[]= [
    {
        _id:"djkahdkhakwdhkahwdk",
        Title:"free and fast delivery",
        description:"Free delivery for all orders over PKR5000",
        icon:DeliveryIcon
        
    },
    {
        _id:"djk957dkhakwdhkahwdk",
        Title:"24/7 customer support",
        description:"Friendly 24/7 customer support",
        icon:ServiceIcon
        
    },
    {
        _id:"djkahdkhak78dhkahwdk",
        Title:"moneY BACK GUARANTEE",
        description:"We retun money within 15 days.",
        icon:MoneyBackGuaranteeIcon
        
    }
]