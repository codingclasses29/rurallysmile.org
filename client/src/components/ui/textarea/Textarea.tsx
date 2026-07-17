"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  requiredMark?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      id,
      required,
      requiredMark,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const areaId = id || props.name;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={areaId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {label}
            {(required || requiredMark) && (
              <span className="ml-0.5 text-brand-danger">*</span>
            )}
          </label>
        )}
        <textarea
          id={areaId}
          ref={ref}
          rows={rows}
          disabled={disabled}
          required={required}
          className={cn(
            "w-full rounded-ui border border-brand-border bg-white px-4 py-2.5 text-sm text-brand-text outline-none transition",
            "placeholder:text-slate-400 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20",
            "disabled:cursor-not-allowed disabled:bg-slate-50",
            "dark:border-slate-600 dark:bg-slate-900 dark:text-white",
            error &&
              "border-brand-danger focus:border-brand-danger focus:ring-brand-danger/20",
            className
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {error && <p className="text-xs text-brand-danger">{error}</p>}
        {!error && hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
