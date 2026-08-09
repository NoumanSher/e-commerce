import { post } from "@/lib/apiClient";

export interface SubscribeResponse {
  message: string;
  data?: any;
}

export const subscribeNewsletter = async (email: string): Promise<SubscribeResponse> => {
  return await post<SubscribeResponse>("/newsletter/subscribe", { email });
};
