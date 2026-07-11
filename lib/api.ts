import axios from "axios";

// Single axios instance for the whole app. baseURL already ends in /api
// (NEXT_PUBLIC_API_URL), so callers use paths like "/convert", "/auth/me".
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const TOKEN_KEY = "avmg_token";

export const getToken = (): string | null =>
  typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = (): void => {
  if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
};

// Attach the bearer token when we have one. Tool endpoints use optionalAuth
// on the backend, so guests simply send no header.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// A 401 means the token is missing/expired/invalid — drop it so the app
// cleanly falls back to guest instead of retrying with a dead token.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) clearToken();
    return Promise.reject(error);
  },
);

// Pull a human-readable message out of an axios error, falling back sanely.
export const apiError = (error: unknown, fallback = "Something went wrong."): string => {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string })?.message ?? fallback;
  }
  return fallback;
};

export default api;
