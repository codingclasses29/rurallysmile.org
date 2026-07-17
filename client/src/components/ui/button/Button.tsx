"use client";

import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import type { ButtonProps, ButtonSize, ButtonVariant } from "./button.types";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-primary text-white hover:bg-slate-800 shadow-sm",
  secondary: "bg-brand-secondary text-white hover:bg-blue-700 shadow-sm",
  success: "bg-brand-success text-white hover:bg-green-700 shadow-sm",
  danger: "bg-brand-danger text-white hover:bg-red-700 shadow-sm",
  outline:
    "border-2 border-brand-secondary text-brand-secondary bg-transparent hover:bg-brand-secondary hover:text-white",
  ghost: "bg-transparent text-brand-primary hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800",
  accent: "bg-brand-accent text-brand-primary hover:bg-amber-400 shadow-sm",
  icon: "bg-slate-100 text-brand-primary hover:bg-slate-200 p-0 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-ui-sm",
  md: "px-5 py-2.5 text-sm md:text-base rounded-ui",
  lg: "px-6 py-3 text-base rounded-ui",
};

const iconSizes: Record<ButtonSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      leftIcon,
      rightIcon,
      fullWidth,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isIcon = variant === "icon";

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/40",
          "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:transition after:duration-500",
          "active:after:animate-none hover:after:bg-white/10",
          variants[variant],
          isIcon ? iconSizes[size] : sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && (
          <span
            className={cn(
              "h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
              !isIcon && "opacity-90"
            )}
            aria-hidden
          />
        )}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export type { ButtonProps, ButtonVariant, ButtonSize };
