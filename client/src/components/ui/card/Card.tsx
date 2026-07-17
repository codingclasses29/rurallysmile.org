"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export type CardVariant =
  | "default"
  | "student"
  | "notice"
  | "prize"
  | "gallery"
  | "dashboard";

const variantStyles: Record<CardVariant, string> = {
  default: "border-teal-100 bg-white/95 dark:border-slate-700 dark:bg-slate-900",
  student:
    "border-teal-100 bg-gradient-to-br from-white to-teal-50/60 dark:from-slate-900 dark:to-slate-800",
  notice:
    "border-l-4 border-l-brand-primary border-teal-100 bg-white dark:bg-slate-900",
  prize:
    "border-brand-accent/30 bg-gradient-to-b from-amber-50 to-white text-center dark:from-slate-800 dark:to-slate-900",
  gallery: "overflow-hidden border-brand-border bg-slate-100 p-0 dark:bg-slate-800",
  dashboard:
    "border-teal-100 bg-white shadow-card hover:shadow-hover dark:border-slate-700 dark:bg-slate-900",
};

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
}

export function Card({
  className,
  children,
  variant = "default",
  hoverable = false,
  header,
  footer,
  ...props
}: CardProps) {
  const classes = cn(
    "rounded-3xl border p-6 shadow-soft transition duration-300",
    variantStyles[variant],
    hoverable && "cursor-pointer",
    className
  );

  const content = (
    <>
      {header && (
        <div className="mb-4 border-b border-brand-border pb-3">{header}</div>
      )}
      {children}
      {footer && (
        <div className="mt-4 border-t border-brand-border pt-3">{footer}</div>
      )}
    </>
  );

  if (hoverable) {
    return (
      <motion.div
        className={classes}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
        onClick={props.onClick}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className={classes} {...props}>
      {content}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "font-heading text-lg font-bold text-brand-primary dark:text-white",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn("mt-1 text-sm text-slate-600 dark:text-slate-300", className)}
    >
      {children}
    </p>
  );
}
