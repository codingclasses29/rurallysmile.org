"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiBell } from "react-icons/hi";
import { HEADER_NOTIFICATIONS } from "@/constants/site";
import { cn } from "@/utils/cn";

export function NotificationBell({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-ui-sm text-brand-primary transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary dark:text-white dark:hover:bg-slate-800"
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <HiBell size={18} aria-hidden />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-danger" aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="menu"
            aria-label="Latest notifications"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-ui-lg border border-brand-border bg-white shadow-hover dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="border-b border-brand-border px-4 py-3">
              <p className="font-heading text-sm font-bold text-brand-primary dark:text-white">
                Notifications
              </p>
            </div>
            <ul>
              {HEADER_NOTIFICATIONS.map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="block border-b border-brand-border px-4 py-3 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-brand-primary dark:text-white">
                        {n.title}
                      </p>
                      <span className="text-[10px] font-bold uppercase text-brand-secondary">
                        {n.time}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{n.message}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/notice"
              onClick={() => setOpen(false)}
              className="block bg-slate-50 px-4 py-2.5 text-center text-xs font-bold text-brand-secondary dark:bg-slate-800"
            >
              View all notices
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
