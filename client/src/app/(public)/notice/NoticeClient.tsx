"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { noticeService } from "@/services/notice.service";
import type { Notice } from "@/types";
import { notify } from "@/components/ui/toast/Toast";

export default function NoticeClient() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await noticeService.list();
        setNotices(res.data?.notices || []);
      } catch (err: unknown) {
        notify.error(
          typeof err === "object" && err && "message" in err
            ? String((err as { message: string }).message)
            : "Failed to load notices"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <PageHeader
        title="Notices"
        description="Latest published notices from the portal"
      />
      <div className="container-page section-pad pt-0">
        {loading && (
          <p className="text-center text-slate-400 py-10">Loading notices…</p>
        )}
        {!loading && notices.length === 0 && (
          <p className="text-center text-slate-400 py-10">
            No published notices yet
          </p>
        )}
        <div className="mx-auto grid max-w-3xl gap-4">
          {notices.map((n) => (
            <article
              key={n._id}
              className="rounded-ui-lg border border-brand-border bg-white p-5 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="font-heading text-lg font-bold text-brand-primary">
                  {n.title}
                </h2>
                {n.type && (
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-bold text-brand-secondary">
                    {n.type}
                  </span>
                )}
              </div>
              {n.titleHindi && (
                <p className="mt-1 text-sm text-slate-500">{n.titleHindi}</p>
              )}
              {n.description && (
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {n.description}
                </p>
              )}
              {n.createdAt && (
                <p className="mt-3 text-xs text-slate-400">
                  {new Date(n.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
