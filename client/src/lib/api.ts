import axios from "axios";

/**
 * Browser: same-origin `/api/v1` (Next rewrite → Express) so cookies work with middleware.
 * Server components / SSR: hit Express directly.
 */
function resolveApiBase() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  const proxy = process.env.API_PROXY_TARGET?.replace(/\/$/, "");
  if (proxy) return `${proxy}/api/v1`;
  return "http://localhost:5000/api/v1";
}

const api = axios.create({
  baseURL: resolveApiBase(),
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
