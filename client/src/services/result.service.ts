import api from "@/lib/api";
import type { ApiResponse } from "@/types";

export const resultService = {
  getByRoll: async (rollNumber: string, dob?: string) => {
    const { data } = await api.get<
      ApiResponse<{
        result: {
          _id: string;
          hindi?: number;
          math?: number;
          gk?: number;
          gs?: number;
          marks?: number;
          total?: number;
          maxMarks?: number;
          percentage?: number;
          grade?: string;
          status?: string;
          student?: {
            name?: string;
            fatherName?: string;
            class?: string;
            rollNumber?: string;
            schoolName?: string;
          };
        };
      }>
    >(`/result/${encodeURIComponent(rollNumber)}`, {
      params: dob ? { dob } : undefined,
    });
    return data;
  },

  merit: async (studentClass?: string) => {
    const { data } = await api.get<
      ApiResponse<{
        results: Array<{
          _id: string;
          marks?: number;
          total?: number;
          percentage?: number;
          grade?: string;
          status?: string;
          student?: {
            name?: string;
            class?: string;
            rollNumber?: string;
            schoolName?: string;
            district?: string;
          };
        }>;
      }>
    >("/result/merit", {
      params: studentClass ? { class: studentClass } : undefined,
    });
    return data;
  },
};
