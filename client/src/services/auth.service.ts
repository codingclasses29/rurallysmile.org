import api from "@/lib/api";
import type { ApiResponse, AuthUser } from "@/types";

export const authService = {
  login: async (payload: { email: string; password: string }) => {
    const { data } = await api.post<ApiResponse<AuthUser>>(
      "/auth/login",
      payload
    );
    return data;
  },

  logout: async () => {
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
