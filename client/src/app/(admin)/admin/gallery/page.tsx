"use client";

import { useEffect, useState } from "react";
import { galleryService } from "@/services/gallery.service";
import type { GalleryItem } from "@/types";
import { notify } from "@/components/ui/toast/Toast";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await galleryService.list();
        setItems(res.data?.items || []);
      } catch {
        notify.error("Failed to load gallery");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="h3 fw-bold mb-1">Gallery</h1>
      <p className="text-muted mb-4">Published event photos</p>
      {loading && <div className="spinner-border text-primary" />}
      <div className="row g-3">
        {items.map((item) => (
          <div className="col-6 col-md-4 col-xl-3" key={item._id}>
            <div className="admin-coming-card overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-100"
                style={{ height: 140, objectFit: "cover" }}
              />
              <div className="p-2 small fw-semibold">{item.title}</div>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="text-muted">No gallery items yet. Upload via API /admin gallery tools.</p>
        )}
      </div>
    </div>
  );
}
