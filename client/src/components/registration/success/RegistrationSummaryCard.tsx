"use client";

import type { RegistrationSuccess } from "@/types/registration";

export function RegistrationSummaryCard({
  result,
}: {
  result: RegistrationSuccess;
}) {
  return (
    <div className="rounded-ui-lg border border-brand-border bg-slate-50 p-5 text-left dark:bg-slate-900">
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Registration No</dt>
          <dd className="font-mono text-lg font-bold text-brand-secondary">
            {result.registrationNumber}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Student Name</dt>
          <dd className="font-semibold text-brand-primary dark:text-white">
            {result.studentName}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Class</dt>
          <dd className="font-semibold">{result.studentClass}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Exam Centre</dt>
          <dd className="max-w-[60%] text-right font-semibold">
            {result.examCentre}
          </dd>
        </div>
        {result.mobile && (
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Mobile</dt>
            <dd className="font-mono font-semibold">{result.mobile}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
