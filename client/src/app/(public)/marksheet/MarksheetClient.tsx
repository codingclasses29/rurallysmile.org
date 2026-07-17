"use client";

import { FormEvent, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { marksheetService, type MarksheetData } from "@/services/marksheet.service";
import { MarksheetDocument } from "@/components/admin/MarksheetDocument";
import { portalForm } from "@/assets/portalStyles";
import Image from "next/image";
import { notify } from "@/components/ui/toast/Toast";

function errMsg(e: unknown, fb: string) {
  if (typeof e === "object" && e && "message" in e)
    return String((e as { message: string }).message);
  return fb;
}

export default function MarksheetClient() {
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MarksheetData | null>(null);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await marksheetService.getByRoll(
        rollNumber.trim().toUpperCase()
      );
      setData(res.data || null);
      notify.success("Marksheet loaded");
    } catch (err) {
      const m = errMsg(err, "Marksheet not available");
      setError(m);
      notify.error(m);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Digital Marksheet"
        description="Roll Number से डिजिटल मार्कशीट देखें / PDF डाउनलोड करें · कुल 100 अंक"
      />
      <div className="container-page section-pad pt-0">
        <div className="mx-auto max-w-3xl">
          <form
            onSubmit={onSubmit}
            className={`mb-6 ${portalForm.card}`}
          >
            <div className="mb-4 flex items-center gap-3 rounded-3 bg-dark p-3">
              <Image
                src="/icons/icons.png"
                alt="Rurally Smile Foundation"
                width={120}
                height={63}
                className="object-contain"
                style={{ height: 40, width: "auto" }}
              />
              <p className="mb-0 text-sm fw-bold text-info">Marksheet Lookup</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                className={`min-w-[200px] flex-1 ${portalForm.input}`}
                placeholder="Roll Number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-gradient-to-r from-[#1399A2] to-cyan-600 px-6 py-2.5 font-bold text-white shadow-lg disabled:opacity-60"
              >
                {loading ? "…" : "Get Marksheet"}
              </button>
            </div>
          </form>
          {error && <p className="mb-4 text-sm text-brand-danger">{error}</p>}

          {data?.student && data?.result && (
            <div className={`space-y-4 ${portalForm.previewWrap}`}>
              <MarksheetDocument
                student={data.student}
                result={data.result}
                zoom={1}
              />
              {data.result._id && (
                <a
                  href={marksheetService.downloadUrl(data.result._id)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-ui bg-brand-primary px-4 py-2 text-sm font-bold text-white"
                >
                  Download PDF (with logo)
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
