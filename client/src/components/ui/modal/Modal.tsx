"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button/Button";
import { zoomVariants } from "@/components/ui/motion";

export type ModalVariant =
  | "default"
  | "confirm"
  | "delete"
  | "preview"
  | "result"
  | "approval";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  variant?: ModalVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  loading?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showClose?: boolean;
};

const sizeMap = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const variantMeta: Record<
  ModalVariant,
  { confirmVariant: "primary" | "danger" | "success" | "secondary"; icon?: string }
> = {
  default: { confirmVariant: "primary" },
  confirm: { confirmVariant: "secondary" },
  delete: { confirmVariant: "danger" },
  preview: { confirmVariant: "primary" },
  result: { confirmVariant: "success" },
  approval: { confirmVariant: "success" },
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  variant = "default",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  loading,
  size = "md",
  showClose = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  const meta = variantMeta[variant];

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close overlay"
            className="absolute inset-0 bg-brand-primary/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "ui-modal-title" : undefined}
            variants={zoomVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
            className={cn(
              "relative z-10 w-full rounded-ui-lg border border-brand-border bg-white p-6 shadow-modal dark:border-slate-700 dark:bg-slate-900",
              sizeMap[size]
            )}
          >
            {(title || showClose) && (
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  {title && (
                    <h2
                      id="ui-modal-title"
                      className="font-heading text-xl font-bold text-brand-primary dark:text-white"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {description}
                    </p>
                  )}
                </div>
                {showClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-ui-sm p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-primary dark:hover:bg-slate-800"
                    aria-label="Close"
                  >
                    <HiX size={20} />
                  </button>
                )}
              </div>
            )}

            {children && <div className="text-sm text-slate-700 dark:text-slate-200">{children}</div>}

            {(onConfirm || variant === "delete" || variant === "confirm" || variant === "approval" || variant === "result") && (
              <div className="mt-6 flex flex-wrap justify-end gap-2">
                <Button variant="ghost" onClick={onClose} disabled={loading}>
                  {cancelLabel}
                </Button>
                {onConfirm && (
                  <Button
                    variant={meta.confirmVariant}
                    onClick={onConfirm}
                    loading={loading}
                  >
                    {confirmLabel}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
