import axios, { AxiosError, AxiosInstance } from 'axios' 
import { BASE_URL } from '@/constants'

export interface ApiError {
  message: string
  statusCode?: number
  response?: any
}

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 15_000,
  })

  // Request interceptor: attach auth token if present
  client.interceptors.request.use((config) => {
    // If running in the browser, prefer reading token from localStorage.
    // This avoids accessing `localStorage` on the server where it doesn't exist.
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

  // Response interceptor: normalize errors
  client.interceptors.response.use(
    (resp) => resp,
    (error: AxiosError) => {
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
