"use client";

import {
  ELIGIBILITY_CLASSES,
  EXAM_INSTRUCTIONS_SHORT,
  EXAM_SLOTS,
  IMPORTANT_DATES,
  SITE,
  SUBJECTS,
} from "@/constants/site";
import { REG_STEPS, FORM_STEP_COUNT } from "@/types/registration";

export function RegistrationHelpCard() {
  return (
    <aside className="mx-auto mt-8 max-w-3xl space-y-4">
      <div className="rounded-ui-lg border border-slate-200 bg-white/80 p-5 text-sm dark:border-slate-700 dark:bg-slate-900/60">
        <h3 className="font-heading font-bold text-brand-primary dark:text-white">
          Important Dates
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-400 dark:border-slate-700">
                <th className="py-2 pr-3">विवरण</th>
                <th className="py-2">तिथि</th>
              </tr>
            </thead>
            <tbody>
              {IMPORTANT_DATES.map((d) => (
                <tr
                  key={d.label}
                  className="border-b border-slate-100 dark:border-slate-800"
                >
                  <td className="py-2 pr-3 font-medium">
                    {d.labelHi}
                  </td>
                  <td className="py-2">
                    {d.date} {d.year}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          अंतिम तिथि · <strong>{SITE.lastDateLabelHindi}</strong> · परीक्षा ·{" "}
          <strong>{SITE.examDateLabelHindi}</strong>
        </p>
      </div>

      <div className="rounded-ui-lg border border-slate-200 bg-white/80 p-5 text-sm dark:border-slate-700 dark:bg-slate-900/60">
        <h3 className="font-heading font-bold text-brand-primary dark:text-white">
          परीक्षा समय
        </h3>
          <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-300">
          <li>
            <strong>
              {EXAM_SLOTS.junior.classesLabelEn} / {EXAM_SLOTS.junior.classesLabel}
            </strong>
            <br />
            Reporting {EXAM_SLOTS.junior.reportingTime} · Exam{" "}
            {EXAM_SLOTS.junior.examTime}
          </li>
          <li>
            <strong>
              {EXAM_SLOTS.senior.classesLabelEn} / {EXAM_SLOTS.senior.classesLabel}
            </strong>
            <br />
            Reporting {EXAM_SLOTS.senior.reportingTime} · Exam{" "}
            {EXAM_SLOTS.senior.examTime}
          </li>
        </ul>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-ui-lg border border-slate-200 bg-white/80 p-5 text-sm dark:border-slate-700 dark:bg-slate-900/60">
          <h3 className="font-heading font-bold text-brand-primary dark:text-white">
            Eligible Classes
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {ELIGIBILITY_CLASSES.map((c) => (
              <li
                key={c}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
              >
                Class {c}
              </li>
            ))}
          </ul>
          <h3 className="mt-4 font-heading font-bold text-brand-primary dark:text-white">
            Subjects
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            4 subjects · 25 each · Total 100 · Pass 33%
          </p>
          <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-300">
            {SUBJECTS.map((s) => (
              <li key={s.en}>
                {s.icon} {s.title}{" "}
                <span className="text-xs text-slate-400">(25)</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-ui-lg border border-slate-200 bg-white/80 p-5 text-sm dark:border-slate-700 dark:bg-slate-900/60">
          <h3 className="font-heading font-bold text-brand-primary dark:text-white">
            How registration works
          </h3>
          <ol className="mt-3 space-y-2 text-slate-600 dark:text-slate-300">
            {REG_STEPS.slice(0, FORM_STEP_COUNT).map((s) => (
              <li key={s.id} className="flex gap-2">
                <span className="font-mono text-xs font-bold text-brand-secondary">
                  {s.id}.
                </span>
                <span>
                  <strong className="text-brand-primary dark:text-white">
                    {s.title}
                  </strong>{" "}
                  <span className="text-slate-400">({s.hindi})</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="rounded-ui-lg border border-amber-200 bg-amber-50 p-5 text-sm dark:border-amber-900/40 dark:bg-amber-950/30">
        <h3 className="font-heading font-bold text-brand-primary dark:text-white">
          महत्वपूर्ण निर्देश
        </h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700 dark:text-slate-300">
          {EXAM_INSTRUCTIONS_SHORT.map((line) => (
            <li key={line.slice(0, 20)}>{line}</li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
