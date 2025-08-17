// profileTypes.ts
import {Order} from "@/app/(pages)/profile/profileDtos";

  
  export interface ProfileInfoProps {
    name: string;
 
  }
  
  export interface OrderHistoryProps {
    orders: Order[];
    title:string
    ordersLAutalLength?:number
    isButtonVisible:boolean
    isPaginated?: boolean;
  }
  