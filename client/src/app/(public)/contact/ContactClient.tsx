"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/Card";
import { SITE } from "@/constants/site";
import { settingsService, type PortalSettings } from "@/services/settings.service";
import { centerService, type PublicExamCenter } from "@/services/center.service";

export default function ContactClient() {
  const [setting, setSetting] = useState<PortalSettings | null>(null);
  const [centers, setCenters] = useState<PublicExamCenter[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [s, c] = await Promise.all([
          settingsService.get(),
          centerService.list(),
        ]);
        setSetting(s.data?.setting || null);
        setCenters(c.data?.centers || []);
      } catch {
        /* SITE fallback */
      }
    })();
  }, []);

  const phones = setting?.contactPhone
    ? [setting.contactPhone]
    : SITE.phones;
  const website = setting?.contactWebsite || SITE.website;
  const examDate = setting?.examDate
    ? new Date(setting.examDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : SITE.examDateLabel;

  return (
    <>
      <PageHeader
        title="Contact Us"
        description="Rurally Smile Foundation office और exam centre जानकारी।"
      />
      <section className="container-page section-pad grid gap-6 pt-8 md:grid-cols-2" aria-label="Contact information">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-700 to-orange-500" />
          <h2 className="font-heading text-xl font-bold">Office</h2>
          <address className="not-italic">
            <p className="mt-3 text-slate-600">
              {setting?.siteName || SITE.org}
            </p>
          <p className="mt-4 text-sm text-slate-500">Phone</p>
          {phones.map((p) => (
            <a
              key={p}
              href={`tel:${p}`}
              className="foundation-link block"
            >
              {p}
            </a>
          ))}
          <p className="mt-4 text-sm text-slate-500">Website</p>
          <a
            href={website.startsWith("http") ? website : `https://${website}`}
            className="foundation-link"
            target="_blank"
            rel="noreferrer"
          >
            {website.replace(/^https?:\/\//, "")}
          </a>
          </address>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-teal-700" />
          <h2 className="font-heading text-xl font-bold">Exam Centre</h2>
          {centers.length === 0 ? (
            <>
              <p className="mt-3 text-slate-600">{SITE.examCentre}</p>
              <p className="mt-2 text-slate-500">{SITE.examCentreEn}</p>
            </>
          ) : (
            <ul className="mt-3 space-y-4">
              {centers.map((c) => (
                <li key={c._id}>
                  <p className="font-semibold text-brand-primary dark:text-white">
                    {c.centerNameHindi || c.centerName || c.name}
                  </p>
                  <p className="text-sm text-slate-600">{c.address}</p>
                  <p className="text-xs text-slate-400">
                    {[c.district, c.state].filter(Boolean).join(" · ")}
                    {c.reportingTime ? ` · Report ${c.reportingTime}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-sm text-slate-500">Exam Date</p>
          <p className="font-semibold">{examDate}</p>
        </Card>
      </section>
    </>
  );
}
