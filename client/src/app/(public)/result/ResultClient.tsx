"use client";

import { FormEvent, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { resultService } from "@/services/result.service";
import { notify } from "@/components/ui/toast/Toast";
import Link from "next/link";

function errMsg(e: unknown, fb: string) {
  if (typeof e === "object" && e && "message" in e)
    return String((e as { message: string }).message);
  return fb;
}

type ResultData = {
  _id: string;
  hindi?: number;
  math?: number;
  gk?: number;
  gs?: number;
  marks?: number;
  total?: number;
  maxMarks?: number;
  percentage?: number;
  grade?: string;
  status?: string;
  student?: {
    name?: string;
    fatherName?: string;
    class?: string;
    rollNumber?: string;
    schoolName?: string;
  };
};

export default function ResultClient() {
  const [rollNumber, setRollNumber] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await resultService.getByRoll(
        rollNumber.trim().toUpperCase(),
        dob || undefined
      );
      setResult(res.data?.result || null);
      notify.success(res.message || "Result found");
    } catch (err) {
      const m = errMsg(err, "Result not found or not published");
      setError(m);
      notify.error(m);
    } finally {
      setLoading(false);
    }
  };

  const marks = result?.total ?? result?.marks ?? 0;
  const max = result?.maxMarks || 100;

  return (
    <>
      <PageHeader
        title="Check Result"
        description="Roll Number से परीक्षा परिणाम देखें (Published results)"
      />
      <section className="container-page section-pad pt-8" aria-label="Result lookup">
        <div className="mx-auto max-w-xl">
          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-teal-100 bg-white/95 p-5 shadow-soft dark:bg-slate-900 sm:p-7"
          >
            <label htmlFor="result-roll" className="mb-1 block text-sm font-semibold">Roll Number *</label>
            <input
              id="result-roll"
              className="foundation-form-control mb-3 font-mono"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
              required
            />
            <label htmlFor="result-dob" className="mb-1 block text-sm font-semibold">
              DOB (optional verify)
            </label>
            <input
              type="date"
              id="result-dob"
              className="foundation-form-control mb-4"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-teal-700 to-teal-500 px-4 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
            >
              {loading ? "Checking…" : "Check Result"}
            </button>
            {error && (
              <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-brand-danger">{error}</p>
            )}
          </form>

          {result && (
            <article className="mt-6 rounded-3xl border border-teal-100 bg-gradient-to-br from-white to-teal-50 p-5 shadow-soft dark:bg-slate-900">
              <h2 className="font-heading text-lg font-bold">
                {result.student?.name || "Student"}
              </h2>
              <p className="text-sm text-slate-500">
                Class {result.student?.class} · Roll {result.student?.rollNumber}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2 rounded-ui bg-white p-4 text-center dark:bg-slate-800">
                  <p className="text-xs text-slate-500">Total Marks / कुल अंक</p>
                  <p className="text-3xl font-extrabold text-brand-secondary">
                    {marks}/{max}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Percentage</p>
                  <p className="text-2xl font-bold">
                    {(result.percentage ?? 0).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Grade</p>
                  <p className="font-bold">{result.grade}</p>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <p
                    className={`font-bold ${
                      result.status === "Pass"
                        ? "text-brand-success"
                        : "text-brand-danger"
                    }`}
                  >
                    {result.status}
                  </p>
                </div>
              </div>
              <Link
                href="/marksheet"
                className="mt-4 inline-block text-sm font-semibold text-brand-secondary hover:underline"
              >
                Download Marksheet →
              </Link>
            </article>
          )}
        </div>
      </section>
    </>
  );
}
