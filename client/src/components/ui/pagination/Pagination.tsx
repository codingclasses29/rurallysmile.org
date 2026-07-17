"use client";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button/Button";

export type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
};

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function Pagination({
  page,
  totalPages,
  onChange,
  className,
  siblingCount = 1,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const left = Math.max(1, page - siblingCount);
  const right = Math.min(totalPages, page + siblingCount);
  const pages = range(left, right);

  return (
    <nav
      className={cn("flex items-center gap-1", className)}
      aria-label="Pagination"
    >
      <Button
        size="sm"
        variant="ghost"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous"
      >
        <HiChevronLeft /> Previous
      </Button>

      {left > 1 && (
        <>
          <PageBtn n={1} active={page === 1} onClick={onChange} />
          {left > 2 && <span className="px-1 text-slate-400">…</span>}
        </>
      )}

      {pages.map((n) => (
        <PageBtn key={n} n={n} active={page === n} onClick={onChange} />
      ))}

      {right < totalPages && (
        <>
          {right < totalPages - 1 && (
            <span className="px-1 text-slate-400">…</span>
          )}
          <PageBtn
            n={totalPages}
            active={page === totalPages}
            onClick={onChange}
          />
        </>
      )}

      <Button
        size="sm"
        variant="ghost"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next"
      >
        Next <HiChevronRight />
      </Button>
    </nav>
  );
}

function PageBtn({
  n,
  active,
  onClick,
}: {
  n: number;
  active: boolean;
  onClick: (n: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(n)}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-ui-sm px-2 text-sm font-semibold transition",
        active
          ? "bg-brand-secondary text-white"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      )}
      aria-current={active ? "page" : undefined}
    >
      {n}
    </button>
  );
}
