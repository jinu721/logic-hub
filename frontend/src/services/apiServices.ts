import axios from "axios";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("RESPONSE FROM BACKEND ::: ", response);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axiosInstance.post("/auth/refresh-token");

        console.log("REFRESH TOKEN RESPONSE", res);

        const newToken = res.data.result.accessToken;
        localStorage.setItem("accessToken", newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        console.log("NEW TOKEN", newToken);
        console.log("ORIGINAL REQUEST", originalRequest);

        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Refresh token failed:", err);
        store.dispatch(logout());
        window.location.href = "/auth/login";
      }
    } else if (error.response?.status === 403) {
      store.dispatch(logout());
      localStorage.clear();
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);
