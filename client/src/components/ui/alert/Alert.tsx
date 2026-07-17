"use client";

import { HiCheckCircle, HiExclamation, HiInformationCircle, HiXCircle } from "react-icons/hi";
import { cn } from "@/utils/cn";

const variants = {
  success: {
    wrap: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950/50 dark:text-green-100",
    Icon: HiCheckCircle,
  },
  error: {
    wrap: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100",
    Icon: HiXCircle,
  },
  warning: {
    wrap: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100",
    Icon: HiExclamation,
  },
  info: {
    wrap: "border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-100",
    Icon: HiInformationCircle,
  },
} as const;

export type AlertVariant = keyof typeof variants;

export function Alert({
  variant = "info",
  title,
  children,
  className,
  onClose,
}: {
  variant?: AlertVariant;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  onClose?: () => void;
}) {
  const { wrap, Icon } = variants[variant];

  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-ui border px-4 py-3 text-sm shadow-sm",
        wrap,
        className
      )}
    >
      <Icon className="mt-0.5 shrink-0" size={20} />
      <div className="min-w-0 flex-1">
        {title && <p className="font-heading font-bold">{title}</p>}
        {children && <div className={cn(title && "mt-1")}>{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 opacity-60 hover:opacity-100"
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}
