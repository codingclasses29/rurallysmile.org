"use client";

import Link from "next/link";
import { useState } from "react";
import { registrationService } from "@/services/registration.service";
import { notify } from "@/components/ui/toast/Toast";

type StatusData = {
  status?: string;
  approved?: boolean;
  student?: {
    name?: string;
    registrationNumber?: string;
    rollNumber?: string;
    status?: string;
    class?: string;
    schoolName?: string;
    mobile?: string;
  };
};

export default function StudentDashboardPage() {
  const [regNo, setRegNo] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<StatusData | null>(null);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setData(null);
    try {
      const res = await registrationService.status({
        registrationNumber: regNo.trim(),
        mobile: mobile.trim(),
      });
      setData((res.data as StatusData) || null);
      notify.success(res.message || "Status loaded");
    } catch (err: unknown) {
      notify.error(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Lookup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const s = data?.student;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-heading text-2xl font-bold text-brand-primary">
        Student Portal
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Registration number और mobile से अपनी स्थिति देखें।
      </p>

      <form
        onSubmit={lookup}
        className="mt-6 space-y-3 rounded-ui-lg border border-brand-border bg-white p-5 dark:bg-slate-900"
      >
        <input
          className="w-full rounded-ui border border-slate-300 px-3 py-2 text-sm"
          placeholder="Registration No (e.g. RSF26-060001)"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value.toUpperCase())}
          required
        />
        <input
          className="w-full rounded-ui border border-slate-300 px-3 py-2 text-sm"
          placeholder="10-digit mobile"
          value={mobile}
          onChange={(e) =>
            setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-ui bg-brand-secondary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Checking…" : "Check Status"}
        </button>
      </form>

      {data ? (
        <div className="mt-6 rounded-ui-lg border border-brand-border bg-slate-50 p-5 dark:bg-slate-900">
          <p className="font-heading text-lg font-bold">{s?.name || "—"}</p>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-400">Registration</dt>
              <dd className="font-mono font-semibold">
                {s?.registrationNumber || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Status</dt>
              <dd className="font-semibold">
                {data.status || s?.status || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Roll</dt>
              <dd className="font-mono">{s?.rollNumber || "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Class</dt>
              <dd>{s?.class || "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-400">School</dt>
              <dd>{s?.schoolName || "—"}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/admit-card"
              className="rounded-ui border border-slate-300 px-3 py-1.5 text-sm font-semibold"
            >
              Admit Card
            </Link>
            <Link
              href="/result"
              className="rounded-ui border border-slate-300 px-3 py-1.5 text-sm font-semibold"
            >
              Result
            </Link>
            <Link
              href="/marksheet"
              className="rounded-ui border border-slate-300 px-3 py-1.5 text-sm font-semibold"
            >
              Marksheet
            </Link>
            <Link
              href="/registration/status"
              className="rounded-ui border border-slate-300 px-3 py-1.5 text-sm font-semibold"
            >
              Full Status
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
