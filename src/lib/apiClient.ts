import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { BASE_URL_LIVE } from "@/config/env";
import { storageApi, STORAGE_KEYS } from "@/lib/storageApi";

export interface ApiError {
  message: string;
  statusCode?: number;
  response?: unknown;
}

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_URL_LIVE,
    headers: { "Content-Type": "application/json" },
    timeout: 15_000,
  });

  // Attach auth token from storage on every request (SSR-safe via storageApi)
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = storageApi.get(STORAGE_KEYS.token);
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    // Let Axios automatically set the correct Content-Type with boundary for FormData
    if (config.data instanceof FormData && config.headers) {
      delete config.headers["Content-Type"];
    }
    
    return config;
  });

  // Handle 401 with token refresh; normalize all other errors
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        const refreshToken = storageApi.get(STORAGE_KEYS.refreshToken);

        if (refreshToken) {
          try {
            const { data } = await axios.post(
              `${BASE_URL_LIVE}/auth/refresh-token`,
              { token: refreshToken }
            );
            storageApi.set(STORAGE_KEYS.token, data.accessToken);
            storageApi.set(STORAGE_KEYS.refreshToken, data.refreshToken);
            if (originalRequest.headers) {
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${data.accessToken}`;
            }
            return client(originalRequest);
          } catch {
            storageApi.remove(STORAGE_KEYS.token);
            storageApi.remove(STORAGE_KEYS.refreshToken);
          }
        }
      }

      // Normalize API error — prefer message from response body if available
      const responseData = error.response?.data as Record<string, unknown> | undefined;
      const normalizedError: ApiError = {
        message: (responseData?.message as string) ?? error.message,
        statusCode: error.response?.status,
        response: error.response?.data,
      };
      return Promise.reject(normalizedError);
    }
  );

  return client;
}

const apiClient = createApiClient();
export default apiClient;

// ─── Typed request helpers ────────────────────────────────────────────────────

export const get = <T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: import("axios").AxiosRequestConfig
): Promise<T> => apiClient.get<T>(url, { params, ...config }).then((r) => r.data);

export const post = <T = unknown>(
  url: string,
  body?: unknown,
  config?: import("axios").AxiosRequestConfig
): Promise<T> => apiClient.post<T>(url, body, config).then((r) => r.data);

export const put = <T = unknown>(
  url: string,
  body?: unknown,
  config?: import("axios").AxiosRequestConfig
): Promise<T> => apiClient.put<T>(url, body, config).then((r) => r.data);

export const patch = <T = unknown>(
  url: string,
  body?: unknown,
  config?: import("axios").AxiosRequestConfig
): Promise<T> => apiClient.patch<T>(url, body, config).then((r) => r.data);

export const del = <T = unknown>(
  url: string,
  config?: import("axios").AxiosRequestConfig
): Promise<T> => apiClient.delete<T>(url, config).then((r) => r.data);

// Used by storeContext on logout to clear the in-memory default header
export const clearAuthToken = (): void => {
  delete apiClient.defaults.headers.common["Authorization"];
};