"use client";

import { useCallback, useRef, useState } from "react";
import { HiCloudUpload, HiX } from "react-icons/hi";
import { useObjectUrl } from "@/hooks/registration/useObjectUrl";
import { cn } from "@/utils/cn";

type Props = {
  label: string;
  required?: boolean;
  accept: string;
  hint: string;
  file: File | null;
  error?: string;
  onSelect: (file: File | null) => void;
  previewShape?: "square" | "wide";
};

export function FileDropzone({
  label,
  required,
  accept,
  hint,
  file,
  error,
  onSelect,
  previewShape = "square",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const preview = useObjectUrl(file);

  const pick = useCallback(
    (list: FileList | null) => {
      const next = list?.[0] || null;
      onSelect(next);
    },
    [onSelect]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    pick(e.dataTransfer.files);
  };

  return (
    <div
      className={cn(
        "relative rounded-ui-lg border-2 border-dashed p-4 transition",
        error
          ? "border-brand-danger bg-red-50/80 dark:bg-red-950/20"
          : dragging
            ? "border-brand-secondary bg-sky-50 dark:bg-sky-950/30"
            : "border-slate-300 bg-slate-50/80 dark:border-slate-600 dark:bg-slate-900/40"
      )}
      onDragEnter={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
      onDrop={onDrop}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-brand-primary dark:text-white">
            {label}
            {required && <span className="text-brand-danger"> *</span>}
          </p>
          <p className="mt-1 text-xs text-slate-500">{hint}</p>
        </div>
        {file && (
          <button
            type="button"
            aria-label="Remove file"
            onClick={() => {
              onSelect(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="rounded-full p-1 text-brand-danger hover:bg-red-100"
          >
            <HiX className="h-4 w-4" />
          </button>
        )}
      </div>

      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt={`${label} preview`}
          className={cn(
            "mt-3 rounded-ui border border-slate-200 object-cover dark:border-slate-700",
            previewShape === "wide" ? "h-20 w-40" : "h-28 w-28"
          )}
        />
      ) : file?.type === "application/pdf" ? (
        <div className="mt-3 rounded-ui bg-white px-3 py-2 text-xs font-semibold text-slate-600 dark:bg-slate-800">
          PDF · {file.name}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-ui border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-brand-secondary transition hover:border-brand-secondary hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800"
      >
        <HiCloudUpload className="h-5 w-5" />
        {file ? "Replace file" : "Drag & drop or click to browse"}
      </button>

      {file && (
        <p className="mt-2 truncate text-xs text-slate-500">
          {file.name} · {(file.size / 1024).toFixed(0)} KB
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => pick(e.target.files)}
      />

      {error && (
        <p className="mt-2 text-xs font-medium text-brand-danger">{error}</p>
      )}
    </div>
  );
}
