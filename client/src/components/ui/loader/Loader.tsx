import { cn } from "@/utils/cn";

export function Loader({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-14 w-14 border-4",
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-spin rounded-full border-slate-200 border-t-brand-secondary",
        sizes[size],
        className
      )}
    />
  );
}

export function ButtonLoader({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className
      )}
      aria-hidden
    />
  );
}

export function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
      <Loader size="lg" />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

export function FullScreenLoader({ label = "Please wait..." }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
      <Loader size="lg" />
      <p className="font-heading text-sm font-semibold text-brand-primary dark:text-white">
        {label}
      </p>
    </div>
  );
}

export function TableLoader({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="space-y-2 rounded-ui-lg border border-brand-border p-4">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((__, c) => (
            <div
              key={c}
              className="h-8 animate-pulse rounded-ui-sm bg-slate-200 dark:bg-slate-700"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
