"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notify } from "@/components/ui/toast/Toast";
import {
  adminService,
  type ImportReport,
} from "@/services/admin.service";

const DEFAULT_SHEET =
  "https://docs.google.com/spreadsheets/d/1vD120fHSi5laXN2Gw8mcEBOmaExbqug7r3B8BPfYAwU/edit?usp=sharing";

type Tab = "excel" | "google";

function errMsg(e: unknown) {
  const ax = e as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return ax?.response?.data?.message || ax?.message || "Request failed";
}

function StatsRow({ report }: { report: ImportReport }) {
  const items = [
    { label: "Total Rows", value: report.total, color: "#2563eb" },
    {
      label: "Success / Valid",
      value: report.success ?? report.valid ?? 0,
      color: "#16a34a",
    },
    { label: "Failed", value: report.failed, color: "#dc2626" },
    { label: "Duplicate", value: report.duplicate, color: "#f59e0b" },
    { label: "Missing Roll", value: report.missing, color: "#7c3aed" },
  ];
  return (
    <div className="row g-3 mb-3">
      {items.map((s) => (
        <div className="col" key={s.label}>
          <div className="admin-coming-card p-3 text-center h-100">
            <div className="small text-muted">{s.label}</div>
            <div className="fs-3 fw-bold" style={{ color: s.color }}>
              {s.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DataImportCenterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [tab, setTab] = useState<Tab>(
    requestedTab === "excel" ? "excel" : "google"
  );
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [sheetUrl, setSheetUrl] = useState(DEFAULT_SHEET);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [authInfo, setAuthInfo] = useState<{
    mode?: string;
    serviceAccount?: boolean;
    serviceAccountEmail?: string | null;
    setupHint?: string;
    free?: boolean;
  } | null>(null);
  const [publishOnImport, setPublishOnImport] = useState(false);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<ImportReport | null>(null);

  const loadConfig = useCallback(async () => {
    try {
      const res = await adminService.getImportConfig();
      const cfg = res?.data as
        | {
            sheetUrl?: string;
            lastSync?: string | null;
            auth?: {
              mode?: string;
              serviceAccount?: boolean;
              serviceAccountEmail?: string | null;
              setupHint?: string;
              free?: boolean;
            };
          }
        | undefined;
      if (cfg?.sheetUrl) setSheetUrl(cfg.sheetUrl);
      if (cfg?.lastSync) setLastSync(cfg.lastSync);
      if (cfg?.auth) setAuthInfo(cfg.auth);
    } catch {
      /* keep defaults */
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    if (requestedTab === "excel" || requestedTab === "google") {
      setTab(requestedTab);
      setReport(null);
    }
  }, [requestedTab]);

  const changeTab = (next: Tab) => {
    setTab(next);
    setReport(null);
    router.replace(`/admin/results/upload?tab=${next}`);
  };

  const unwrap = (res: unknown): ImportReport => {
    const r = res as { data?: ImportReport } & ImportReport;
    return (r?.data as ImportReport) || (r as ImportReport);
  };

  const onPreviewExcel = async () => {
    if (!file) {
      notify.error("Choose an Excel file first");
      return;
    }
    setBusy(true);
    try {
      const res = await adminService.previewExcelImport(file);
      const data = unwrap(res);
      setReport(data);
      notify.success(`Validated ${data.valid ?? 0} of ${data.total} rows`);
    } catch (e) {
      notify.error(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const onImportExcel = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      notify.error("Choose an Excel file first");
      return;
    }
    setBusy(true);
    try {
      const res = await adminService.importExcelResults(file, publishOnImport);
      const data = unwrap(res);
      setReport(data);
      notify.success(
        `Imported ${data.success ?? 0} results${publishOnImport ? " & published" : ""}`
      );
    } catch (e) {
      notify.error(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const onPreviewGoogle = async () => {
    if (!sheetUrl.trim()) {
      notify.error("Paste Google Sheet URL");
      return;
    }
    setBusy(true);
    try {
      const res = await adminService.previewGoogleSheet(sheetUrl.trim());
      const data = unwrap(res);
      setReport(data);
      notify.success(`Preview: ${data.valid ?? 0} valid rows`);
    } catch (e) {
      notify.error(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const onSyncGoogle = async () => {
    if (!sheetUrl.trim()) {
      notify.error("Paste Google Sheet URL");
      return;
    }
    setBusy(true);
    try {
      const res = await adminService.syncGoogleSheet({
        sheetUrl: sheetUrl.trim(),
        publish: publishOnImport,
        saveUrl: true,
      });
      const data = unwrap(res);
      setReport(data);
      if (data.lastSync) setLastSync(data.lastSync);
      notify.success(
        `Synced ${data.success ?? 0} results from Google Sheet`
      );
    } catch (e) {
      notify.error(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const onPublishAll = async () => {
    if (
      !window.confirm(
        "Publish every result across all classes? Students will be able to view them immediately."
      )
    )
      return;
    setBusy(true);
    try {
      const res = await adminService.publishAllResults();
      const n =
        (res as { data?: { modifiedCount?: number } })?.data?.modifiedCount ?? 0;
      notify.success(`Published ${n} results`);
    } catch (e) {
      notify.error(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const downloadSample = async () => {
    try {
      const url = await adminService.fetchPdfBlobUrl(
        "/result/import/sample"
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "sample-result-import.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      notify.error(errMsg(e));
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-4">
        <div>
          <p
            className="text-uppercase text-primary fw-semibold mb-1"
            style={{ fontSize: 11 }}
          >
            Data Import Center
          </p>
          <h1 className="h3 fw-bold mb-1">Excel + Google Sheets</h1>
          <p className="text-muted mb-0">
            Import results (total marks 0–100) · Validate · Sync · Publish
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Link href="/admin/marksheet" className="btn btn-outline-primary btn-sm">
            Single entry
          </Link>
          <Link href="/admin/results" className="btn btn-outline-secondary btn-sm">
            All results
          </Link>
          <button
            type="button"
            className="btn btn-success btn-sm"
            disabled={busy}
            onClick={onPublishAll}
          >
            Publish all
          </button>
        </div>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${tab === "google" ? "active" : ""}`}
            onClick={() => changeTab("google")}
          >
            Google Sheets
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${tab === "excel" ? "active" : ""}`}
            onClick={() => changeTab("excel")}
          >
            Excel Upload
          </button>
        </li>
      </ul>

      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="publishOnImport"
          checked={publishOnImport}
          onChange={(e) => setPublishOnImport(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="publishOnImport">
          Publish results on import (students can see immediately)
        </label>
      </div>

      {tab === "google" && (
        <div className="admin-coming-card p-4 mb-4">
          <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
            <div>
              <h2 className="h5 fw-bold mb-1">Connected Google Sheet</h2>
              <p className="small text-muted mb-0">
                Auth:{" "}
                <span
                  className={`fw-semibold ${
                    authInfo?.serviceAccount ? "text-success" : "text-warning"
                  }`}
                >
                  {authInfo?.serviceAccount
                    ? "Service Account (private · FREE)"
                    : authInfo?.mode === "api_key"
                      ? "API Key (public sheet)"
                      : "Public CSV (share required)"}
                </span>
                {authInfo?.serviceAccountEmail && (
                  <>
                    {" "}
                    · {authInfo.serviceAccountEmail}
                  </>
                )}
                {lastSync && (
                  <>
                    {" "}
                    · Last sync {new Date(lastSync).toLocaleString("en-IN")}
                  </>
                )}
              </p>
            </div>
            <a
              href={sheetUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-primary btn-sm"
            >
              Open sheet
            </a>
          </div>

          <label className="form-label fw-semibold">Sheet URL</label>
          <input
            type="url"
            className="form-control mb-3"
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
          />
          <p className="small text-muted mb-2">
            Columns: <code>rollNumber</code> + <code>marks</code> (0–100), or{" "}
            <code>hindi, math, gk, gs</code> (summed &amp; capped at 100).
          </p>

          <div className="alert alert-info py-2 small mb-3">
            <strong>Google Sheets API FREE hai</strong> — exam portal ke normal
            sync pe charge nahi lagta.
            <div className="mt-2">
              <strong>Private sheet (recommended):</strong>
              <ol className="mb-0 mt-1 ps-3">
                <li>
                  <a
                    href="https://console.cloud.google.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Google Cloud Console
                  </a>{" "}
                  → naya Project
                </li>
                <li>
                  <a
                    href="https://console.cloud.google.com/apis/library/sheets.googleapis.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Google Sheets API Enable
                  </a>{" "}
                  (FREE)
                </li>
                <li>
                  Credentials → Service Account → JSON key download → save as{" "}
                  <code>server/credentials/google-service-account.json</code>
                </li>
                <li>
                  Sheet → Share → service account email (
                  <code>…@….iam.gserviceaccount.com</code>) →{" "}
                  <strong>Viewer</strong>
                </li>
                <li>
                  Server restart → yahan <strong>Sync Now</strong>
                </li>
              </ol>
            </div>
            {!authInfo?.serviceAccount && (
              <div className="mt-2 text-warning-emphasis">
                Abhi Service Account set nahi hai. Quick test ke liye Share →
                Anyone with the link → Viewer, ya Excel Upload use karo.
              </div>
            )}
            {authInfo?.setupHint && (
              <div className="mt-1 text-muted">{authInfo.setupHint}</div>
            )}
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-outline-primary"
              disabled={busy}
              onClick={onPreviewGoogle}
            >
              Preview
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy}
              onClick={onSyncGoogle}
            >
              {busy ? "Working…" : "Sync Now"}
            </button>
          </div>
        </div>
      )}

      {tab === "excel" && (
        <form onSubmit={onImportExcel} className="admin-coming-card p-4 mb-4">
          <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
            <h2 className="h5 fw-bold mb-0">Upload Result Excel</h2>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={downloadSample}
            >
              Download sample
            </button>
          </div>

          <div
            className={`border border-2 border-dashed rounded-4 p-5 text-center ${
              dragging
                ? "border-primary bg-primary bg-opacity-10"
                : "border-secondary-subtle"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) setFile(f);
            }}
          >
            <div className="display-6 mb-2">📂</div>
            <h3 className="h5 fw-bold">Drag Excel here</h3>
            <p className="text-muted">.xlsx · .xls · .csv</p>
            <label className="btn btn-primary">
              Choose file
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="d-none"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            {file && (
              <p className="mt-3 mb-0 small fw-semibold text-success">
                Selected: {file.name}
              </p>
            )}
          </div>

          <div className="d-flex flex-wrap gap-2 mt-3">
            <button
              type="button"
              className="btn btn-outline-primary"
              disabled={busy || !file}
              onClick={onPreviewExcel}
            >
              Validate / Preview
            </button>
            <button
              type="submit"
              className="btn btn-admin-success"
              disabled={busy || !file}
            >
              {busy ? "Importing…" : "Import to MongoDB"}
            </button>
          </div>
        </form>
      )}

      {report && (
        <>
          <StatsRow report={report} />

          {report.preview && report.preview.length > 0 && (
            <div className="admin-coming-card p-3 mb-3">
              <h3 className="h6 fw-bold mb-2">Preview (first rows)</h3>
              <div className="table-responsive">
                <table className="table table-sm table-striped mb-0">
                  <thead>
                    <tr>
                      <th>Roll</th>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Marks</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.preview.map((r) => (
                      <tr key={r.rollNumber}>
                        <td className="fw-semibold">{r.rollNumber}</td>
                        <td>{r.studentName || "—"}</td>
                        <td>{r.studentClass || "—"}</td>
                        <td>{r.marks}/100</td>
                        <td>
                          <span
                            className={`badge ${
                              r.status === "Pass"
                                ? "text-bg-success"
                                : "text-bg-danger"
                            }`}
                          >
                            {r.status || "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {report.meritPreview && report.meritPreview.length > 0 && (
            <div className="admin-coming-card p-3 mb-3">
              <h3 className="h6 fw-bold mb-2">Top 10 (from this file)</h3>
              <ol className="mb-0 small">
                {report.meritPreview.map((r, i) => (
                  <li key={r.rollNumber}>
                    #{i + 1} {r.studentName || r.rollNumber} —{" "}
                    <strong>{r.marks}</strong>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {report.errors && report.errors.length > 0 && (
            <div className="alert alert-warning">
              <div className="fw-semibold mb-1">
                Validation issues ({report.errors.length})
              </div>
              <ul className="small mb-0">
                {report.errors.slice(0, 20).map((e, i) => (
                  <li key={i}>
                    {e.rollNumber || `Row ${e.row}`}: {e.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <div className="alert alert-info mb-0">
        <strong>Columns:</strong> <code>rollNumber, marks</code> (preferred){" "}
        — or <code>rollNumber, hindi, math, gk, gs</code> (sum → total /100).
        DSA: HashMap roll lookup · HashSet duplicates · Merge sort merit.
      </div>
    </div>
  );
}
