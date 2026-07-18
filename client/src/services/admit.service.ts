import api, { buildApiUrl } from "@/lib/api";
import type { ApiResponse } from "@/types";

export type AdmitLookup = {
  admitCard: {
    _id: string;
    examDate?: string;
    examTime?: string;
    reportingTime?: string;
    seatNumber?: string;
    roomNumber?: string;
    downloadCount?: number;
    examCenter?: {
      centerName?: string;
      name?: string;
      address?: string;
      district?: string;
    };
  };
  student: {
    _id: string;
    name?: string;
    fatherName?: string;
    class?: string;
    rollNumber?: string;
    registrationNumber?: string;
    schoolName?: string;
    photo?: string;
    mobile?: string;
    dob?: string;
  };
};

export const admitService = {
  getByRegistration: async (
    registrationNo: string,
    params?: { mobile?: string; dob?: string }
  ) => {
    const { data } = await api.get<ApiResponse<AdmitLookup>>(
      `/admit/${encodeURIComponent(registrationNo)}`,
      { params }
    );
    return data;
  },

  /** Public PDF download URL resolved against the active API origin. */
  pdfUrl: (
    registrationNo: string,
    params?: { mobile?: string; dob?: string }
  ) => {
    const q = new URLSearchParams();
    if (params?.mobile) q.set("mobile", params.mobile);
    if (params?.dob) q.set("dob", params.dob);
    const qs = q.toString();
    const path = `/admit/pdf/${encodeURIComponent(registrationNo)}`;
    return `${buildApiUrl(path)}${qs ? `?${qs}` : ""}`;
  },

  downloadPdf: async (
    registrationNo: string,
    params?: { mobile?: string; dob?: string }
  ) => {
    const res = await api.get(
      `/admit/pdf/${encodeURIComponent(registrationNo)}`,
      {
        params,
        responseType: "blob",
      }
    );
    return res.data as Blob;
  },
};
