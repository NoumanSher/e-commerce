import axios from "axios";
import { BASE_URL_LIVE } from "@/appConst/appConst";
import { StoreInfo } from "../dto/storeSettingDto";

const getStoreSetting = async (): Promise<StoreInfo> => {
  const res = await axios.get<StoreInfo>(`${BASE_URL_LIVE}/settings`, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
  
  return res.data;
};

export { getStoreSetting };
