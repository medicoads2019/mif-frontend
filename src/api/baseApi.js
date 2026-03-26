import axios from "axios";

const ENV_API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

const API_BASE_URL =
  ENV_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:8058" : "");

export function createApi(pathname) {
  const normalizedBase = API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  return axios.create({
    baseURL: `${normalizedBase}${normalizedPath}`,
  });
}
