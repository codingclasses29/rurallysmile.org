import axios from "axios";

/**
 * Prefer an explicit API origin from env, but ignore broken values injected by
 * deployment config and fall back to known-safe origins.
 */
const PROD_API_ORIGIN = "https://rurallysmile-org-4.onrender.com";
const LOCAL_API_ORIGIN = "http://localhost:5000/api/v1";
const API_PREFIX = "/api/v1";
const BROWSER_API_BASE = API_PREFIX;

function normalizeApiBase(value?: string | null) {
  const raw = value?.trim();
  if (!raw) return null;
  if (!/^https?:\/\//i.test(raw)) return null;

  try {
    const url = new URL(raw);
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function ensureApiPrefix(value: string) {
  return value.endsWith(API_PREFIX) ? value : `${value}${API_PREFIX}`;
}

function resolveApiBase() {
  if (typeof window !== "undefined") {
    return BROWSER_API_BASE;
  }

  const publicApi = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL);
  if (publicApi) {
    return ensureApiPrefix(publicApi);
  }

  const proxy = normalizeApiBase(process.env.API_PROXY_TARGET);
  if (proxy) {
    return ensureApiPrefix(proxy);
  }

  return process.env.NODE_ENV === "production"
    ? ensureApiPrefix(PROD_API_ORIGIN.replace(/\/$/, ""))
    : LOCAL_API_ORIGIN;
}

const API_BASE_URL = resolveApiBase();

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    if (
      status === 401 &&
      original &&
      !original._retry &&
      typeof window !== "undefined" &&
      !String(original.url || "").includes("/auth/")
    ) {
      original._retry = true;
      try {
        await api.post("/auth/refresh");
        return api(original);
      } catch {
        /* fall through */
      }
    }

    return Promise.reject({
      ...error,
      message,
      errors: error.response?.data?.errors || null,
      status,
    });
  }
);

export default api;
