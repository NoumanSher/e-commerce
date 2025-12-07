/**
 * Centralized React Query key factory.
 * Ensures consistent, hierarchical query keys across the app.
 * Reference: https://tanstack.com/query/latest/docs/react/guides/important-defaults
 */

export const queryKeys = {
  // Products
  products: {
    all: () => ["products"],
    lists: () => [...queryKeys.products.all(), "list"],
    list: (filters?: Record<string, any>) => [
      ...queryKeys.products.lists(),
      filters,
    ],
    details: () => [...queryKeys.products.all(), "detail"],
    detail: (id: string) => [...queryKeys.products.details(), id],
    related: () => [...queryKeys.products.all(), "related"],
    relatedByCategory: (categoryId: string) => [
      ...queryKeys.products.related(),
      categoryId,
    ],
  },

  // Categories
  categories: {
    all: () => ["categories"],
    allPC: () => ["all-parent-categories"],
    lists: () => [...queryKeys.categories.all(), "list"],
    list: (filters?: Record<string, any>) => [
      ...queryKeys.categories.lists(),
      filters,
    ],
    details: () => [...queryKeys.categories.all(), "detail"],
    detail: (id: string) => [...queryKeys.categories.details(), id],
  },

  // Orders
  orders: {
    all: () => ["orders"],
    lists: () => [...queryKeys.orders.all(), "list"],
    details: () => [...queryKeys.orders.all(), "detail"],
    detail: (orderNumber: string) => [
      ...queryKeys.orders.details(),
      orderNumber,
    ],
  },

  // Store settings (global configuration)
  store: {
    all: () => ["store"],
    settings: () => [...queryKeys.store.all(), "settings"],
  },

  // User profile
  user: {
    all: () => ["user"],
    profile: () => [...queryKeys.user.all(), "profile"],
    detail: (userId: string) => [...queryKeys.user.all(), userId],
  },
};
