import api from "@/lib/api";
import type { ApiResponse } from "@/types";

export type PublicStats = {
  totalStudents: number;
  totalCenters: number;
  totalNotices: number;
  totalGallery: number;
  publishedResults: number;
};

export const statsService = {
  public: async () => {
    const { data } = await api.get<ApiResponse<{ stats: PublicStats }>>(
      "/dashboard/public"
    );
    return data;
  },
};
