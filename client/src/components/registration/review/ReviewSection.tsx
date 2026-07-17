"use client";

import { HiPencil } from "react-icons/hi";
import { cn } from "@/utils/cn";

type Props = {
  title: string;
  stepId: number;
  onEdit?: (step: number) => void;
  children: React.ReactNode;
  className?: string;
};

export function ReviewSection({
  title,
  stepId,
  onEdit,
  children,
  className,
}: Props) {
  return (
    <section
      className={cn(
        "rounded-ui-lg border border-brand-border bg-white p-4 dark:bg-slate-900",
        className
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="font-heading font-bold text-brand-secondary">{title}</h3>
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(stepId)}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-secondary hover:underline"
          >
            <HiPencil className="h-3.5 w-3.5" />
            Edit
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
