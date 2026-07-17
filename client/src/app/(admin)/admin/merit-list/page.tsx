"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { resultService } from "@/services/result.service";
import { adminService } from "@/services/admin.service";
import { notify } from "@/components/ui/toast/Toast";

type Row = {
  _id: string;
  marks?: number;
  total?: number;
  percentage?: number;
  grade?: string;
  student?: {
    name?: string;
    class?: string;
    rollNumber?: string;
    schoolName?: string;
    district?: string;
  };
};

export default function AdminMeritListPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [cls, setCls] = useState("");
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [lastRecalculated, setLastRecalculated] = useState<string | null>(null);

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

  const recalculate = async () => {
    if (
      !window.confirm(
        `Recalculate published merit ranks for ${cls ? `Class ${cls}` : "all classes"}?`
      )
    )
      return;
    setRecalculating(true);
    try {
      await adminService.recalculateMerit(cls || undefined);
      const timestamp = new Date().toISOString();
      setLastRecalculated(timestamp);
      notify.success("Published merit ranks recalculated");
      await load(cls);
    } catch (err: unknown) {
      notify.error(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Merit recalculation failed"
      );
    } finally {
      setRecalculating(false);
    }
  };

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <p className="text-uppercase text-primary fw-semibold mb-1" style={{ fontSize: 11 }}>
            🏆 Merit List
          </p>
          <h1 className="h3 fw-bold mb-0">Toppers &amp; Rank List</h1>
          <p className="text-muted mb-0">Published results · Class filter</p>
        </div>
        <Link href="/merit-list" className="btn btn-outline-primary" target="_blank">
          Public Merit Page
        </Link>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <select
          className="form-select w-auto"
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
        <button type="button" className="btn btn-primary" onClick={() => void load(cls)}>
          Refresh
        </button>
        <button
          type="button"
          className="btn btn-outline-warning"
          disabled={recalculating}
          onClick={() => void recalculate()}
        >
          <i className="bi bi-arrow-repeat me-1" />
          {recalculating ? "Recalculating…" : "Recalculate merit"}
        </button>
        <span className="small text-muted align-self-center" aria-live="polite">
          {lastRecalculated
            ? `Last recalculated ${new Date(lastRecalculated).toLocaleString("en-IN")}`
            : "Not recalculated in this session"}
        </span>
      </div>

      <div className="row g-3 mb-4">
        {rows.slice(0, 3).map((r, i) => (
          <div className="col-md-4" key={r._id}>
            <div className="admin-coming-card p-4 text-center h-100">
              <div className="display-6">{medals[i]}</div>
              <div className="fw-bold fs-5 mt-2">{r.student?.name || "—"}</div>
              <div className="text-muted small">
                Class {r.student?.class} · {r.student?.rollNumber}
              </div>
              <div className="fs-4 fw-bold text-primary mt-2">
                {r.marks ?? r.total ?? 0}/100
              </div>
              <div className="small">{r.percentage}% · Grade {r.grade}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-coming-card overflow-hidden">
        <div className="table-responsive">
          <table className="table mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Roll</th>
                <th>Class</th>
                <th>School</th>
                <th>Marks</th>
                <th>%</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    <div className="spinner-border spinner-border-sm" />
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">
                    No published results
                  </td>
                </tr>
              )}
              {rows.map((r, i) => (
                <tr key={r._id}>
                  <td>{i + 1}</td>
                  <td className="fw-semibold">{r.student?.name}</td>
                  <td>
                    <code>{r.student?.rollNumber}</code>
                  </td>
                  <td>{r.student?.class}</td>
                  <td className="small">{r.student?.schoolName}</td>
                  <td>{r.marks ?? r.total}/100</td>
                  <td>{r.percentage}%</td>
                  <td>{r.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
