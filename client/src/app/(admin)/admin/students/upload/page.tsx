"use client";

import Link from "next/link";
import { useState } from "react";
import {
  adminService,
  type StudentImportPreview,
  type StudentImportReport,
} from "@/services/admin.service";
import { notify } from "@/components/ui/toast/Toast";

function errorMessage(error: unknown) {
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: string }).message);
  }
  return "Request failed";
}

async function download(path: string, filename: string) {
  const url = await adminService.fetchPdfBlobUrl(path);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function StudentImportPage() {
  const [excel, setExcel] = useState<File | null>(null);
  const [mediaZip, setMediaZip] = useState<File | null>(null);
  const [preview, setPreview] = useState<StudentImportPreview | null>(null);
  const [report, setReport] = useState<StudentImportReport | null>(null);
  const [busy, setBusy] = useState<"preview" | "import" | "">("");

  const ready = Boolean(excel && mediaZip);

  const runPreview = async () => {
    if (!excel || !mediaZip) return notify.error("Choose both required files");
    setBusy("preview");
    setReport(null);
    try {
      const response = await adminService.previewStudentImport(excel, mediaZip);
      setPreview(response.data);
      notify.success(
        `${response.data?.valid || 0} of ${response.data?.total || 0} rows are ready`
      );
    } catch (error) {
      setPreview(null);
      notify.error(errorMessage(error));
    } finally {
      setBusy("");
    }
  };

  const runImport = async () => {
    if (!excel || !mediaZip || !preview || preview.invalid > 0) return;
    if (
      !window.confirm(
        `Import ${preview.valid} students as Pending registrations? This will upload their media files.`
      )
    )
      return;
    setBusy("import");
    try {
      const response = await adminService.importStudents(excel, mediaZip);
      if (response.data?.report) setReport(response.data.report);
      notify.success(`${response.data?.report?.created || 0} students imported`);
    } catch (error) {
      notify.error(errorMessage(error));
    } finally {
      setBusy("");
    }
  };

  const rows = report?.rows || preview?.rows || [];

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-4">
        <div>
          <p className="text-uppercase text-primary fw-semibold mb-1" style={{ fontSize: 11 }}>
            Student Management
          </p>
          <h1 className="h3 fw-bold mb-1">Student Excel Import</h1>
          <p className="text-muted mb-0">
            Validate an Excel workbook and matching photo/signature ZIP before import.
          </p>
        </div>
        <Link href="/admin/students" className="btn btn-outline-secondary">
          Back to students
        </Link>
      </div>

      <div className="alert alert-info">
        Use the samples without renaming media references. Excel: .xlsx up to 8 MB;
        media ZIP: .zip up to 50 MB; maximum 1,000 rows.
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() =>
            void download("/student/import/sample", "student-import-sample.xlsx").catch(
              (error) => notify.error(errorMessage(error))
            )
          }
        >
          <i className="bi bi-file-earmark-excel me-1" /> Download Excel sample
        </button>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() =>
            void download("/student/import/media-sample", "student-media-sample.zip").catch(
              (error) => notify.error(errorMessage(error))
            )
          }
        >
          <i className="bi bi-file-earmark-zip me-1" /> Download media ZIP sample
        </button>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="studentExcel" className="form-label fw-semibold">
                Student Excel <span className="text-danger">*</span>
              </label>
              <input
                id="studentExcel"
                type="file"
                className="form-control"
                accept=".xlsx"
                onChange={(event) => {
                  setExcel(event.target.files?.[0] || null);
                  setPreview(null);
                  setReport(null);
                }}
              />
              <div className="form-text">{excel?.name || "Select the completed .xlsx template"}</div>
            </div>
            <div className="col-md-6">
              <label htmlFor="studentMedia" className="form-label fw-semibold">
                Photo and signature ZIP <span className="text-danger">*</span>
              </label>
              <input
                id="studentMedia"
                type="file"
                className="form-control"
                accept=".zip,application/zip"
                onChange={(event) => {
                  setMediaZip(event.target.files?.[0] || null);
                  setPreview(null);
                  setReport(null);
                }}
              />
              <div className="form-text">{mediaZip?.name || "Select the matching media .zip"}</div>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2 mt-4">
            <button
              type="button"
              className="btn btn-outline-primary"
              disabled={!ready || Boolean(busy)}
              onClick={() => void runPreview()}
            >
              {busy === "preview" ? "Validating…" : "Validate and preview"}
            </button>
            <button
              type="button"
              className="btn btn-admin-success"
              disabled={
                !preview || preview.invalid > 0 || preview.valid === 0 || Boolean(busy) || Boolean(report)
              }
              onClick={() => void runImport()}
            >
              {busy === "import" ? "Importing…" : "Confirm import"}
            </button>
          </div>
        </div>
      </div>

      {(preview || report) && (
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="card-header bg-white d-flex flex-wrap justify-content-between gap-2">
            <span className="fw-semibold">{report ? "Import report" : "Validation preview"}</span>
            <span className={`badge text-bg-${(report?.failed || preview?.invalid) ? "warning" : "success"}`}>
              {report
                ? `${report.created} created · ${report.failed} failed`
                : `${preview?.valid} ready · ${preview?.invalid} invalid`}
            </span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Row</th>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Errors</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.row}>
                    <td>{row.row}</td>
                    <td>
                      <div className="fw-semibold">{row.name || row.registrationNumber || "—"}</div>
                      <div className="small text-muted">{row.email}</div>
                    </td>
                    <td>{row.class || "—"}</td>
                    <td>{row.mobile || "—"}</td>
                    <td>
                      <span
                        className={`badge text-bg-${
                          row.status === "ready" || row.status === "created"
                            ? "success"
                            : "danger"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="small text-danger">
                      {row.errors?.join("; ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
