"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  adminService,
  type AdminStudent,
} from "@/services/admin.service";
import { notify } from "@/components/ui/toast/Toast";

export default function StudentsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [cls, setCls] = useState(searchParams.get("class") || "");
  const [centre, setCentre] = useState(searchParams.get("centre") || "");
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "");
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busyId, setBusyId] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);

  useEffect(() => {
    setStatus(searchParams.get("status") || "");
    setSearch(searchParams.get("search") || "");
    setCls(searchParams.get("class") || "");
    setCentre(searchParams.get("centre") || "");
    setDateFrom(searchParams.get("dateFrom") || "");
    setDateTo(searchParams.get("dateTo") || "");
    setPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  const filters = useMemo(
    () => ({
      ...(status ? { status } : {}),
      ...(search ? { search } : {}),
      ...(cls ? { class: cls } : {}),
      ...(centre ? { centre } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
    }),
    [status, search, cls, centre, dateFrom, dateTo]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.students({
        ...filters,
        page,
        limit: 25,
        sort: "-createdAt",
      });
      setItems(Array.isArray(res.data) ? res.data : []);
      setTotal(res.pagination?.total || 0);
      setPages(
        res.pagination?.pages ||
          Math.max(1, Math.ceil((res.pagination?.total || 0) / 25))
      );
      setSelected(new Set());
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to load students";
      notify.error(message);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const approve = async (id: string) => {
    setBusyId(id);
    try {
      await adminService.approveStudent(id);
      notify.success("Student approved");
      await load();
    } catch (err: unknown) {
      notify.error(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Approve failed"
      );
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (id: string) => {
    const reason =
      window.prompt("Rejection reason?", "Incomplete documents") || "";
    if (!reason) return;
    setBusyId(id);
    try {
      await adminService.rejectStudent(id, reason);
      notify.success("Student rejected");
      await load();
    } catch (err: unknown) {
      notify.error(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Reject failed"
      );
    } finally {
      setBusyId(null);
    }
  };

  const restore = async (id: string) => {
    if (!window.confirm("Restore this rejected registration to Pending?")) return;
    setBusyId(id);
    try {
      await adminService.restoreStudent(id);
      notify.success("Registration restored to Pending");
      await load();
    } catch (err: unknown) {
      notify.error(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Restore failed"
      );
    } finally {
      setBusyId(null);
    }
  };

  const admit = async (id: string) => {
    setBusyId(id);
    try {
      await adminService.generateAdmit(id);
      notify.success("Admit card generated");
    } catch (err: unknown) {
      notify.error(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Admit generation failed"
      );
    } finally {
      setBusyId(null);
    }
  };

  const applyFilters = (event?: FormEvent) => {
    event?.preventDefault();
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });
    query.set("page", "1");
    router.push(`/admin/students?${query.toString()}`);
  };

  const goToPage = (next: number) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set("page", String(next));
    router.push(`/admin/students?${query.toString()}`);
  };

  const bulkGenerate = async (allFiltered = false) => {
    const count = allFiltered ? total : selected.size;
    if (
      !count ||
      !window.confirm(
        `Generate admit cards for ${count}${allFiltered ? " filtered" : " selected"} approved student(s)?`
      )
    )
      return;
    setBulkBusy(true);
    try {
      const res = await adminService.generateAdmitsBulk(
        allFiltered
          ? { filters: { ...filters, status: "Approved" } }
          : { studentIds: [...selected] }
      );
      const report = res.data?.report;
      notify.success(
        `Admits: ${report?.created || 0} created, ${report?.existing || 0} existing, ${report?.failed || 0} failed`
      );
      setSelected(new Set());
    } catch (err: unknown) {
      notify.error(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Bulk admit generation failed"
      );
    } finally {
      setBulkBusy(false);
    }
  };

  const badge = (s?: string) => {
    if (s === "Approved") return "success";
    if (s === "Rejected") return "danger";
    return "warning";
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <p className="text-uppercase text-primary fw-semibold mb-1" style={{ fontSize: 11 }}>
            👨‍🎓 Student Management
          </p>
          <h1 className="h3 fw-bold mb-1">
            {dateFrom || dateTo
              ? "New Students"
              : status
                ? `${status} Students`
                : "All Students"}
          </h1>
          <p className="text-muted mb-0">
            {total.toLocaleString("en-IN")} matching registrations
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link href="/registration" className="btn btn-admin-success">
            <i className="bi bi-person-plus me-1" /> Public Registration Form
          </Link>
          <Link href="/admin/students/upload" className="btn btn-outline-success">
            <i className="bi bi-file-earmark-excel me-1" /> Student Excel Import
          </Link>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => void load()}
          >
            <i className="bi bi-arrow-clockwise me-1" /> Refresh
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: "1rem" }}>
        <div className="card-header bg-white fw-semibold border-0 pt-3">
          🔍 Search Student
        </div>
        <div className="card-body pt-0">
          <form className="row g-2" onSubmit={applyFilters}>
            <div className="col-md-4">
              <input
                className="form-control"
                aria-label="Search students"
                placeholder="Name, mobile, email, registration or roll"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={cls}
                onChange={(e) => setCls(e.target.value)}
              >
                <option value="">All Classes</option>
                {["7", "8", "9", "10"].map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <input
                className="form-control"
                aria-label="Exam centre"
                placeholder="Centre code or name"
                value={centre}
                onChange={(e) => setCentre(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                aria-label="Registration date from"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                aria-label="Registration date to"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                <i className="bi bi-funnel me-1" /> Apply
              </button>
            </div>
          </form>
        </div>
      </div>

      {status === "Approved" && (
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3" role="region" aria-label="Bulk admit actions">
          <button
            type="button"
            className="btn btn-primary"
            disabled={bulkBusy || selected.size === 0}
            onClick={() => void bulkGenerate(false)}
          >
            Generate for selected ({selected.size})
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={bulkBusy || total === 0}
            onClick={() => void bulkGenerate(true)}
          >
            Generate for all filtered ({Math.min(total, 500)})
          </button>
          <span className="small text-muted">Bulk generation is limited to 500 students.</span>
        </div>
      )}

      <div className="card border-0 shadow-sm" style={{ borderRadius: "1rem" }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 admin-table">
            <thead className="table-light">
              <tr>
                {status === "Approved" && <th scope="col">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    aria-label="Select all approved students on this page"
                    checked={items.length > 0 && items.every((item) => selected.has(item._id))}
                    onChange={(e) =>
                      setSelected(
                        e.target.checked
                          ? new Set(items.map((item) => item._id))
                          : new Set()
                      )
                    }
                  />
                </th>}
                <th>Photo</th>
                <th>Name</th>
                <th>Class</th>
                <th>Roll No</th>
                <th>Reg No</th>
                <th>School</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={status === "Approved" ? 9 : 8} className="text-center py-5">
                    <div className="spinner-border text-primary" />
                  </td>
                </tr>
              )}
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={status === "Approved" ? 9 : 8} className="text-center text-muted py-4">
                    No students found
                  </td>
                </tr>
              )}
              {!loading &&
                items.map((s) => (
                  <tr key={s._id}>
                    {status === "Approved" && (
                      <td>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          aria-label={`Select ${s.name}`}
                          checked={selected.has(s._id)}
                          onChange={(e) =>
                            setSelected((current) => {
                              const next = new Set(current);
                              if (e.target.checked) next.add(s._id);
                              else next.delete(s._id);
                              return next;
                            })
                          }
                        />
                      </td>
                    )}
                    <td>
                      {s.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={s.photo}
                          alt=""
                          className="student-thumb"
                        />
                      ) : (
                        <div
                          className="student-thumb d-flex align-items-center justify-content-center bg-light text-muted"
                        >
                          👤
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="fw-semibold">{s.name}</div>
                      <div className="small text-muted">{s.fatherName}</div>
                    </td>
                    <td>{s.class}</td>
                    <td>
                      <code>{s.rollNumber || "—"}</code>
                    </td>
                    <td>
                      <code className="small">{s.registrationNumber || "—"}</code>
                    </td>
                    <td className="small">{s.schoolName || "—"}</td>
                    <td>
                      <span className={`badge text-bg-${badge(s.status)}`}>
                        {s.status === "Approved"
                          ? "✅ Approved"
                          : s.status === "Rejected"
                            ? "❌ Rejected"
                            : "⏳ Pending"}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        {s.status === "Pending" && (
                          <>
                            <button
                              type="button"
                              className="btn btn-admin-success"
                              disabled={busyId === s._id}
                              onClick={() => void approve(s._id)}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              disabled={busyId === s._id}
                              onClick={() => void reject(s._id)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {s.status === "Approved" && (
                          <>
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              disabled={busyId === s._id}
                              onClick={() => void admit(s._id)}
                              title="Generate Admit"
                            >
                              <i className="bi bi-card-heading" />
                            </button>
                            <Link
                              href={`/admin/admit-card?reg=${encodeURIComponent(s.registrationNumber || "")}`}
                              className="btn btn-admin-purple"
                              title="View / Print"
                            >
                              <i className="bi bi-printer" />
                            </Link>
                            <Link
                              href={`/admin/marksheet?roll=${encodeURIComponent(s.rollNumber || "")}`}
                              className="btn btn-outline-secondary"
                              title="Marksheet"
                            >
                              <i className="bi bi-file-earmark-text" />
                            </Link>
                          </>
                        )}
                        {s.status === "Rejected" && (
                          <button
                            type="button"
                            className="btn btn-outline-warning"
                            disabled={busyId === s._id}
                            onClick={() => void restore(s._id)}
                            title={s.rejectionReason || "Restore to Pending"}
                          >
                            Restore
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <nav className="d-flex justify-content-between align-items-center mt-3" aria-label="Student list pagination">
        <span className="small text-muted">
          Page {page} of {pages} · {total.toLocaleString("en-IN")} students
        </span>
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={page <= 1 || loading}
            onClick={() => goToPage(page - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            disabled={page >= pages || loading}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </button>
        </div>
      </nav>
    </div>
  );
}
