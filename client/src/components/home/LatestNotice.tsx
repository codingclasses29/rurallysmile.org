"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LATEST_NOTICES } from "@/constants/site";
import { Button } from "@/components/ui/Button";
import { SectionReveal } from "@/components/home/SectionReveal";
import { motion } from "framer-motion";
import { noticeService } from "@/services/notice.service";
import type { Notice } from "@/types";

type Card = { title: string; date: string; slug?: string; _id?: string };

export function LatestNotice() {
  const [cards, setCards] = useState<Card[]>(
    LATEST_NOTICES.map((n) => ({
      title: n.title,
      date: n.date,
      slug: n.slug,
    }))
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await noticeService.list();
        const list = res.data?.notices || [];
        if (list.length) {
          setCards(
            list.slice(0, 4).map((n: Notice) => ({
              _id: n._id,
              title: n.title,
              date: n.createdAt
                ? new Date(n.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "",
            }))
          );
        }
      } catch {
        /* keep static fallback */
      }
    })();
  }, []);

  return (
    <section className="portal-section-pad bg-section-white" id="notices">
      <div className="container-page">
        <SectionReveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-secondary">
                Updates
              </p>
              <h2 className="section-title mt-2">Latest Notices</h2>
              <p className="section-subtitle">नवीनतम सूचनाएँ और दिशा-निर्देश</p>
            </div>
            <Link href="/notice">
              <Button variant="outline" size="sm">
                View All Notices
              </Button>
            </Link>
          </div>
        </SectionReveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((n, i) => (
            <SectionReveal key={n._id || n.slug || i} delay={i * 0.05}>
              <motion.div whileHover={{ y: -4 }}>
                <Link
                  href="/notice"
                  className="group block h-full rounded-ui-lg border border-brand-border bg-slate-50 p-5 transition hover:border-brand-secondary hover:bg-white hover:shadow-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  <span className="text-xs font-semibold text-brand-secondary">
                    {n.date}
                  </span>
                  <h3 className="mt-2 font-heading text-base font-bold text-brand-primary group-hover:text-brand-secondary dark:text-white">
                    {n.title}
                  </h3>
                </Link>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
