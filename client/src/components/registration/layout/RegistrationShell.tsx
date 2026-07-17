"use client";

import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { SITE } from "@/constants/site";

type Props = {
  children: React.ReactNode;
};

export function RegistrationShell({ children }: Props) {
  return (
    <>
      <PageHeader
        title="Student Registration"
        description={`${SITE.titleHindi} · केवल कक्षा 8–10 · हिन्दी माध्यम`}
      />
      <section className="container-page section-pad pt-8" aria-label="Registration form">
        <aside className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-100 bg-white/90 p-4 shadow-soft">
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/registration/documents"
              className="foundation-link"
            >
              Required Documents
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="/registration/status"
              className="foundation-link"
            >
              Check Status
            </Link>
          </div>
          <p className="text-xs text-slate-400">
            Last date · {SITE.lastDateLabelHindi} · Exam · {SITE.examDateLabelHindi}
          </p>
        </aside>
        {children}
      </section>
    </>
  );
}
