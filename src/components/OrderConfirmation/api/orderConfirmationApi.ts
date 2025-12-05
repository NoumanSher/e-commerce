import axios from "axios";
import { BASE_URL_LIVE } from "@/appConst/appConst";
import { OrderResponse } from "../dto/orderConfirmationDto";
const orderConfirmation = async (orderNumber: string): Promise<OrderResponse> => {
  const res = await axios.get<OrderResponse>(
    `${BASE_URL_LIVE}/order/user-single-order/${orderNumber}`
  );
  debugger
  return res.data;
};

export { orderConfirmation };
