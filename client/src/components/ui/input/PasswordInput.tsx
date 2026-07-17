"use client";

import { forwardRef, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Input, type InputProps } from "./Input";
import { cn } from "@/utils/cn";

export type PasswordInputProps = Omit<InputProps, "type" | "rightIcon">;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <Input
        ref={ref}
        {...props}
        type={show ? "text" : "password"}
        className={cn(className)}
        rightIcon={
          <button
            type="button"
            tabIndex={-1}
            className="flex items-center text-slate-400 hover:text-brand-primary"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <HiEyeOff size={18} /> : <HiEye size={18} />}
          </button>
        }
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";
