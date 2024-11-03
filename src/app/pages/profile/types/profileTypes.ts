// profileTypes.ts
export interface Order {
    id: string;
    date: string;
    total: string;
    status: string;
    details: string;
  }
  
  export interface ProfileInfoProps {
    name: string;
 
  }
  
  export interface OrderHistoryProps {
    orders: Order[];
    title:string
    isButtonVisible:boolean
    isPaginated?: boolean;
  }
  