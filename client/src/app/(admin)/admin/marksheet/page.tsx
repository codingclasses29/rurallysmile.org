"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCards } from "@/components/admin/AdminStatCards";
import { StudentPreviewCard } from "@/components/admin/StudentPreviewCard";
import { DocumentHistoryTable } from "@/components/admin/DocumentHistoryTable";
import { MarksheetDocument } from "@/components/admin/MarksheetDocument";
import {
  adminService,
  type AdminStudent,
  type DashboardStats,
  type ResultRow,
} from "@/services/admin.service";
import { notify } from "@/components/ui/toast/Toast";
import { SITE } from "@/constants/site";

function errMsg(err: unknown, fallback: string) {
  if (typeof err === "object" && err && "message" in err) {
    return String((err as { message: string }).message);
  }
  return fallback;
}

export default function AdminMarksheetPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [searchBy, setSearchBy] = useState<"rollNumber" | "registrationNumber">(
    "rollNumber"
  );
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState("");
  const [student, setStudent] = useState<
    (AdminStudent & { motherName?: string; dob?: string }) | null
  >(null);
  const [result, setResult] = useState<ResultRow | null>(null);
  const [zoom, setZoom] = useState(1);
  const [totalMarks, setTotalMarks] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const res = await adminService.dashboard();
      setStats(res.data || null);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const onSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      notify.error("Enter roll / registration number");
      return;
    }
    setLoading(true);
    setPdfUrl(null);
    try {
      const res = await adminService.lookupResult({
        [searchBy]: query.trim(),
      });
      const st = res.data?.student || null;
      const rt = res.data?.result || null;
      setStudent(st);
      setResult(rt);
      if (rt) {
        setTotalMarks(rt.total ?? rt.marks ?? 0);
      } else {
        setTotalMarks(0);
      }
      if (!st) notify.error("Student not found");
      else if (!rt) notify.error("Result not entered yet — save marks below");
      else notify.success("Student loaded");
    } catch (err) {
      setStudent(null);
      setResult(null);
      notify.error(errMsg(err, "Search failed"));
    } finally {
      setLoading(false);
    }
  };

  const saveMarks = async () => {
    if (!student?.rollNumber) {
      notify.error("Roll number required");
      return;
    }
    setBusy("save");
    try {
      const res = await adminService.createResult({
        rollNumber: student.rollNumber,
        marks: Number(totalMarks),
        total: Number(totalMarks),
      });
      setResult(res.data?.result || null);
      if (res.data?.result) {
        setTotalMarks(res.data.result.total ?? res.data.result.marks ?? 0);
      }
      notify.success("Marks saved");
      loadStats();
    } catch (err) {
      notify.error(errMsg(err, "Save failed"));
    } finally {
      setBusy("");
    }
  };

  const togglePublish = async (published: boolean) => {
    if (!result?._id) {
      notify.error("Save result first");
      return;
    }
    setBusy("publish");
    try {
      const res = await adminService.publishResult(result._id, published);
      const updated = (res.data as { result?: ResultRow } | null)?.result;
      if (updated) setResult(updated);
      else setResult((r) => (r ? { ...r, published } : r));
      notify.success(published ? "Marksheet published" : "Unpublished");
      loadStats();
    } catch (err) {
      notify.error(errMsg(err, "Publish failed"));
    } finally {
      setBusy("");
    }
  };

  const loadPdf = async () => {
    if (!result?._id) return;
    setBusy("pdf");
    try {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const url = await adminService.fetchPdfBlobUrl(
        `/marksheet/admin/download/${result._id}`
      );
      setPdfUrl(url);
      notify.success("PDF ready");
    } catch (err) {
      notify.error(errMsg(err, "PDF failed — publish first if needed"));
    } finally {
      setBusy("");
    }
  };

  const downloadPdf = () => {
    if (!pdfUrl || !student) {
      loadPdf();
      return;
    }
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `marksheet-${student.rollNumber || "student"}.pdf`;
    a.click();
  };

  const history = useMemo(() => {
    if (!result) return [];
    const rows = [];
    if (result.published) {
      rows.push({
        at: new Date().toLocaleString("en-IN"),
        action: "Published",
        by: "Admin",
      });
    }
    rows.push({
      at: new Date().toLocaleString("en-IN"),
      action: "Result Loaded",
      by: "Admin",
    });
    return rows;
  }, [result]);

  const pending =
    (stats?.totalResults || 0) - (stats?.publishedResults || 0);

  return (
    <div>
      <AdminPageHeader
        title="Digital Marksheet"
        crumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Marksheet" },
          { label: "View Marksheet" },
        ]}
        backHref="/admin/dashboard"
      />

      <AdminStatCards
        stats={[
          {
            label: "Total Marksheets",
            value: stats?.totalResults ?? "—",
            icon: "bi-file-earmark-text",
            tone: "primary",
          },
          {
            label: "Published",
            value: stats?.publishedResults ?? "—",
            icon: "bi-check2-circle",
            tone: "success",
          },
          {
            label: "Pending",
            value: Math.max(0, pending),
            icon: "bi-hourglass-split",
            tone: "warning",
          },
          {
            label: "Students",
            value: stats?.totalStudents ?? "—",
            icon: "bi-people",
            tone: "info",
          },
        ]}
      />

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-white fw-semibold">Search Student</div>
            <div className="card-body">
              <form onSubmit={onSearch} className="row g-2">
                <div className="col-12">
                  <label className="form-label small mb-1">Search By</label>
                  <select
                    className="form-select"
                    value={searchBy}
                    onChange={(e) =>
                      setSearchBy(e.target.value as typeof searchBy)
                    }
                  >
                    <option value="rollNumber">Roll Number</option>
                    <option value="registrationNumber">
                      Registration Number
                    </option>
                  </select>
                </div>
                <div className="col-12">
                  <input
                    className="form-control"
                    placeholder={
                      searchBy === "rollNumber"
                        ? "Enter roll number"
                        : "e.g. RSF26-060001"
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-dark w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" />
                    ) : (
                      <i className="bi bi-search me-1" />
                    )}
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>

          {student && (
            <>
              <StudentPreviewCard
                student={student}
                center={SITE.examCentre}
                badge={
                  result?.published
                    ? { label: "Result Published", tone: "success" }
                    : result
                      ? { label: "Draft / Pending", tone: "warning" }
                      : { label: "No Result", tone: "secondary" }
                }
              />

              <div className="card border-0 shadow-sm mb-3">
                <div className="card-header bg-white fw-semibold">
                  Enter / Update Marks
                </div>
                <div className="card-body">
                  <p className="small text-muted mb-3">
                    कुल प्राप्तांक <strong>0–100</strong> · पासिंग 33% · Grade
                    A+ ≥80%
                  </p>
                  <div className="mb-3">
                    <label className="form-label small mb-1">
                      Total Marks / कुल अंक (out of 100) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      className="form-control form-control-lg fw-bold"
                      value={totalMarks}
                      onChange={(e) =>
                        setTotalMarks(
                          Math.min(100, Math.max(0, Number(e.target.value) || 0))
                        )
                      }
                    />
                  </div>
                  <div className="alert alert-light border small mb-0">
                    Obtained: <strong>{totalMarks}</strong> / 100
                    {totalMarks >= 33 ? (
                      <span className="badge text-bg-success ms-2">Pass</span>
                    ) : (
                      <span className="badge text-bg-danger ms-2">Fail</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-admin-success w-100 mt-3"
                    disabled={busy === "save"}
                    onClick={saveMarks}
                  >
                    <i className="bi bi-save me-1" /> Generate / Save Marks
                  </button>
                </div>
              </div>

              <div className="d-grid gap-2 mb-3">
                <div className="row g-2">
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-admin-orange w-100"
                      disabled={!result || busy === "publish"}
                      onClick={() => togglePublish(true)}
                    >
                      <i className="bi bi-cloud-upload me-1" />
                      Publish
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-admin-purple w-100"
                      disabled={!result || busy === "pdf"}
                      onClick={downloadPdf}
                    >
                      <i className="bi bi-download me-1" />
                      Download PDF
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-outline-dark w-100"
                      disabled={!result}
                      onClick={() => window.print()}
                    >
                      <i className="bi bi-printer me-1" />
                      Print
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100"
                      disabled={!result}
                      onClick={loadPdf}
                    >
                      <i className="bi bi-qr-code-scan me-1" />
                      Verify QR / PDF
                    </button>
                  </div>
                  <div className="col-12">
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100"
                      disabled={!result || busy === "publish"}
                      onClick={() => togglePublish(false)}
                    >
                      Unpublish
                    </button>
                  </div>
                </div>
              </div>

              <DocumentHistoryTable rows={history} />
            </>
          )}
        </div>

        <div className="col-lg-7" id="marksheet-preview">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
              <span className="fw-semibold">Marksheet Preview</span>
              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
                >
                  <i className="bi bi-zoom-out" />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setZoom(1)}
                >
                  100%
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))}
                >
                  <i className="bi bi-zoom-in" />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  disabled={!result}
                  onClick={loadPdf}
                >
                  <i className="bi bi-filetype-pdf" />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => window.print()}
                >
                  <i className="bi bi-printer" />
                </button>
              </div>
            </div>
            <div
              className="card-body bg-light overflow-auto"
              style={{ minHeight: 520 }}
            >
              {student && result ? (
                pdfUrl ? (
                  <iframe
                    title="Marksheet PDF"
                    src={pdfUrl}
                    className="w-100 bg-white border-0"
                    style={{ height: 640 }}
                  />
                ) : (
                  <MarksheetDocument
                    student={student}
                    result={result}
                    zoom={zoom}
                  />
                )
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-file-earmark-text display-4 d-block mb-2" />
                  Search a student to preview digital marksheet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
