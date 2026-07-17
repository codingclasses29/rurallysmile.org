"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCards } from "@/components/admin/AdminStatCards";
import { StudentPreviewCard } from "@/components/admin/StudentPreviewCard";
import { DocumentHistoryTable } from "@/components/admin/DocumentHistoryTable";
import { AdmitCardDocument } from "@/components/admin/AdmitCardDocument";
import {
  adminService,
  type AdminStudent,
  type AdmitCardRow,
  type DashboardStats,
  type ExamCenter,
} from "@/services/admin.service";
import { notify } from "@/components/ui/toast/Toast";
import { SITE } from "@/constants/site";

function errMsg(err: unknown, fallback: string) {
  if (typeof err === "object" && err && "message" in err) {
    return String((err as { message: string }).message);
  }
  return fallback;
}

export default function AdminAdmitCardPage() {
  const searchParams = useSearchParams();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [admitStats, setAdmitStats] = useState({ total: 0, downloads: 0 });
  const [searchBy, setSearchBy] = useState<"rollNumber" | "registrationNumber">(
    "registrationNumber"
  );
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState("");
  const [student, setStudent] = useState<AdminStudent | null>(null);
  const [admit, setAdmit] = useState<AdmitCardRow | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const refreshMeta = useCallback(async () => {
    try {
      const [dash, list] = await Promise.all([
        adminService.dashboard(),
        adminService.listAdmits({ limit: 5 }),
      ]);
      setStats(dash.data || null);
      setAdmitStats(list.data?.stats || { total: 0, downloads: 0 });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    refreshMeta();
  }, [refreshMeta]);

  useEffect(() => {
    const reg = searchParams.get("reg");
    if (reg) {
      setSearchBy("registrationNumber");
      setQuery(reg.toUpperCase());
      (async () => {
        setLoading(true);
        try {
          const res = await adminService.lookupAdmit({
            registrationNumber: reg.toUpperCase(),
          });
          setStudent(res.data?.student || null);
          setAdmit(res.data?.admitCard || null);
        } catch {
          /* ignore auto-load errors */
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const onSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      notify.error("Enter registration / roll number");
      return;
    }
    setLoading(true);
    setPdfUrl(null);
    try {
      const res = await adminService.lookupAdmit({
        [searchBy]: query.trim(),
      });
      setStudent(res.data?.student || null);
      setAdmit(res.data?.admitCard || null);
      if (!res.data?.student) notify.error("Student not found");
      else if (!res.data?.admitCard)
        notify.error("Admit card not generated yet");
      else notify.success("Admit card loaded");
    } catch (err) {
      setStudent(null);
      setAdmit(null);
      notify.error(errMsg(err, "Search failed"));
    } finally {
      setLoading(false);
    }
  };

  const generate = async () => {
    if (!student?._id) return;
    setBusy("generate");
    try {
      const res = await adminService.generateAdmit(student._id);
      const payload = res.data as {
        admitCard?: AdmitCardRow;
        student?: AdminStudent;
      };
      if (payload?.admitCard) setAdmit(payload.admitCard);
      if (payload?.student) setStudent(payload.student);
      notify.success(res.message || "Admit card generated");
      refreshMeta();
    } catch (err) {
      notify.error(errMsg(err, "Generate failed — student must be Approved"));
    } finally {
      setBusy("");
    }
  };

  const regenerate = async () => {
    if (!admit?._id) return;
    setBusy("regen");
    try {
      const res = await adminService.regenerateAdmit(admit._id);
      const payload = res.data as { admitCard?: AdmitCardRow };
      if (payload?.admitCard) setAdmit(payload.admitCard);
      setPdfUrl(null);
      notify.success("Admit card regenerated");
      refreshMeta();
    } catch (err) {
      notify.error(errMsg(err, "Regenerate failed"));
    } finally {
      setBusy("");
    }
  };

  const loadPdf = async () => {
    if (!admit?._id) return;
    setBusy("pdf");
    try {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const url = await adminService.fetchPdfBlobUrl(
        `/admit/download/${admit._id}`
      );
      setPdfUrl(url);
      notify.success("PDF ready");
    } catch (err) {
      notify.error(errMsg(err, "PDF download failed"));
    } finally {
      setBusy("");
    }
  };

  const downloadPdf = () => {
    if (!pdfUrl) {
      loadPdf();
      return;
    }
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `admit-${student?.registrationNumber || "card"}.pdf`;
    a.click();
  };

  const centerName = useMemo(() => {
    if (!admit?.examCenter) return SITE.examCentre;
    if (typeof admit.examCenter === "string") return SITE.examCentre;
    const c = admit.examCenter as ExamCenter;
    return c.centerName || c.name || SITE.examCentre;
  }, [admit]);

  const history = useMemo(() => {
    if (!admit) return [];
    return [
      {
        at: admit.generatedAt
          ? new Date(admit.generatedAt).toLocaleString("en-IN")
          : "—",
        action: "Generated",
        by: "Admin",
      },
      {
        at: admit.updatedAt
          ? new Date(admit.updatedAt).toLocaleString("en-IN")
          : "—",
        action: `Downloads: ${admit.downloadCount ?? 0}`,
        by: "System",
      },
    ];
  }, [admit]);

  return (
    <div>
      <AdminPageHeader
        title="Admit Cards"
        crumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Admit Cards" },
          { label: "View Admit Card" },
        ]}
        backHref="/admin/dashboard"
      />

      <div className="d-flex justify-content-end mb-3">
        <Link
          href="/admin/students?status=Approved"
          className="btn btn-outline-primary"
        >
          <i className="bi bi-people me-1" />
          Select approved students for bulk generation
        </Link>
      </div>

      <AdminStatCards
        stats={[
          {
            label: "Total Admit Cards",
            value: admitStats.total || stats?.totalAdmitCards || "—",
            icon: "bi-card-heading",
            tone: "primary",
          },
          {
            label: "Approved Students",
            value: stats?.approvedStudents ?? "—",
            icon: "bi-person-check",
            tone: "success",
          },
          {
            label: "Pending Students",
            value: stats?.pendingStudents ?? "—",
            icon: "bi-hourglass-split",
            tone: "warning",
          },
          {
            label: "Downloads",
            value: admitStats.downloads,
            icon: "bi-download",
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
                    <option value="registrationNumber">
                      Registration Number
                    </option>
                    <option value="rollNumber">Roll Number</option>
                  </select>
                </div>
                <div className="col-12">
                  <input
                    className="form-control"
                    placeholder={
                      searchBy === "registrationNumber"
                        ? "RSF26-060001"
                        : "Enter roll number"
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
                center={centerName}
                badge={
                  admit
                    ? { label: "Admit Generated", tone: "success" }
                    : student.status === "Approved"
                      ? { label: "Ready to Generate", tone: "info" }
                      : {
                          label: student.status || "Pending",
                          tone: "warning",
                        }
                }
              />

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-admin-success w-100"
                    disabled={!admit}
                    onClick={() =>
                      document
                        .getElementById("admit-preview")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <i className="bi bi-eye me-1" />
                    Preview
                  </button>
                </div>
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-admin-purple w-100"
                    disabled={!admit || busy === "pdf"}
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
                    disabled={!admit}
                    onClick={() => window.print()}
                  >
                    <i className="bi bi-printer me-1" />
                    Print
                  </button>
                </div>
                <div className="col-6">
                  <a
                    className={`btn btn-admin-success w-100 ${!student?.mobile ? "disabled" : ""}`}
                    href={
                      student?.mobile
                        ? `https://wa.me/91${String(student.mobile).replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Your Pratibha Khoj 2026 Admit Card is ready. Reg: ${student.registrationNumber || ""}`
                          )}`
                        : undefined
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="bi bi-whatsapp me-1" />
                    WhatsApp
                  </a>
                </div>
                <div className="col-12">
                  <a
                    className={`btn btn-admin-orange w-100 ${!student?.email ? "disabled" : ""}`}
                    href={
                      student?.email
                        ? `mailto:${student.email}?subject=${encodeURIComponent(
                            "Pratibha Khoj 2026 Admit Card"
                          )}&body=${encodeURIComponent(
                            `Dear ${student.name || "Student"},\n\nYour admit card is ready.\nRegistration: ${student.registrationNumber || ""}\nRoll: ${student.rollNumber || ""}\n\n— Rurally Smile Foundation`
                          )}`
                        : undefined
                    }
                  >
                    <i className="bi bi-envelope me-1" />
                    Send Email
                  </a>
                </div>
                <div className="col-6">
                  {admit ? (
                    <button
                      type="button"
                      className="btn btn-outline-warning w-100"
                      disabled={busy === "regen"}
                      onClick={regenerate}
                    >
                      Reprint / Regenerate
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      disabled={
                        student.status !== "Approved" || busy === "generate"
                      }
                      onClick={generate}
                    >
                      Generate Admit
                    </button>
                  )}
                </div>
              </div>

              <DocumentHistoryTable rows={history} />
            </>
          )}
        </div>

        <div className="col-lg-7" id="admit-preview">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
              <span className="fw-semibold">Admit Card Preview</span>
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
                  disabled={!admit}
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
              {student && admit ? (
                pdfUrl ? (
                  <iframe
                    title="Admit PDF"
                    src={pdfUrl}
                    className="w-100 bg-white border-0"
                    style={{ height: 640 }}
                  />
                ) : (
                  <AdmitCardDocument
                    student={student}
                    admit={admit}
                    zoom={zoom}
                  />
                )
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-card-heading display-4 d-block mb-2" />
                  Search an approved student to preview admit card
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
