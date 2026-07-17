"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronDown, HiMenuAlt3, HiX } from "react-icons/hi";
import { MAIN_NAV, MOBILE_NAV, SITE } from "@/constants/site";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/utils/cn";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-ui-sm text-brand-primary hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary dark:text-white dark:hover:bg-slate-800"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={panelId}
      >
        {open ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu overlay"
              className="fixed inset-0 z-40 bg-brand-primary/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-50 flex w-[min(100%,320px)] flex-col bg-white shadow-modal dark:bg-slate-900"
            >
              <div className="flex items-center justify-between border-b border-brand-border px-4 py-3">
                <div>
                  <p className="font-heading text-sm font-bold text-brand-primary dark:text-white">
                    {SITE.org}
                  </p>
                  <p className="text-[11px] text-brand-secondary">{SITE.shortName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-ui-sm p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Close"
                >
                  <HiX size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-3">
                <ul className="space-y-1">
                  {MOBILE_NAV.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "block rounded-ui px-3 py-2.5 text-sm font-semibold",
                          pathname === link.href
                            ? "bg-brand-primary text-white"
                            : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="mb-2 mt-5 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  More
                </p>
                <ul className="space-y-1">
                  {MAIN_NAV.filter((n) => n.children?.length).map((item) => {
                    const isOpen = expanded === item.label;
                    return (
                      <li key={item.label}>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-ui px-3 py-2.5 text-left text-sm font-semibold text-slate-700 dark:text-slate-200"
                          aria-expanded={isOpen}
                          onClick={() =>
                            setExpanded(isOpen ? null : item.label)
                          }
                        >
                          {item.label}
                          <HiChevronDown
                            className={cn("transition", isOpen && "rotate-180")}
                          />
                        </button>
                        <AnimatePresence>
                          {isOpen && item.children && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden pl-3"
                            >
                              {item.children.map((c) => (
                                <li key={c.href + c.label}>
                                  <Link
                                    href={c.href}
                                    onClick={() => setOpen(false)}
                                    className="block rounded-ui px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                                  >
                                    {c.label}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="space-y-3 border-t border-brand-border p-4">
                <ThemeToggle />
                <Link href="/admin/login" onClick={() => setOpen(false)}>
                  <Button fullWidth size="sm" variant="secondary">
                    Admin Login
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
