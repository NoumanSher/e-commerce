import axios from "axios";
import { OrderDto ,OrderResponse} from "../dto/orderCreateDto";
import { BASE_URL_LIVE } from "@/appConst/appConst";

const OrderCreate = (values: OrderDto): Promise<OrderResponse> => {
  // return axios.post<OrderResponse>(`http://localhost:7418/api/order/create-order`, values)
  return axios.post<OrderResponse>(`${BASE_URL_LIVE}/order/create-order`, values)
    .then(response => response.data);
};


export { OrderCreate };
