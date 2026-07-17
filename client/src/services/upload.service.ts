import api from "@/lib/api";
import type { ApiResponse } from "@/types";

export const uploadService = {
  image: async (file: File) => {
    const form = new FormData();
    form.append("image", file);
    const { data } = await api.post<ApiResponse<{ url: string }>>(
      "/upload/image",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },
};
