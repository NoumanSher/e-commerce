import axios from "axios";
import { BASE_URL_LIVE } from "@/appConst/appConst";
import { StoreInfo } from "../dto/storeSettingDto";

const getStoreSetting = async (): Promise<StoreInfo | null> => {
  try {
    const res = await axios.get<StoreInfo>(`${BASE_URL_LIVE}/settings`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

    return res.data;
  } catch (error) {
    console.error("Failed to fetch store settings:", error);
    return null; // or throw custom error if you want
  }
};

export { getStoreSetting };
