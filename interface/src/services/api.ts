import axios, { type InternalAxiosRequestConfig } from "axios";
import { tokenService } from "./token-service";
import { DSS_BASE_URL, DSS_AUDIENCE } from "./config";

// Extend the AxiosRequestConfig interface to include our custom auth context
declare module "axios" {
  export interface AxiosRequestConfig {
    authContext?: {
      scope: string;
    };
  }
}

/**
 * Base response error interceptor for handling token refresh.
 */
const responseErrorInterceptor = async (error: any) => {
  const originalRequest = error.config;
  if (
    (error.response.status === 401 || error.response.status === 403) &&
    !originalRequest._retry &&
    originalRequest.authContext
  ) {
    originalRequest._retry = true;
    try {
      const { audience, scope } = originalRequest.authContext;
      const newAccessToken = await tokenService.getToken(audience, scope, true);
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return axios(originalRequest); // Use a plain axios call for retries
    } catch (refreshError) {
      console.error("Token refresh failed", refreshError);
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
};

// --- DSS API Instance ---
// This instance is pre-configured for all DSS calls.
export const dssApi = axios.create({
  baseURL: DSS_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

dssApi.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (config.authContext) {
    const { scope } = config.authContext;
    const token = await tokenService.getToken(DSS_AUDIENCE, scope);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

dssApi.interceptors.response.use(
  (response) => response,
  responseErrorInterceptor,
);

// --- USS API Factory ---
/**
 * Creates a pre-configured Axios instance for making calls to a specific USS.
 * The 'audience' for token generation is automatically derived from the USS base URL.
 *
 * @param ussBaseUrl The base URL of the USS.
 * @returns A pre-configured Axios instance for the given USS.
 */
export const createUssApi = (ussBaseUrl: string) => {
  const ussApi = axios.create({
    baseURL: ussBaseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Attach a modified request interceptor that derives the audience
  ussApi.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (config.authContext) {
        // Automatically determine audience from the base URL
        const audience = new URL(ussBaseUrl).hostname;
        const { scope } = config.authContext;
        const token = await tokenService.getToken(audience, scope);
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
  );

  // Attach the standard response error interceptor
  ussApi.interceptors.response.use(
    (response) => response,
    responseErrorInterceptor,
  );

  return ussApi;
};
