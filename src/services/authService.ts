import { post, get } from '@/lib/apiClient';

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
    refreshToken: string;
    token: string;
}

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
    token: string;
    refreshToken: string;
}

export const authService = {
    logInUser: async (payload: LogInPayload): Promise<LogInResponse> => {
        return await post<LogInResponse>('/auth/login-user', payload);
    },

    registerUser: async (payload: RegisterPayload): Promise<RegisterResponse> => {
        return await post<RegisterResponse>('/auth/register-user', payload);
    },

    // Added based on potential needs for social auth or session verification
    verifySession: async (): Promise<any> => {
        return await get<any>('/auth/verify-session');
    }
};
