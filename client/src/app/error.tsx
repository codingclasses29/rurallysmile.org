"use client";

import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-heading text-3xl font-bold text-brand-danger">
        Something went wrong
      </h1>
      <p className="max-w-md text-slate-600">{error.message || "Unexpected error"}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
