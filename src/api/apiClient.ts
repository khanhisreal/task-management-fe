import axios from "axios";

const createApiClient = (baseURL: string) => {
  const apiClient = axios.create({ baseURL });

  // Request interceptor: attach access token
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: handle token refresh on 401
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/auth/login") &&
        !originalRequest.url.includes("/auth/refresh")
      ) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/auth";
            return Promise.reject(error);
          }

          // Use the user service URL for refresh no matter which client triggered the 401
          const res = await axios.post(
            `${import.meta.env.VITE_USER_SERVICE_URL}/auth/refresh`,
            { refresh: refreshToken }
          );

          const newAccessToken = res.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/auth";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};

export default createApiClient;
