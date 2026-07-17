"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GALLERY_ITEMS } from "@/constants/site";
import { Button } from "@/components/ui/Button";
import { SectionReveal } from "@/components/home/SectionReveal";
import { motion } from "framer-motion";
import { galleryService } from "@/services/gallery.service";
import type { GalleryItem } from "@/types";

const tones = [
  "from-blue-600 to-indigo-700",
  "from-emerald-500 to-teal-700",
  "from-amber-500 to-orange-600",
  "from-slate-700 to-slate-900",
  "from-rose-500 to-pink-700",
  "from-cyan-500 to-sky-700",
];

type Card = {
  id: string;
  title: string;
  category?: string;
  imageUrl?: string;
};

export function Gallery() {
  const [items, setItems] = useState<Card[]>(
    GALLERY_ITEMS
      .filter((g) => ["2", "9", "13", "14", "16", "17"].includes(g.id))
      .map((g) => ({
        id: g.id,
        title: g.title,
        category: g.category,
        imageUrl: g.imageUrl,
      }))
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await galleryService.list();
        const apiItems = (res.data?.items || []) as GalleryItem[];
        if (apiItems.length) {
          setItems(
            apiItems.slice(0, 6).map((g) => ({
              id: g._id,
              title: g.title,
              category: g.category,
              imageUrl: g.imageUrl,
            }))
          );
        }
      } catch {
        /* keep static fallback */
      }
    })();
  }, []);

  return (
    <section className="portal-section-pad bg-section-dots" id="gallery-preview">
      <div className="container-page">
        <SectionReveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-secondary">
                Moments
              </p>
              <h2 className="section-title mt-2">Gallery</h2>
              <p className="section-subtitle">
                प्रतियोगिता, छात्रों और पुरस्कार वितरण की झलकियाँ
              </p>
            </div>
            <Link href="/gallery">
              <Button variant="outline" size="sm">
                Full Gallery
              </Button>
            </Link>
          </div>
        </SectionReveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <SectionReveal key={item.id} delay={i * 0.04}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`group relative aspect-[4/3] overflow-hidden rounded-ui-lg bg-gradient-to-br ${tones[i % tones.length]}`}
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center bg-black/25 p-4 text-center">
                  <div>
                    <p className="font-heading text-lg font-bold text-white">
                      {item.title}
                    </p>
                    {item.category ? (
                      <p className="mt-1 text-xs text-white/80">{item.category}</p>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
