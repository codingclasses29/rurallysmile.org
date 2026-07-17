"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SITE } from "@/constants/site";

export function Announcement() {
  return (
    <div
      className="overflow-hidden bg-brand-secondary text-white"
      role="region"
      aria-label="Announcement"
    >
      <div className="container-page flex items-center gap-3 py-2">
        <span className="hidden shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide sm:inline">
          Notice
        </span>
        <div className="relative min-w-0 flex-1 overflow-hidden" aria-live="polite">
          <motion.p
            className="whitespace-nowrap text-xs font-medium sm:text-sm"
            animate={{ x: ["100%", "-100%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            {SITE.announcement} · Last Date: {SITE.lastDateLabel} · Exam:{" "}
            {SITE.examDateLabel}
          </motion.p>
        </div>
        <Link
          href="/registration"
          className="shrink-0 rounded-full bg-brand-accent px-3 py-1 text-xs font-bold text-brand-primary transition hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}
