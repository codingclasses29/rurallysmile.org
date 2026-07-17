"use client";

import { useObjectUrl } from "@/hooks/registration/useObjectUrl";
import type { RegistrationFiles } from "@/types/registration";
import { ReviewField } from "./ReviewField";

type Props = {
  files: RegistrationFiles;
};

function Thumb({ file, label }: { file: File | null; label: string }) {
  const url = useObjectUrl(file);
  if (!file) {
    return <ReviewField label={label} value="Not uploaded" />;
  }
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2.5 last:border-0 dark:border-slate-700">
      <span className="text-sm text-slate-500">{label}</span>
      <div className="flex items-center gap-2">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={label}
            className="h-12 w-12 rounded-ui object-cover ring-1 ring-slate-200"
          />
        ) : (
          <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-600">
            PDF
          </span>
        )}
        <span className="max-w-[140px] truncate text-xs font-semibold">
          {file.name}
        </span>
      </div>
    </div>
  );
}

export function ReviewUploads({ files }: Props) {
  return (
    <div>
      <Thumb file={files.photo} label="Photo" />
      <Thumb file={files.signature} label="Signature" />
      <Thumb file={files.schoolIdDoc} label="School ID" />
      <Thumb file={files.aadhaarDoc} label="Aadhaar" />
    </div>
  );
}
