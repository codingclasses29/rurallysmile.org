import api from "@/lib/api";
import type { ApiResponse, GalleryItem } from "@/types";

export const galleryService = {
  list: async () => {
    const { data } = await api.get<ApiResponse<{ items: GalleryItem[] }>>(
      "/gallery"
    );
    return data;
  },
};
