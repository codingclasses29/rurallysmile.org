import api from "@/lib/api";
import type { ApiResponse } from "@/types";

export type PublicExamCenter = {
  _id: string;
  centerName?: string;
  centerNameHindi?: string;
  name?: string;
  address?: string;
  district?: string;
  state?: string;
  capacity?: number;
  reportingTime?: string;
  mobile?: string;
  isActive?: boolean;
};

export const centerService = {
  list: async () => {
    const { data } = await api.get<
      ApiResponse<{ centers: PublicExamCenter[] }>
    >("/center");
    return data;
  },
};
