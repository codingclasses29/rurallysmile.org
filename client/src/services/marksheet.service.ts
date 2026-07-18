import api, { buildApiUrl } from "@/lib/api";
import type { ApiResponse } from "@/types";

export type MarksheetData = {
  student: {
    name?: string;
    fatherName?: string;
    motherName?: string;
    class?: string;
    rollNumber?: string;
    registrationNumber?: string;
    schoolName?: string;
    photo?: string;
    dob?: string;
  };
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
    published?: boolean;
  };
};

export const marksheetService = {
  getByRoll: async (rollNumber: string) => {
    const { data } = await api.get<ApiResponse<MarksheetData>>(
      `/marksheet/${encodeURIComponent(rollNumber)}`
    );
    return data;
  },

  verify: async (qrPayload: string) => {
    const { data } = await api.get<ApiResponse>(
      `/marksheet/verify/${encodeURIComponent(qrPayload)}`
    );
    return data;
  },

  downloadUrl: (resultId: string) =>
    buildApiUrl(`/marksheet/download/${resultId}`),
};
