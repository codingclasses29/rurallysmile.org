"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { resultService } from "@/services/result.service";
import { notify } from "@/components/ui/toast/Toast";

type MeritRow = {
  _id: string;
  marks?: number;
  total?: number;
  percentage?: number;
  grade?: string;
  status?: string;
  student?: {
    name?: string;
    class?: string;
    rollNumber?: string;
    schoolName?: string;
    district?: string;
  };
};

export default function MeritListClient() {
  const [cls, setCls] = useState("");
  const [rows, setRows] = useState<MeritRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (c?: string) => {
    setLoading(true);
    try {
      const res = await resultService.merit(c || undefined);
      setRows(res.data?.results || []);
    } catch (err: unknown) {
      notify.error(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to load merit list"
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <>
      <PageHeader
        title="Merit List"
        description="Published results · Top performers (API live)"
      />
      <div className="container-page section-pad pt-0">
        <div className="mb-4 flex flex-wrap gap-2">
          <select
            className="rounded-ui border border-slate-300 px-3 py-2 text-sm"
            value={cls}
            onChange={(e) => {
              setCls(e.target.value);
              void load(e.target.value);
            }}
          >
            <option value="">All Classes</option>
            {["8", "9", "10"].map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded-ui border border-slate-300 px-3 py-2 text-sm font-semibold"
            onClick={() => void load(cls)}
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto rounded-ui-lg border border-brand-border bg-white dark:bg-slate-900">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Roll</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Marks</th>
                <th className="px-4 py-3">%</th>
                <th className="px-4 py-3">Grade</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No published results yet
                  </td>
                </tr>
              )}
              {rows.map((r, i) => (
                <tr key={r._id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-mono text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold">{r.student?.name}</td>
                  <td className="px-4 py-3 font-mono">{r.student?.rollNumber}</td>
                  <td className="px-4 py-3">{r.student?.class}</td>
                  <td className="px-4 py-3">
                    {r.marks ?? r.total ?? "—"}/100
                  </td>
                  <td className="px-4 py-3">{r.percentage}%</td>
                  <td className="px-4 py-3">{r.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
