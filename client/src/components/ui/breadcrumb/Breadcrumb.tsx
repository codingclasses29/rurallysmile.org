import Link from "next/link";
import { HiChevronRight, HiHome } from "react-icons/hi";
import { cn } from "@/utils/cn";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-slate-500">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-brand-secondary"
          >
            <HiHome size={14} />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              <HiChevronRight className="text-slate-300" size={14} />
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="font-medium hover:text-brand-secondary"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "font-semibold",
                    last ? "text-brand-primary dark:text-white" : ""
                  )}
                  aria-current={last ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
