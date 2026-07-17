"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/utils/cn";

type Props = {
  length?: number;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  error?: string;
};

export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled,
  error,
}: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const setAt = (index: number, char: string) => {
    const next = digits.map((d, i) => (i === index ? char : d));
    onChange(next.join("").replace(/\D/g, "").slice(0, length));
  };

  return (
    <div>
      <div className="flex justify-center gap-2 sm:gap-3">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={1}
            disabled={disabled}
            value={d}
            aria-label={`OTP digit ${i + 1}`}
            className={cn(
              "h-12 w-10 rounded-ui border text-center font-mono text-lg font-bold outline-none transition sm:h-14 sm:w-12",
              error
                ? "border-brand-danger bg-red-50"
                : "border-slate-300 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20 dark:border-slate-600 dark:bg-slate-900"
            )}
            onChange={(e) => {
              const char = e.target.value.replace(/\D/g, "").slice(-1);
              setAt(i, char);
              if (char && i < length - 1) refs.current[i + 1]?.focus();
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !digits[i] && i > 0) {
                refs.current[i - 1]?.focus();
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const pasted = e.clipboardData
                .getData("text")
                .replace(/\D/g, "")
                .slice(0, length);
              onChange(pasted);
              const focusIdx = Math.min(pasted.length, length - 1);
              refs.current[focusIdx]?.focus();
            }}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-center text-xs font-medium text-brand-danger">
          {error}
        </p>
      )}
    </div>
  );
}
