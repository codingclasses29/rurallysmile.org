import api from "@/lib/api";
import type { ApiResponse } from "@/types";

/** Student-facing helpers (registration status is the primary public path). */
export const studentService = {
  /** Admin-only list — kept for future coordinator tools */
  list: async (params?: Record<string, string | number>) => {
    const { data } = await api.get<ApiResponse>("/student", { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse>(`/student/${id}`);
    return data;
  },

  search: async (q: string) => {
    const { data } = await api.get<ApiResponse>("/student/search", {
      params: { q },
    });
    return data;
  },
};
