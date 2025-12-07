import { post } from '@/lib/apiClient'
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
  const data = await post<LogInResponse>('/auth/login-user', payload)
  return data
};
