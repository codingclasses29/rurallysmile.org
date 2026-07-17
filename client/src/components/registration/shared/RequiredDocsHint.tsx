"use client";

import { HiDocumentText } from "react-icons/hi";

export function RequiredDocsHint() {
  return (
    <div className="rounded-ui-lg border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
      <div className="flex items-start gap-3">
        <HiDocumentText className="mt-0.5 h-5 w-5 shrink-0 text-brand-accent" />
        <div>
          <p className="font-bold">Upload tips</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs sm:text-sm">
            <li>Photo: recent passport-size, clear face, JPG/PNG, max 2 MB</li>
            <li>Signature: black/blue ink on white, JPG/PNG, max 1 MB</li>
            <li>School ID / Aadhaar: optional, JPG/PNG/PDF, max 2 MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
