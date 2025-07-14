import axios, { type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

var token: string | null = null;

// This is a placeholder for your actual token management logic.
// You'll replace this with your function to get the stored token.
const getToken = (): string | null => {
  // For now, let's return a dummy token.
  // In a real app, you might get this from localStorage, cookies, or a state manager.
  return "dummy-auth-token";
};

// This is a placeholder for your token refresh logic.
const refreshToken = async (): Promise<string> => {
  // You will implement the logic to call your token refresh endpoint.
  // For example: const { data } = await axios.post('/api/auth/refresh');
  // return data.accessToken;
  console.log("Refreshing token...");

  // For now, return a new dummy token.
  return "new-dummy-auth-token";
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle token refresh on 403 errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Check if the error is 403 and it's not a retry request
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        // You'll need to store the new token here
        // e.g., storeToken(newAccessToken);
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle failed token refresh (e.g., redirect to login)
        console.error("Token refresh failed", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
