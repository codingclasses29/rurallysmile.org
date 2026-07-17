"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { FORM_STEP_COUNT, REG_STEPS } from "@/types/registration";

type Props = {
  step: number;
  className?: string;
};

export function ProgressBar({ step, className }: Props) {
  const capped = Math.min(Math.max(step, 1), FORM_STEP_COUNT);
  const percent = Math.round((capped / FORM_STEP_COUNT) * 100);

  return (
    <div className={cn("w-full", className)} aria-hidden={false}>
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
        <span>
          Step {capped} of {FORM_STEP_COUNT}
        </span>
        <span className="font-mono text-brand-secondary">{percent}%</span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Registration progress ${percent}%`}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-secondary to-sky-400"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {REG_STEPS.find((s) => s.id === capped)?.hindi} ·{" "}
        {REG_STEPS.find((s) => s.id === capped)?.title}
      </p>
    </div>
  );
}
