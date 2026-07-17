"use client";

import { useCallback, useEffect, useState } from "react";
import { adminService, type ResultRow } from "@/services/admin.service";
import { notify } from "@/components/ui/toast/Toast";

export default function AdminResultsPage() {
  const [items, setItems] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [published, setPublished] = useState("");
  const [cls, setCls] = useState("");
  const [bulkBusy, setBulkBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.results({
        limit: 100,
        ...(published ? { published } : {}),
        ...(cls ? { class: cls } : {}),
      });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err: unknown) {
      notify.error(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to load results"
      );
    } finally {
      setLoading(false);
    }
  }, [published, cls]);

  useEffect(() => {
    void load();
  }, [load]);

  const togglePublish = async (row: ResultRow) => {
    setBusyId(row._id);
    try {
      await adminService.publishResult(row._id, !row.published);
      notify.success(row.published ? "Unpublished" : "Published");
      await load();
    } catch (err: unknown) {
      notify.error(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Update failed"
      );
    } finally {
      setBusyId(null);
    }
  };

  const publishScope = async (nextPublished: boolean) => {
    const scope = cls ? `Class ${cls}` : "all classes";
    if (
      !window.confirm(
        `${nextPublished ? "Publish" : "Unpublish"} every result in ${scope}? This immediately changes public visibility.`
      )
    )
      return;
    setBulkBusy(true);
    try {
      const response = await adminService.publishResults(
        cls
          ? { published: nextPublished, class: cls }
          : { published: nextPublished, all: true }
      );
      notify.success(
        `${response.data?.modifiedCount || 0} results ${nextPublished ? "published" : "unpublished"}`
      );
      await load();
    } catch (err: unknown) {
      notify.error(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Bulk update failed"
      );
    } finally {
      setBulkBusy(false);
    }
  };

  const studentName = (row: ResultRow) => {
    if (row.student && typeof row.student === "object") {
      return row.student.name || row.student.registrationNumber || "—";
    }
    return "—";
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Results</h1>
          <p className="text-muted mb-0">
            Total marks 100 · Pass 33% · Publish / unpublish results
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-success"
            disabled={bulkBusy}
            onClick={() => void publishScope(true)}
          >
            Publish {cls ? `Class ${cls}` : "all"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={bulkBusy}
            onClick={() => void load()}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-sm-4 col-lg-3">
              <label htmlFor="resultPublishState" className="form-label small fw-semibold">
                Publish state
              </label>
              <select
                id="resultPublishState"
                className="form-select"
                value={published}
                onChange={(event) => setPublished(event.target.value)}
              >
                <option value="">All results</option>
                <option value="true">Published</option>
                <option value="false">Unpublished</option>
              </select>
            </div>
            <div className="col-sm-4 col-lg-3">
              <label htmlFor="resultClass" className="form-label small fw-semibold">
                Class
              </label>
              <select
                id="resultClass"
                className="form-select"
                value={cls}
                onChange={(event) => setCls(event.target.value)}
              >
                <option value="">All classes</option>
                {["7", "8", "9", "10"].map((value) => (
                  <option key={value} value={value}>Class {value}</option>
                ))}
              </select>
            </div>
            <div className="col-sm-4 col-lg-3">
              <button
                type="button"
                className="btn btn-outline-danger w-100"
                disabled={bulkBusy}
                onClick={() => void publishScope(false)}
              >
                Unpublish {cls ? `Class ${cls}` : "all"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Marks / 100</th>
                <th>%</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Published</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="text-center py-5">
                    <div className="spinner-border text-primary" />
                  </td>
                </tr>
              )}
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">
                    No results yet. Add via API / seed later.
                  </td>
                </tr>
              )}
              {items.map((row) => (
                <tr key={row._id}>
                  <td>{studentName(row)}</td>
                  <td>
                    {row.student && typeof row.student === "object"
                      ? row.student.class || "—"
                      : "—"}
                  </td>
                  <td>
                    {row.marks ?? row.total ?? "—"}
                    <span className="text-muted small"> / 100</span>
                  </td>
                  <td>{row.percentage ?? "—"}</td>
                  <td>{row.grade ?? "—"}</td>
                  <td>{row.status ?? "—"}</td>
                  <td>
                    <span
                      className={`badge text-bg-${row.published ? "success" : "secondary"}`}
                    >
                      {row.published ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      type="button"
                      className={`btn btn-sm btn-${row.published ? "outline-secondary" : "success"}`}
                      disabled={busyId === row._id}
                      onClick={() => void togglePublish(row)}
                    >
                      {row.published ? "Unpublish" : "Publish"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
