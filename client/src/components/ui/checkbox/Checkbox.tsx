"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const boxId = id || props.name;

    return (
      <div className="space-y-1">
        <label
          htmlFor={boxId}
          className={cn(
            "inline-flex cursor-pointer items-start gap-2.5 text-sm text-brand-text dark:text-slate-200",
            props.disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <input
            ref={ref}
            id={boxId}
            type="checkbox"
            className={cn(
              "mt-0.5 h-4 w-4 rounded border-brand-border text-brand-secondary focus:ring-brand-secondary/30",
              className
            )}
            {...props}
          />
          {label && <span>{label}</span>}
        </label>
        {error && <p className="text-xs text-brand-danger">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
