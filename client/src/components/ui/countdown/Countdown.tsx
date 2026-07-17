"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export type CountdownProps = {
  targetDate: string;
  variant?: "dark" | "light";
  label?: string;
  className?: string;
};

export function Countdown({
  targetDate,
  variant = "dark",
  label = "Exam Starts In",
  className,
}: CountdownProps) {
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const items = [
    { label: "Days", value: left.d },
    { label: "Hours", value: left.h },
    { label: "Minutes", value: left.m },
    { label: "Seconds", value: left.s },
  ];

  const light = variant === "light";

  return (
    <div className={className}>
      <p
        className={cn(
          "mb-3 text-center text-sm font-semibold uppercase tracking-wider",
          light ? "text-brand-secondary" : "text-blue-100"
        )}
      >
        {label}
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              "rounded-ui px-2 py-3 text-center sm:py-4",
              light
                ? "border border-brand-border bg-slate-50 shadow-sm dark:bg-slate-800"
                : "border border-white/15 bg-white/10 backdrop-blur"
            )}
          >
            <div
              className={cn(
                "font-mono text-xl font-bold tabular-nums sm:text-3xl",
                light ? "text-brand-primary dark:text-white" : "text-white"
              )}
            >
              {pad(item.value)}
            </div>
            <div
              className={cn(
                "mt-1 text-[10px] font-medium uppercase tracking-wide sm:text-xs",
                light ? "text-slate-500" : "text-white/75"
              )}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Backward-compatible alias */
export const CountdownTimer = Countdown;
