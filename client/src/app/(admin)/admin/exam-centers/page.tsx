"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { adminService, type ExamCenter } from "@/services/admin.service";
import { notify } from "@/components/ui/toast/Toast";

export default function AdminExamCentersPage() {
  const [items, setItems] = useState<ExamCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    centerCode: "",
    centerName: "उत्क्रमित उच्च विद्यालय, रतनपुरा",
    district: "Siwan",
    state: "Bihar",
    address: "Ratnpura, Siwan, Bihar",
    capacity: "200",
    reportingTime: "09:00 AM",
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.centers();
      const raw = res.data;
      const list = Array.isArray(raw)
        ? raw
        : raw && typeof raw === "object" && "centers" in raw
          ? (raw as { centers: ExamCenter[] }).centers
          : [];
      setItems(list);
    } catch (err: unknown) {
      notify.error(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to load centers"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.createCenter({
        ...form,
        capacity: Number(form.capacity) || 0,
      });
      notify.success("Exam center saved");
      await load();
    } catch (err: unknown) {
      notify.error(
        typeof err === "object" && err && "message" in err
          ? String((err as { message: string }).message)
          : "Save failed"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="h3 fw-bold mb-1">Exam Centers</h1>
      <p className="text-muted mb-4">Manage exam venues</p>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">Add Center</div>
            <div className="card-body">
              <form onSubmit={onCreate} className="vstack gap-3">
                <input
                  className="form-control"
                  placeholder="Unique center code (e.g. RSF-SIWAN-01)"
                  value={form.centerCode}
                  onChange={(e) =>
                    setForm({ ...form, centerCode: e.target.value.toUpperCase() })
                  }
                  required
                />
                <input
                  className="form-control"
                  placeholder="Center name"
                  value={form.centerName}
                  onChange={(e) => setForm({ ...form, centerName: e.target.value })}
                  required
                />
                <input
                  className="form-control"
                  placeholder="District"
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                />
                <input
                  className="form-control"
                  placeholder="Address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
                <div className="row g-2">
                  <div className="col-6">
                    <input
                      className="form-control"
                      placeholder="Capacity"
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      className="form-control"
                      placeholder="Reporting time"
                      value={form.reportingTime}
                      onChange={(e) =>
                        setForm({ ...form, reportingTime: e.target.value })
                      }
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Save Center"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">Centers List</div>
            <div className="table-responsive">
              <table className="table mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>District</th>
                    <th>Capacity</th>
                    <th>Active</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        <div className="spinner-border spinner-border-sm" />
                      </td>
                    </tr>
                  )}
                  {!loading && items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-muted text-center py-3">
                        No centers
                      </td>
                    </tr>
                  )}
                  {items.map((c) => (
                    <tr key={c._id}>
                      <td>{c.centerName || c.name}</td>
                      <td>{c.district}</td>
                      <td>{c.capacity ?? "—"}</td>
                      <td>
                        <span
                          className={`badge text-bg-${c.isActive === false ? "secondary" : "success"}`}
                        >
                          {c.isActive === false ? "No" : "Yes"}
                        </span>
                      </td>
                      <td>
                        {c.isActive !== false ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={async () => {
                              if (!window.confirm("Deactivate this center?")) return;
                              try {
                                await adminService.deleteCenter(c._id);
                                notify.success("Center deactivated");
                                await load();
                              } catch (err: unknown) {
                                notify.error(
                                  typeof err === "object" && err && "message" in err
                                    ? String((err as { message: string }).message)
                                    : "Failed"
                                );
                              }
                            }}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
