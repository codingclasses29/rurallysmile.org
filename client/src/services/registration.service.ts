import api, { buildApiUrl } from "@/lib/api";
import type { ApiResponse } from "@/types";

export type RegisterResult = {
  registrationNumber: string;
  student?: Record<string, unknown>;
};

export const registrationService = {
  sendOtp: async (email: string) => {
    const { data } = await api.post<
      ApiResponse<{
        email: string;
        expiresIn: number;
        channel?: "email";
        devOtp?: string;
      }>
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
      // Let the browser set multipart boundary — do not force Content-Type
      headers: { "Content-Type": undefined as unknown as string },
      transformRequest: [
        (body, headers) => {
          if (headers && typeof headers === "object") {
            delete (headers as Record<string, unknown>)["Content-Type"];
          }
          return body;
        },
      ],
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
    buildApiUrl(
      `/registration/receipt/${encodeURIComponent(registrationNumber)}`
    ),
};
