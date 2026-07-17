import api from "@/lib/api";
import type { ApiResponse, Notice } from "@/types";

export const noticeService = {
  list: async () => {
    const { data } = await api.get<ApiResponse<{ notices: Notice[] }>>(
      "/notice"
    );
    return data;
  },
};
