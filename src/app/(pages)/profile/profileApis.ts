import axios from "axios";

import { BASE_URL_LIVE } from "@/appConst/appConst";
import { OrderResponse,OrderResponseByOrderNumber ,AddressResponse} from "./profileDtos";

const getUserDetailById = async (userId: string): Promise<AddressResponse> => {
  
  try {
    const response = await axios.get(
      `${BASE_URL_LIVE}/order/userAdress/${userId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
const getOrdersDetailByUserId = async (userId: string): Promise<OrderResponse> => {
  try {
    const response = await axios.get(
      `${BASE_URL_LIVE}/order/user-all-orders/${userId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
const getOrderDeatilsByOrderNumber = async (orderNumber: string): Promise<OrderResponseByOrderNumber> => {
  try {
    const response = await axios.get(
      `${BASE_URL_LIVE}/order/user-single-order/${orderNumber}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getUserDetailById,getOrderDeatilsByOrderNumber ,getOrdersDetailByUserId};
