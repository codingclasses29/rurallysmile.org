"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils/cn";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function FlipDigit({ value, light }: { value: string; light?: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden font-mono text-2xl tabular-nums sm:text-4xl md:text-5xl",
        light ? "portal-countdown-box" : "rounded-ui border border-white/20 bg-brand-primary/80 text-white shadow-lg"
      )}
      style={{ perspective: 600 }}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -24, opacity: 0, rotateX: -60 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          exit={{ y: 24, opacity: 0, rotateX: 60 }}
          transition={{ duration: 0.35 }}
          className="block px-2 py-3 text-center fw-bold sm:px-3 sm:py-4"
        >
          {value}
        </motion.span>
      </AnimatePresence>
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-1/2 h-px",
          light ? "bg-cyan-200" : "bg-white/20"
        )}
        aria-hidden
      />
    </div>
  );
}

export function FlipCountdown({
  targetDate,
  variant = "light",
  label = "Exam Starts In",
  className,
}: {
  targetDate: string;
  variant?: "dark" | "light";
  label?: string;
  className?: string;
}) {
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

  const light = variant === "light";
  const items = [
    { label: "Days", value: pad(left.d), color: "text-success" },
    { label: "Hours", value: pad(left.h), color: "text-primary" },
    { label: "Minutes", value: pad(left.m), color: "text-warning" },
    { label: "Seconds", value: pad(left.s), color: "text-info" },
  ];

  return (
    <div
      className={cn("card border-0 shadow-lg mx-auto", className)}
      style={{ maxWidth: 640, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)" }}
      role="timer"
      aria-live="polite"
      aria-label={label}
    >
      <div className="card-body p-4 p-md-5">
        <p
          className={cn(
            "mb-4 text-center text-sm fw-bold text-uppercase tracking-widest",
            light ? "text-primary" : "text-white"
          )}
        >
          <i className="bi bi-alarm me-2" aria-hidden />
          {label}
        </p>
        <div className="row g-2 g-sm-3">
          {items.map((item) => (
            <div key={item.label} className="col-3 text-center">
              <FlipDigit value={item.value} light={light} />
              <p
                className={cn(
                  "mt-2 text-[10px] fw-semibold text-uppercase sm:text-xs",
                  light ? item.color : "text-white/70"
                )}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
