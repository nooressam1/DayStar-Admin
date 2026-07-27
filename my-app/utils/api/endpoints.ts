export const ENDPOINTS = {
  PRODUCT: {
    LIST: "/product",
    BY_ID: (id: string) => `/product/${id}`,
    BY_SLUG: (slug: string) => `/product/${slug}`,
    VARIANTS: (productId: string) => `/product/${productId}/variants`,
    REVIEWS: (productId: string) => `/product/${productId}/reviews`,
    BEST_SELLERS: "/product/best-sellers",
  },
  DISCOUNT: {
    LIST: "/discount",
    GET: (code: string) => `/discount/${code}`,
  },
  CATEGORY: {
    LIST: "/category",
    BY_ID: (id: string) => `/category/${id}`,
  },
  ORDER: {
    LIST: "/orders",
    GET: (id: string) => `/orders/${id}`,
    CHECKOUT: "/orders/checkout",
    CANCEL: (orderId: string) => `/orders/${orderId}/cancel`,
  },
  USER: {
    ME: "/me",
  },
  ADDRESS: {
    LIST_OR_CREATE: "/addresses",
    BY_ID: (id: string) => `/addresses/${id}`,
    SET_DEFAULT: (id: string) => `/addresses/${id}/default`,
  },
  CONTACT: {
    SUBMIT: "/contact_submissions",
  },
} as const;
