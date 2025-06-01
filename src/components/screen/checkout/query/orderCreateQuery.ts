import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { OrderCreate } from "../api/orderCreateApi";
interface ErrorLogin {
  response: {
    data: {
      message: string;
    };
  };
}
export const useOrderCreate = () => {
  return useMutation({
    mutationFn: OrderCreate,
    onSuccess: (data) => {
      
      toast.success("Order Create Successfully!");
    },
    onError: (error: ErrorLogin) => {
      
      if (error) {
        toast.error(error?.response.data.message);
      }
   
    },
  });
};
