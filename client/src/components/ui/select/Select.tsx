"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { HiChevronDown, HiSearch, HiX } from "react-icons/hi";
import { cn } from "@/utils/cn";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type SelectProps = {
  label?: string;
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
  name?: string;
};

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  error,
  required,
  disabled,
  multiple = false,
  searchable = false,
  clearable = false,
  className,
  name,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedValues = useMemo(() => {
    if (multiple) return Array.isArray(value) ? value : value ? [value] : [];
    return value ? [String(value)] : [];
  }, [value, multiple]);

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  const display = useMemo(() => {
    if (!selectedValues.length) return placeholder;
    const labels = options
      .filter((o) => selectedValues.includes(o.value))
      .map((o) => o.label);
    return labels.join(", ");
  }, [selectedValues, options, placeholder]);

  const toggle = (optValue: string) => {
    if (multiple) {
      const next = selectedValues.includes(optValue)
        ? selectedValues.filter((v) => v !== optValue)
        : [...selectedValues, optValue];
      onChange?.(next);
    } else {
      onChange?.(optValue);
      setOpen(false);
      setQuery("");
    }
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : "");
  };

  return (
    <div className={cn("relative w-full space-y-1.5", className)} ref={rootRef}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
          {required && <span className="ml-0.5 text-brand-danger">*</span>}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        name={name}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-ui border border-brand-border bg-white px-4 py-2.5 text-left text-sm outline-none transition",
          "focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20",
          "disabled:cursor-not-allowed disabled:bg-slate-50",
          "dark:border-slate-600 dark:bg-slate-900 dark:text-white",
          error && "border-brand-danger",
          !selectedValues.length && "text-slate-400"
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="truncate">{display}</span>
        <span className="flex shrink-0 items-center gap-1 text-slate-400">
          {clearable && selectedValues.length > 0 && (
            <span
              role="button"
              tabIndex={0}
              onClick={clear}
              onKeyDown={(e) => e.key === "Enter" && clear(e as unknown as React.MouseEvent)}
              className="rounded p-0.5 hover:bg-slate-100 hover:text-brand-danger"
              aria-label="Clear"
            >
              <HiX size={16} />
            </span>
          )}
          <HiChevronDown
            size={18}
            className={cn("transition", open && "rotate-180")}
          />
        </span>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 max-h-60 w-full overflow-hidden rounded-ui border border-brand-border bg-white shadow-hover dark:border-slate-600 dark:bg-slate-900">
          {searchable && (
            <div className="flex items-center gap-2 border-b border-brand-border px-3 py-2">
              <HiSearch className="text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-sm outline-none dark:text-white"
              />
            </div>
          )}
          <ul className="max-h-48 overflow-y-auto py-1" role="listbox">
            {filtered.length === 0 && (
              <li className="px-4 py-2 text-sm text-slate-500">No options</li>
            )}
            {filtered.map((opt) => {
              const active = selectedValues.includes(opt.value);
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => toggle(opt.value)}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800",
                      active && "bg-blue-50 font-semibold text-brand-secondary dark:bg-slate-800",
                      opt.disabled && "cursor-not-allowed opacity-50"
                    )}
                    role="option"
                    aria-selected={active}
                  >
                    {opt.label}
                    {active && <span className="text-brand-secondary">✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error && <p className="text-xs text-brand-danger">{error}</p>}

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-20 cursor-default"
          aria-label="Close"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
