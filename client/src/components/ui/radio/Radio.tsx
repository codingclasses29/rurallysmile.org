"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const radioId = id || `${props.name}-${props.value}`;

    return (
      <label
        htmlFor={radioId}
        className={cn(
          "inline-flex cursor-pointer items-center gap-2.5 text-sm text-brand-text dark:text-slate-200",
          props.disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <input
          ref={ref}
          id={radioId}
          type="radio"
          className={cn(
            "h-4 w-4 border-brand-border text-brand-secondary focus:ring-brand-secondary/30",
            className
          )}
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
    );
  }
);

Radio.displayName = "Radio";

export function RadioGroup({
  label,
  children,
  error,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <fieldset className={cn("space-y-2", className)}>
      {label && (
        <legend className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </legend>
      )}
      <div className="flex flex-wrap gap-4">{children}</div>
      {error && <p className="text-xs text-brand-danger">{error}</p>}
    </fieldset>
  );
}
