import api from "@/lib/api";
import type { ApiResponse } from "@/types";

export type PortalSettings = {
  siteName?: string;
  registrationOpen?: boolean;
  resultPublished?: boolean;
  admitAvailable?: boolean;
  contactPhone?: string;
  contactWebsite?: string;
  examDate?: string;
  medium?: string;
};

export const settingsService = {
  get: async () => {
    const { data } = await api.get<ApiResponse<{ setting: PortalSettings }>>(
      "/settings"
    );
    return data;
  },
};
