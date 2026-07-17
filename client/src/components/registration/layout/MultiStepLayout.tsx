"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card/Card";
import { ProgressBar } from "../progress/ProgressBar";
import { StepIndicator } from "../progress/StepIndicator";
import { REG_STEPS } from "@/types/registration";
import { cn } from "@/utils/cn";

type Props = {
  step: number;
  children: React.ReactNode;
  onJump?: (step: number) => void;
  footer?: React.ReactNode;
  className?: string;
};

export function MultiStepLayout({
  step,
  children,
  onJump,
  footer,
  className,
}: Props) {
  const meta = REG_STEPS.find((s) => s.id === step);

  return (
    <Card className={cn("mx-auto max-w-3xl overflow-hidden", className)}>
      <div className="mb-6 space-y-4">
        <ProgressBar step={Math.min(step, 7)} />
        <StepIndicator step={Math.min(step, 7)} onJump={onJump} />
        {meta && step < 8 && (
          <div>
            <h2 className="font-heading text-xl font-extrabold text-brand-primary dark:text-white sm:text-2xl">
              {meta.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{meta.hindi}</p>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {footer}
    </Card>
  );
}
