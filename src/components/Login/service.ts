import axios from "axios";
import { BASE_URL } from "@/constants";
export interface LogInPayload {
  email: string;

  password: string;
}
export interface LogInResponse {
  message: string;
  data: {
    email: string;
    username: string;
    mobilePhone: string;
    role: string;
    password: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  token: string;
}

export const logInUser = async (
  payload: LogInPayload
): Promise<LogInResponse> => {
  debugger;
  const { data } = await axios.post(`${BASE_URL}/auth/login-user`, payload);
  return data;
};
