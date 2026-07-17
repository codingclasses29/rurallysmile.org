import { cn } from "@/utils/cn";

const statusStyles = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  approved: "bg-green-100 text-brand-success dark:bg-green-900/40 dark:text-green-300",
  rejected: "bg-red-100 text-brand-danger dark:bg-red-900/40 dark:text-red-300",
  published: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200",
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  inactive: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  success: "bg-green-100 text-brand-success",
  danger: "bg-red-100 text-brand-danger",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-blue-100 text-brand-secondary",
  gray: "bg-slate-100 text-slate-700",
} as const;

export type BadgeStatus = keyof typeof statusStyles;

export function Badge({
  children,
  status,
  tone,
  className,
}: {
  children: React.ReactNode;
  status?: BadgeStatus;
  /** @deprecated use status */
  tone?: BadgeStatus;
  className?: string;
}) {
  const key = status || tone || "info";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        statusStyles[key],
        className
      )}
    >
      {children}
    </span>
  );
}
