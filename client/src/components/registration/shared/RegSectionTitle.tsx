"use client";

import { cn } from "@/utils/cn";

type Props = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function RegSectionTitle({ title, subtitle, className }: Props) {
  return (
    <div className={cn("mb-1", className)}>
      <h3 className="font-heading text-base font-bold text-brand-secondary">
        {title}
      </h3>
      {subtitle && (
        <p className="mt-1 text-sm leading-relaxed text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}
