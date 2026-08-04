import axios, { AxiosError } from "axios";
import { getApiBaseUrl } from "@/lib/config";

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      await fetch("/api/auth/session", { method: "DELETE" });
      window.location.assign("/login?expired=1");
    }

    return Promise.reject(error);
  }
);

export function createServerApiClient(token?: string) {
  const client = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  return client;
}
