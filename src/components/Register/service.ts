import { post } from '@/lib/apiClient'
export interface RegisterPayload { 
  email: string;
  username: string;
  mobilePhone: string;
  password: string;
  confirmPassword: string;
}
export interface RegisterResponse {
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
  }
  
export const registerUser = async (payload: RegisterPayload):Promise<RegisterResponse> => {
  const data = await post<RegisterResponse>('/auth/register-user', payload)
  return data
};
