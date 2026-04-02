import { post, get } from "@/lib/apiClient";

// ─── Shared user data shape returned by auth endpoints ────────────────────────

interface UserData {
  _id: string;
  email: string;
  username: string;
  mobilePhone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Request payloads ─────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  mobilePhone: string;
  password: string;
  confirmPassword: string;
}

// ─── Response types ───────────────────────────────────────────────────────────

/** Shared shape for both login and register responses. */
export interface AuthResponse {
  message: string;
  data: UserData;
  token: string;
  refreshToken: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const authService = {
  loginUser: (payload: LoginPayload): Promise<AuthResponse> =>
    post<AuthResponse>("/auth/login-user", payload),

  registerUser: (payload: RegisterPayload): Promise<AuthResponse> =>
    post<AuthResponse>("/auth/register-user", payload),

  verifySession: (): Promise<{ data: UserData }> =>
    get<{ data: UserData }>("/auth/verify-session"),
};
