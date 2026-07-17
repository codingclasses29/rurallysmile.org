"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";
import { MAIN_NAV, type NavItem } from "@/constants/site";
import { cn } from "@/utils/cn";

function NavDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const panelId = useId();
  const pathname = usePathname();
  const active =
    item.href === pathname ||
    item.children?.some((c) => c.href === pathname) ||
    false;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!item.children?.length) {
    return (
      <li>
        <Link
          href={item.href || "/"}
          className={cn(
            "inline-flex h-9 items-center whitespace-nowrap rounded-full px-2.5 py-2 text-xs font-semibold transition xl:px-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400",
            pathname === item.href
              ? "bg-white text-teal-800 shadow-sm"
              : "text-white/90 hover:bg-white/15 hover:text-white"
          )}
        >
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li className="relative" ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className={cn(
          "inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-xs font-semibold transition xl:px-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400",
          active || open
            ? "bg-white text-teal-800 shadow-sm"
            : "text-white/90 hover:bg-white/15 hover:text-white"
        )}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {item.label}
        <HiChevronDown
          className={cn("transition", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="menu"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 min-w-[240px] pt-2"
          >
            <div className="overflow-hidden rounded-2xl border border-teal-100 bg-white py-2 shadow-hover dark:border-slate-700 dark:bg-slate-900">
              {item.children.map((child) => (
                <Link
                  key={child.href + child.label}
                  href={child.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block border-l-4 border-transparent px-4 py-2.5 transition hover:border-orange-400 hover:bg-teal-50 dark:hover:bg-slate-800"
                >
                  <span className="block text-sm font-semibold text-brand-primary dark:text-white">
                    {child.label}
                  </span>
                  {child.description && (
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {child.description}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/** Desktop / laptop navigation (mega when dropdowns open) */
export function Navbar({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  /** Compact tablet: fewer top-level items */
  const items = compact
    ? MAIN_NAV.filter((n) =>
        ["Home", "About", "Registration", "Student Corner", "Contact"].includes(
          n.label
        )
      )
    : MAIN_NAV;

  return (
    <nav aria-label="Main navigation" className={cn("min-w-0", className)}>
      <ul className="flex flex-nowrap items-center justify-center gap-0.5 whitespace-nowrap">
        {items.map((item) => (
          <NavDropdown key={item.label} item={item} />
        ))}
      </ul>
    </nav>
  );
}
