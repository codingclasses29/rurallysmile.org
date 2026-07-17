"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import { HiCheckCircle, HiExclamationCircle } from "react-icons/hi";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string | boolean;
  hint?: string;
  requiredMark?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      success,
      hint,
      id,
      required,
      requiredMark,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name;
    const showSuccess = Boolean(success) && !error;
    const successText = typeof success === "string" ? success : undefined;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {label}
            {(required || requiredMark) && (
              <span className="ml-0.5 text-brand-danger">*</span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            required={required}
            className={cn(
              "w-full rounded-ui border border-brand-border bg-white px-4 py-2.5 text-sm text-brand-text outline-none transition",
              "placeholder:text-slate-400",
              "focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
              "dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800",
              leftIcon && "pl-10",
              (rightIcon || error || showSuccess) && "pr-10",
              error &&
                "border-brand-danger focus:border-brand-danger focus:ring-brand-danger/20",
              showSuccess &&
                "border-brand-success focus:border-brand-success focus:ring-brand-success/20",
              className
            )}
            aria-invalid={Boolean(error)}
            {...props}
          />
          {(rightIcon || error || showSuccess) && (
            <span
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2",
                (error || showSuccess) && !rightIcon && "pointer-events-none"
              )}
            >
              {error ? (
                <HiExclamationCircle className="text-brand-danger" size={18} />
              ) : showSuccess && !rightIcon ? (
                <HiCheckCircle className="text-brand-success" size={18} />
              ) : (
                rightIcon
              )}
            </span>
          )}
        </div>

        {error && <p className="text-xs text-brand-danger">{error}</p>}
        {!error && successText && (
          <p className="text-xs text-brand-success">{successText}</p>
        )}
        {!error && !successText && hint && (
          <p className="text-xs text-slate-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
