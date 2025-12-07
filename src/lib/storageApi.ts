/** 
 * Storage utilities with error handling and SSR-safe initialization.
 * Centralizes all localStorage operations.
 */

const STORAGE_KEYS = {
  productDetails: "productDeatails", // Note: typo from original kept for backward compat
  cart: "shoppingCart",
  token: "token",
  userId: "userId",
  userName: "userName",
  selectedCategory: "selectedCategory",
  wishlist: "wishlist",
} as const

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

/**
 * Safe localStorage operations with error handling.
 */
export const storageApi = {
  get: (key: StorageKey): string | null => {
    if (typeof window === "undefined") return null
    try {
      return localStorage.getItem(key)
    } catch (err) {
      console.warn(`Failed to read from localStorage[${key}]:`, err)
      return null
    }
  },

  set: (key: StorageKey, value: string): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, value)
    } catch (err) {
      console.warn(`Failed to write to localStorage[${key}]:`, err)
    }
  },

  remove: (key: StorageKey): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(key)
    } catch (err) {
      console.warn(`Failed to remove from localStorage[${key}]:`, err)
    }
  },

  getJSON: <T = any>(key: StorageKey, fallback: T): T => {
    
    const raw = storageApi.get(key)
    if (!raw) return fallback
    try {
      return JSON.parse(raw) as T
    } catch (err) {
      console.warn(`Failed to parse JSON from localStorage[${key}]:`, err)
      return fallback
    }
  },

  setJSON: <T = any>(key: StorageKey, value: T): void => {
    
    try {
      storageApi.set(key, JSON.stringify(value))
    } catch (err) {
      console.warn(`Failed to stringify for localStorage[${key}]:`, err)
    }
  },
}

export { STORAGE_KEYS }
