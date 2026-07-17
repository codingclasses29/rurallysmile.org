"use client";

import { HiCheck } from "react-icons/hi";
import { cn } from "@/utils/cn";
import { FORM_STEP_COUNT, REG_STEPS } from "@/types/registration";

type Props = {
  step: number;
  onJump?: (step: number) => void;
  allowJumpToCompleted?: boolean;
};

export function StepIndicator({
  step,
  onJump,
  allowJumpToCompleted = true,
}: Props) {
  const steps = REG_STEPS.slice(0, FORM_STEP_COUNT);

  return (
    <nav aria-label="Registration steps" className="w-full overflow-x-auto pb-1">
      <ol className="flex min-w-max items-center gap-1 sm:gap-2">
        {steps.map((s, idx) => {
          const done = step > s.id;
          const active = step === s.id;
          const clickable = allowJumpToCompleted && done && onJump;

          return (
            <li key={s.id} className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onJump?.(s.id)}
                className={cn(
                  "group flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold transition",
                  active && "bg-brand-secondary text-white shadow-sm",
                  done && !active && "bg-emerald-100 text-brand-success",
                  !done && !active && "bg-slate-100 text-slate-500",
                  clickable && "hover:ring-2 hover:ring-brand-secondary/30"
                )}
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px]",
                    active && "bg-white/20",
                    done && !active && "bg-brand-success text-white"
                  )}
                >
                  {done ? <HiCheck className="h-3 w-3" /> : s.id}
                </span>
                <span className="hidden sm:inline">{s.short}</span>
              </button>
              {idx < steps.length - 1 && (
                <span
                  className={cn(
                    "hidden h-px w-3 sm:block",
                    done ? "bg-brand-success" : "bg-slate-200"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
