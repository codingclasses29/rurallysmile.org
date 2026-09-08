import api from "@/lib/api";
import type { ApiResponse, AuthUser } from "@/types";

export const authService = {
  login: async (payload: { email: string; password: string }) => {
    const cleanPayload = {
      email: payload.email?.trim(),
      password: payload.password?.trim(),
    };
    const { data } = await api.post<ApiResponse<AuthUser & { token?: string }>>(
      "/auth/login",
      cleanPayload
    );
    if (typeof window !== "undefined" && data?.data) {
      const tok =
        (data.data as { token?: string }).token ||
        (data as unknown as { token?: string }).token;
      if (tok) localStorage.setItem("adminToken", tok);
    }
    return data;
  },

  logout: async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminToken");
    }
    const { data } = await api.post<ApiResponse>("/auth/logout");
    return data;
  },

  profile: async () => {
    const { data } = await api.get<
      ApiResponse<{ user: AuthUser; role: string }>
    >("/auth/profile");
    return data;
  },

  /** Alias used by AuthContext */
  me: async () => {
    return authService.profile();
  },

  refresh: async () => {
    const { data } = await api.post<ApiResponse>("/auth/refresh");
    return data;
  },
};
