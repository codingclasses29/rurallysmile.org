"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { SITE } from "@/constants/site";
import { settingsService } from "@/services/settings.service";
import { RegistrationWizard } from "@/components/registration";

export function RegistrationShell({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await settingsService.get();
        const flag = res.data?.setting?.registrationOpen;
        if (!cancelled) setOpen(flag !== false);
      } catch {
        // Fail open so temporary API issues don't block students on start day.
        if (!cancelled) setOpen(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showForm = open === true;
  const showClosed = open === false;

  return (
    <>
      <PageHeader
        title="Student Registration"
        description={`${SITE.titleHindi} · केवल कक्षा 7–10 · हिन्दी माध्यम`}
      />
      <section
        className="container-page section-pad pt-8"
        aria-label="Registration form"
      >
        <aside className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal-100 bg-white/90 p-4 shadow-soft">
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/registration/guide" className="foundation-link">
              User Guide
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/registration/documents" className="foundation-link">
              Required Documents
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/registration/status" className="foundation-link">
              Check Status
            </Link>
          </div>
          <p className="text-xs text-slate-400">
            Start · {SITE.registrationStartLabelHindi} · Last date ·{" "}
            {SITE.lastDateLabelHindi} · Exam · {SITE.examDateLabelHindi}
          </p>
        </aside>

        {open === null && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Loading registration status…
          </div>
        )}

        {showClosed && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Official Notice
            </p>
            <h2 className="mt-2 font-heading text-2xl font-extrabold text-slate-900">
              छात्र पंजीकरण 05 अगस्त 2026 से प्रारंभ होगा
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-700">
              Pratibha Khoj Competition 2026 के लिए ऑनलाइन Student Registration{" "}
              <strong>{SITE.registrationStartLabel}</strong> से शुरू होगा। अंतिम
              तिथि <strong>{SITE.lastDateLabel}</strong> है। अभी User Guide और
              Required Documents देखकर तैयार रहें।
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/registration/guide"
                className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white"
              >
                Read User Guide
              </Link>
              <Link
                href="/registration/documents"
                className="rounded-full border-2 border-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-primary"
              >
                Required Documents
              </Link>
              <Link
                href="/notice"
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700"
              >
                All Notices
              </Link>
            </div>
          </div>
        )}

        {showForm && (children ?? <RegistrationWizard />)}
      </section>
    </>
  );
}
