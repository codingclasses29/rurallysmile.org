"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { HiSearch, HiX } from "react-icons/hi";
import { SEARCH_INDEX } from "@/constants/site";
import { cn } from "@/utils/cn";

export function HeaderSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const titleId = useId();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = SEARCH_INDEX.filter((item) => {
    const query = q.trim().toLowerCase();
    if (!query) return true;
    return (
      item.label.toLowerCase().includes(query) ||
      item.keywords.some((k) => k.toLowerCase().includes(query))
    );
  }).slice(0, 8);

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    router.push(href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-ui-sm text-brand-primary transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary dark:text-white dark:hover:bg-slate-800",
          className
        )}
        aria-label="Search website"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <HiSearch size={18} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[90] flex items-start justify-center bg-brand-primary/40 p-4 pt-[12vh] backdrop-blur-sm">
            <button
              type="button"
              className="absolute inset-0"
              aria-label="Close search"
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className="relative w-full max-w-lg overflow-hidden rounded-ui-lg border border-brand-border bg-white shadow-modal dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-center gap-2 border-b border-brand-border px-3">
                <HiSearch className="text-slate-400" aria-hidden />
                <input
                  ref={inputRef}
                  id={titleId}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search Notice, Registration, Result…"
                  className="w-full bg-transparent py-3 text-sm outline-none dark:text-white"
                  aria-label="Search"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded p-1 text-slate-400 hover:text-brand-primary"
                  aria-label="Close"
                >
                  <HiX size={18} />
                </button>
              </div>
              <ul className="max-h-72 overflow-y-auto py-2" role="listbox">
                {results.length === 0 && (
                  <li className="px-4 py-3 text-sm text-slate-500">No results</li>
                )}
                {results.map((item) => (
                  <li key={item.href}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={false}
                      className="flex w-full px-4 py-2.5 text-left text-sm font-medium text-brand-primary hover:bg-slate-50 dark:text-white dark:hover:bg-slate-800"
                      onClick={() => go(item.href)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="border-t border-brand-border px-4 py-2 text-[11px] text-slate-400">
                Tip: Press <kbd className="rounded bg-slate-100 px-1 dark:bg-slate-800">Ctrl</kbd>+
                <kbd className="rounded bg-slate-100 px-1 dark:bg-slate-800">K</kbd>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
