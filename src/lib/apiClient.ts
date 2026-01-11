import axios, { AxiosError, AxiosInstance } from 'axios'
import { BASE_URL_LIVE } from '@/appConst/appConst'
export interface ApiError {
  message: string
  statusCode?: number
  response?: any
}
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_URL_LIVE,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 15_000,
  })
  // Request interceptor: attach auth token if present
  client.interceptors.request.use((config) => {
    if (typeof window !== 'undefined' && config.headers) {
      try {
        const token = localStorage.getItem('token')
        if (token) config.headers['Authorization'] = `Bearer ${token}`
      } catch {
        // ignore localStorage errors
      }
    }
    return config
  })
  // Response interceptor: handle 401 & normalize errors
  client.interceptors.response.use(
    (resp) => resp,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;
      // 1. If error is 401 (Unauthorized) and it's not a retry
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) throw new Error("No refresh token");
          // 2. Call the refresh token API
          const { data } = await axios.post(`${BASE_URL_LIVE}/auth/refresh-token`, {
            token: refreshToken,
          });
          // 3. Update tokens in localStorage
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          // 4. Update the failed request with the new token and retry
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
          }
          return client(originalRequest);
        } catch (refreshError) {
          // If refresh fails (e.g., refresh token expired), clear everything and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          return Promise.reject(refreshError);
        }
      }
      // Standard error normalization
      const err: ApiError = {
        message: error.message,
        statusCode: error.response?.status,
        response: error.response?.data,
      }
      return Promise.reject(err)
    }
  )
  return client
}
const apiClient = createApiClient()
export default apiClient
// Small typed helpers
export async function get<T = any>(url: string, params?: Record<string, any>): Promise<T> {
  const { data } = await apiClient.get<T>(url, { params })
  return data
}
export async function post<T = any>(url: string, body?: any): Promise<T> {
  const { data } = await apiClient.post<T>(url, body)
  return data
}
// Helpers to explicitly set/clear auth token for client-side usage.
export function setAuthToken(token?: string | null) {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common['Authorization']
  }
}
export function clearAuthToken() {
  delete apiClient.defaults.headers.common['Authorization']
}