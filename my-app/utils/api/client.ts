import { createClient } from "@/utils/supabase/client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";
const DEFAULT_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000;

export interface ApiResponseWrapper<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ApiPaginatedResponseWrapper<T> {
  data?: T[];
  items?: T[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export function serializeQueryParams(params?: Record<string, any>): Record<string, string> {
  if (!params) return {};
  const cleanParams: Record<string, string> = {};
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "" && val !== "undefined") {
      if (typeof val === "string" && val.startsWith("All ")) {
        return;
      }
      cleanParams[key] = String(val);
    }
  });
  return cleanParams;
}

export async function clearAuthData(): Promise<void> {
  // Clear Supabase session
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.warn("Could not sign out from Supabase:", error);
  }

  // Clear standard cookies
  if (typeof document !== "undefined") {
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "refreshToken=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "user=; path=/; max-age=0; SameSite=Lax";
  }

  // Clear localStorage
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
}

export class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;
  private timeout: number;

  private constructor(baseUrl: string = BASE_URL, timeout: number = DEFAULT_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Merge headers and filter out undefined values
   * This allows explicitly setting a header to undefined to remove it
   */
  private async mergeHeaders(customHeaders?: HeadersInit): Promise<Record<string, string>> {
    const merged: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    // Attach Supabase access token if available
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        merged["Authorization"] = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.warn("Could not retrieve Supabase session:", error);
    }

    // Fallback to localStorage if available
    if (!merged["Authorization"] && typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        merged["Authorization"] = `Bearer ${token}`;
      }
    }

    // Handle different HeadersInit types
    if (customHeaders) {
      if (customHeaders instanceof Headers) {
        customHeaders.forEach((value, key) => {
          merged[key] = value;
        });
      } else if (Array.isArray(customHeaders)) {
        customHeaders.forEach(([key, value]) => {
          merged[key] = value;
        });
      } else if (typeof customHeaders === "object") {
        Object.entries(customHeaders).forEach(([key, value]) => {
          if (value !== undefined) {
            merged[key] = value;
          } else {
            // If explicitly set to undefined, remove the header
            delete merged[key];
          }
        });
      }
    }

    return merged;
  }

  /**
   * Main unified request method capable of handling GET, POST, PUT, PATCH, DELETE
   * as well as custom Next.js revalidation cache configs and search params.
   */
  async request<T>(
    endpoint: string,
    params?: Record<string, string>,
    options: RequestInit = {},
    cacheConfig?: {
      revalidate?: number | false | undefined;
      tags?: string[];
    }
  ): Promise<T> {
    if (params) {
      const cleanParams: Record<string, string> = {};
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "" && val !== "undefined") {
          cleanParams[key] = String(val);
        }
      });

      if (Object.keys(cleanParams).length > 0) {
        const searchParams = new URLSearchParams(cleanParams);
        endpoint = `${endpoint}?${searchParams.toString()}`;
      }
    }
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers = await this.mergeHeaders(options.headers);
      if (options.body && options.body instanceof FormData) {
        delete headers["Content-Type"];
      }

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        next: cacheConfig,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.handleError(response);
      }

      const apiResponse: ApiResponseWrapper<T> = await response.json();

      // Check if the API response indicates success
      // Some endpoints don't include the success field, so we assume success if the response has the expected structure
      if (apiResponse.success === false) {
        throw {
          message: apiResponse.message || "API request failed",
          status: response.status,
          details: apiResponse,
        };
      }

      // Return the unwrapped data
      // fallback to apiResponse itself if data is undefined (to support direct non-wrapped responses from NestJS)
      return apiResponse.data !== undefined ? apiResponse.data : (apiResponse as unknown as T);
    } catch (error) {
      clearTimeout(timeoutId);
      throw await this.handleError(error);
    }
  }

  /**
   * Make a request for paginated data and return unwrapped paginated response
   */
  async requestPaginated<T>(
    endpoint: string,
    params?: Record<string, string>,
    options: RequestInit = {},
    cacheConfig?: {
      revalidate?: number | false | undefined;
      tags?: string[];
    }
  ): Promise<ApiPaginatedResponseWrapper<T>> {
    if (params) {
      const searchParams = new URLSearchParams(params);
      endpoint = `${endpoint}?${searchParams.toString()}`;
    }
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers = await this.mergeHeaders(options.headers);
      if (options.body && options.body instanceof FormData) {
        delete headers["Content-Type"];
      }

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        next: cacheConfig,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.handleError(response);
      }

      const apiResponse: ApiResponseWrapper<ApiPaginatedResponseWrapper<T>> =
        await response.json();

      if (apiResponse.success === false) {
        throw {
          message: apiResponse.message || "API request failed",
          status: response.status,
          details: apiResponse,
        };
      }

      return apiResponse.data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw await this.handleError(error);
    }
  }

  /**
   * Make a request for direct paginated data (not wrapped in an API response structure)
   */
  async requestDirectPaginated<T>(
    endpoint: string,
    params?: Record<string, string>,
    options: RequestInit = {},
    cacheConfig?: {
      revalidate?: number | false | undefined;
      tags?: string[];
    }
  ): Promise<PaginatedResponse<T>> {
    if (params) {
      const searchParams = new URLSearchParams(params);
      endpoint = `${endpoint}?${searchParams.toString()}`;
    }
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers = await this.mergeHeaders(options.headers);
      if (options.body && options.body instanceof FormData) {
        delete headers["Content-Type"];
      }

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        next: cacheConfig,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.handleError(response);
      }

      const directResponse = await response.json();

      return {
        data: directResponse.data,
        pagination: {
          total: directResponse.total,
          page: directResponse.page,
          limit: directResponse.limit,
          totalPages: directResponse.totalPages,
          hasPreviousPage: directResponse.hasPreviousPage,
          hasNextPage: directResponse.hasNextPage,
        },
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw await this.handleError(error);
    }
  }

  /**
   * Make a request and return the full API response (including message and success)
   */
  async requestFull<T>(
    endpoint: string,
    params?: Record<string, string>,
    options: RequestInit = {},
    cacheConfig?: {
      revalidate?: number | false | undefined;
      tags?: string[];
    }
  ): Promise<ApiResponseWrapper<T>> {
    if (params) {
      const searchParams = new URLSearchParams(params);
      endpoint = `${endpoint}?${searchParams.toString()}`;
    }
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers = await this.mergeHeaders(options.headers);
      if (options.body && options.body instanceof FormData) {
        delete headers["Content-Type"];
      }

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        next: cacheConfig,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw await this.handleError(error);
    }
  }

  /**
   * Handle 401 Unauthorized errors by clearing auth and redirecting to login
   */
  private handle401Error(): void {
    if (typeof window !== "undefined") {
      clearAuthData();
      window.location.href = "/login?error=unauthorized";
    }
  }

  private async handleError(error: unknown): Promise<never> {
    if (error instanceof Response) {
      if (error.status === 401) {
        this.handle401Error();
      }

      try {
        const errorData: ApiResponseWrapper<unknown> = await error.json();

        let errorMessage = "An error occurred";

        if (
          typeof errorData === "object" &&
          errorData !== null &&
          "errors" in errorData &&
          typeof (errorData as { errors: unknown }).errors === "object" &&
          (errorData as { errors: Record<string, unknown> }).errors !== null
        ) {
          const errors = (errorData as { errors: Record<string, unknown> }).errors;
          if ("message" in errors && typeof errors.message === "string") {
            errorMessage = errors.message;
          }
        } else if (
          typeof errorData === "object" &&
          errorData !== null &&
          "success" in errorData &&
          !errorData.success &&
          "message" in errorData
        ) {
          errorMessage = (errorData.message as string) || errorMessage;
        } else if (
          typeof errorData === "object" &&
          errorData !== null &&
          "message" in errorData &&
          typeof (errorData as { message: unknown }).message === "string"
        ) {
          errorMessage = (errorData as { message: string }).message || errorMessage;
        }

        throw {
          message: errorMessage,
          status: error.status,
          details: errorData,
        };
      } catch (parseError) {
        if (
          typeof parseError === "object" &&
          parseError !== null &&
          "message" in parseError &&
          "status" in parseError
        ) {
          throw parseError;
        }
        throw {
          message: "An error occurred",
          status: error.status,
          details: { statusText: error.statusText },
        };
      }
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw {
        message: "Request timeout",
        status: 408,
      };
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      "status" in error
    ) {
      if ((error as { status: number }).status === 401) {
        this.handle401Error();
      }
      throw error;
    }

    throw {
      message:
        (error instanceof Error ? error.message : "Network error") ||
        "Network error",
      status: 500,
    };
  }
}

export const apiClient = ApiClient.getInstance();
