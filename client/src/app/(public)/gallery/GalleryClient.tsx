"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { galleryService } from "@/services/gallery.service";
import type { GalleryItem } from "@/types";
import { notify } from "@/components/ui/toast/Toast";
import { GALLERY_ITEMS } from "@/constants/site";

export default function GalleryClient() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await galleryService.list();
        const apiItems = res.data?.items || [];
        setItems(apiItems);
      } catch {
        notify.error("Gallery API unavailable — showing sample images");
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fallback =
    items.length === 0 && !loading
      ? GALLERY_ITEMS.map((g, i) => ({
          _id: `fallback-${i}`,
          title: g.title,
          imageUrl: g.imageUrl,
          category: g.category,
        }))
      : items;

  return (
    <>
      <PageHeader
        title="Gallery"
        description="Event photos and moments from Pratibha Khoj"
      />
      <div className="container-page section-pad pt-0">
        {loading && (
          <p className="py-10 text-center text-slate-400">Loading gallery…</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fallback.map((item) => (
            <figure
              key={item._id}
              className="overflow-hidden rounded-ui-lg border border-brand-border bg-white dark:bg-slate-900"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-48 w-full object-cover"
              />
              <figcaption className="p-3 text-sm font-semibold">
                {item.title}
                {item.category && (
                  <span className="mt-1 block text-xs font-normal text-slate-400">
                    {item.category}
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </>
  );
}
