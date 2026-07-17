import api from "@/lib/api";
import type { ApiResponse } from "@/types";

export type RegisterResult = {
  registrationNumber: string;
  student?: Record<string, unknown>;
};

export const registrationService = {
  sendOtp: async (email: string) => {
    const { data } = await api.post<
      ApiResponse<{ email: string; expiresIn: number; devOtp?: string }>
    >("/registration/send-otp", { email });
    return data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const { data } = await api.post<ApiResponse<{ verified: boolean }>>(
      "/registration/verify-otp",
      { email, otp }
    );
    return data;
  },

  submit: async (formData: FormData) => {
    const { data } = await api.post<{
      success: boolean;
      registrationNumber: string;
      message: string;
      data: RegisterResult;
    }>("/registration", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  status: async (params: { registrationNumber?: string; mobile?: string }) => {
    const { data } = await api.get<ApiResponse>("/registration/status", {
      params,
    });
    return data;
  },

  receiptUrl: (registrationNumber: string) =>
    `/api/v1/registration/receipt/${encodeURIComponent(registrationNumber)}`,
};
