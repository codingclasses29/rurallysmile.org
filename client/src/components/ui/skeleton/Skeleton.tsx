import { cn } from "@/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-ui bg-slate-200 dark:bg-slate-700",
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-ui-lg border border-brand-border bg-white p-6 shadow-card dark:bg-slate-900">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
      <Skeleton className="mt-6 h-10 w-28" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-ui-lg border border-brand-border">
      <Skeleton className="h-12 w-full rounded-none" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="mt-px h-11 w-full rounded-none" />
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-ui-lg border border-brand-border bg-white p-6 dark:bg-slate-900">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}
