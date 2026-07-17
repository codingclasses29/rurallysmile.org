"use client";

import { Button } from "@/components/ui/button/Button";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

type Props = {
  step: number;
  maxStep?: number;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  loading?: boolean;
  showNext?: boolean;
  showBack?: boolean;
  rightSlot?: React.ReactNode;
};

export function StepNavigation({
  step,
  onBack,
  onNext,
  nextLabel = "Next",
  backLabel = "Previous",
  nextDisabled,
  backDisabled,
  loading,
  showNext = true,
  showBack = true,
  rightSlot,
}: Props) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
      <div>
        {showBack && (
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={backDisabled || step <= 1 || loading}
            leftIcon={<HiArrowLeft />}
          >
            {backLabel}
          </Button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {rightSlot}
        {showNext && (
          <Button
            type="button"
            variant="secondary"
            onClick={onNext}
            disabled={nextDisabled || loading}
            loading={loading}
            rightIcon={!loading ? <HiArrowRight /> : undefined}
          >
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
