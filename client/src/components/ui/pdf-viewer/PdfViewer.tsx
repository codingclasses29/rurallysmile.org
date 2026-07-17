"use client";

import { useState } from "react";
import { HiDownload, HiExternalLink, HiX } from "react-icons/hi";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal/Modal";

export type PdfViewerProps = {
  src: string;
  title?: string;
  className?: string;
  height?: number | string;
  downloadName?: string;
  /** compact toolbar + iframe */
  variant?: "admit" | "marksheet" | "default";
};

export function PdfViewer({
  src,
  title = "PDF Preview",
  className,
  height = 560,
  downloadName = "document.pdf",
  variant = "default",
}: PdfViewerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-ui-lg border border-brand-border bg-white shadow-card dark:bg-slate-900",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-border bg-slate-50 px-4 py-3 dark:bg-slate-800">
        <div>
          <p className="font-heading text-sm font-bold text-brand-primary dark:text-white">
            {title}
          </p>
          <p className="text-xs capitalize text-slate-500">
            {variant === "admit"
              ? "Admit Card Preview"
              : variant === "marksheet"
                ? "Marksheet Preview"
                : "Document Preview"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="ghost" onClick={() => setOpen(true)} leftIcon={<HiExternalLink />}>
            Expand
          </Button>
          <a href={src} download={downloadName} target="_blank" rel="noreferrer">
            <Button size="sm" variant="secondary" leftIcon={<HiDownload />}>
              Download
            </Button>
          </a>
        </div>
      </div>

      <iframe
        title={title}
        src={src}
        className="w-full bg-slate-100"
        style={{ height }}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        size="xl"
        variant="preview"
      >
        <div className="relative">
          <button
            type="button"
            className="absolute right-0 top-0 z-10 rounded-ui-sm bg-white/90 p-1 shadow sm:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <HiX />
          </button>
          <iframe title={`${title}-full`} src={src} className="h-[70vh] w-full rounded-ui" />
        </div>
      </Modal>
    </div>
  );
}
