import axios, { AxiosError } from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  return client;
}
