"use client";

import { FormEvent, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { admitService, type AdmitLookup } from "@/services/admit.service";
import { AdmitCardDocument } from "@/components/admin/AdmitCardDocument";
import type { AdminStudent, AdmitCardRow } from "@/services/admin.service";
import { portalForm } from "@/assets/portalStyles";
import Image from "next/image";
import { notify } from "@/components/ui/toast/Toast";

function errMsg(e: unknown, fb: string) {
  if (typeof e === "object" && e && "message" in e)
    return String((e as { message: string }).message);
  return fb;
}

export default function AdmitCardClient() {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [data, setData] = useState<AdmitLookup | null>(null);
  const [error, setError] = useState("");

  const verifyParams = () => ({
    mobile: mobile || undefined,
    dob: dob || undefined,
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await admitService.getByRegistration(
        registrationNumber.trim().toUpperCase(),
        verifyParams()
      );
      setData(res.data || null);
      notify.success(res.message || "Admit card found");
    } catch (err) {
      const m = errMsg(err, "Admit card not found");
      setError(m);
      notify.error(m);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    const reg =
      data?.student?.registrationNumber ||
      registrationNumber.trim().toUpperCase();
    if (!reg) {
      notify.error("Registration number required");
      return;
    }
    setDownloading(true);
    try {
      const blob = await admitService.downloadPdf(reg, verifyParams());
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Admit-Card-${reg}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      notify.success("Admit Card PDF downloaded (English)");
    } catch (err) {
      notify.error(errMsg(err, "PDF download failed"));
    } finally {
      setDownloading(false);
    }
  };

  const student = data?.student as AdminStudent | undefined;
  const admit = data?.admitCard as AdmitCardRow | undefined;

  return (
    <>
      <PageHeader
        title="Download Admit Card"
        description="Registration Number से Admit Card देखें / PDF डाउनलोड करें (Approved students)"
      />
      <div className="container-page section-pad pt-0">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[320px_1fr]">
          <form onSubmit={onSubmit} className={portalForm.card}>
              <div className="mb-4 flex items-center gap-3 rounded-3 bg-dark p-3">
              <Image
                src="/icons/icons.png"
                alt="Rurally Smile Foundation"
                width={120}
                height={63}
                className="object-contain"
                style={{ height: 40, width: "auto" }}
              />
              <p className="mb-0 text-sm fw-bold text-info">Admit Card Lookup</p>
            </div>
            <label className={portalForm.label}>Registration Number *</label>
            <input
              className={`mb-3 ${portalForm.input}`}
              value={registrationNumber}
              onChange={(e) =>
                setRegistrationNumber(e.target.value.toUpperCase())
              }
              placeholder="RSF26-060001"
              required
            />
            <label className={portalForm.label}>Mobile (optional verify)</label>
            <input
              className={`mb-3 ${portalForm.input}`}
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="10-digit mobile"
            />
            <label className={portalForm.label}>Date of Birth (optional)</label>
            <input
              type="date"
              className={`mb-4 ${portalForm.input}`}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className={portalForm.button}
            >
              {loading ? "Searching…" : "Get Admit Card"}
            </button>

            {student && admit && (
              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  disabled={downloading}
                  onClick={() => void downloadPdf()}
                  className="w-full rounded-ui bg-emerald-600 px-4 py-2.5 font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {downloading
                    ? "Downloading…"
                    : "Download PDF (English)"}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full rounded-ui border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Print Preview
                </button>
              </div>
            )}

            {error && (
              <p className="mt-3 text-sm font-medium text-brand-danger">{error}</p>
            )}
          </form>

          <div className={portalForm.previewWrap}>
            {!data && (
              <p className="py-16 text-center text-sm text-slate-500">
                Admit card preview yahan dikhega — Get ke baad Download PDF
                button use karein
              </p>
            )}
            {student && admit && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 print:hidden">
                  <button
                    type="button"
                    disabled={downloading}
                    onClick={() => void downloadPdf()}
                    className="rounded-ui bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {downloading ? "Downloading…" : "⬇ Download PDF (English)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="rounded-ui border border-slate-300 bg-white px-4 py-2 text-sm font-semibold"
                  >
                    Print
                  </button>
                </div>
                <AdmitCardDocument student={student} admit={admit} zoom={1} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
