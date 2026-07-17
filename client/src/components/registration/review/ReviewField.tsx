"use client";

type Props = {
  label: string;
  value?: string | number | null;
};

export function ReviewField({ label, value }: Props) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-2.5 text-sm last:border-0 dark:border-slate-700">
      <span className="shrink-0 text-slate-500">{label}</span>
      <span className="text-right font-semibold text-brand-primary dark:text-white">
        {value !== undefined && value !== null && String(value).length
          ? String(value)
          : "—"}
      </span>
    </div>
  );
}
