import axios from "axios";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";

const baseURL = "https://logichubapi.envriocart.shop/";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

const refreshAxios = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const res = await refreshAxios.post("/auth/refresh-token");

        const newToken = res.data.result.accessToken;
        localStorage.setItem("accessToken", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        localStorage.clear();
        window.location.href = "/auth/login";
        return Promise.reject(err);
      }
    }

    if (error.response?.status === 403) {
      store.dispatch(logout());
      localStorage.clear();
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);
