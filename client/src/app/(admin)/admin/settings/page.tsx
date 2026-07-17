"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { notify } from "@/components/ui/toast/Toast";

type SettingsShape = {
  registrationOpen?: boolean;
  siteName?: string;
  examDate?: string;
  contactPhone?: string;
  contactEmail?: string;
  [key: string]: unknown;
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsShape>({
    registrationOpen: true,
    siteName: "Pratibha Khoj Competition 2026",
    examDate: "2026-09-05",
    contactPhone: "9934276672",
    contactEmail: "support@rurallysmile.org",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminService.settings();
        const raw = res.data as { setting?: SettingsShape } | SettingsShape | null;
        const setting =
          raw && typeof raw === "object" && "setting" in raw && raw.setting
            ? raw.setting
            : (raw as SettingsShape);
        if (setting && typeof setting === "object") {
          setForm((f) => ({
            ...f,
            ...setting,
            siteName: String(
              (setting as SettingsShape).siteName || f.siteName || ""
            ),
            examDate: String(
              (setting as SettingsShape).examDate || f.examDate || ""
            ).slice(0, 10),
            contactPhone: Array.isArray(
              (setting as { contactPhone?: string[] | string }).contactPhone
            )
              ? String(
                  ((setting as { contactPhone: string[] }).contactPhone || [])[0] ||
                    f.contactPhone
                )
              : String(
                  (setting as { contactPhone?: string }).contactPhone ||
                    f.contactPhone ||
                    ""
                ),
            contactEmail: String(
              (setting as { contactEmail?: string }).contactEmail ||
                f.contactEmail ||
                ""
            ),
          }));
        }
      } catch (err: unknown) {
        notify.error(
          typeof err === "object" && err && "message" in err
            ? String((err as { message: string }).message)
            : "Failed to load settings"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateSettings({
        ...form,
        siteName: String(form.siteName || ""),
        contactPhone: [String(form.contactPhone || "")].filter(Boolean),
      });
      notify.success("Settings saved");
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

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="h3 fw-bold mb-1">Settings</h1>
      <p className="text-muted mb-4">Portal configuration (connected to `/settings` API)</p>

      <div className="card border-0 shadow-sm" style={{ maxWidth: 640 }}>
        <div className="card-body">
          <form onSubmit={onSave} className="vstack gap-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="regOpen"
                checked={Boolean(form.registrationOpen)}
                onChange={(e) =>
                  setForm({ ...form, registrationOpen: e.target.checked })
                }
              />
              <label className="form-check-label" htmlFor="regOpen">
                Registration Open
              </label>
            </div>
            <div>
              <label className="form-label">Exam Name</label>
              <input
                className="form-control"
                value={String(form.siteName || "")}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Exam Date</label>
              <input
                type="date"
                className="form-control"
                value={String(form.examDate || "").slice(0, 10)}
                onChange={(e) => setForm({ ...form, examDate: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Contact Phone</label>
              <input
                className="form-control"
                value={String(form.contactPhone || "")}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                className="form-control"
                value={String(form.contactEmail || "")}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save Settings"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
